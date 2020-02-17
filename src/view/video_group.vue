<template>
  <div class="video_group">
    <div class="video_group-left">
      <div class="left-container">
        <ul>
          <li class="video-item">
            <div class="item-info">{{user.nickName}}</div>
            <div class="item-video">
              <video autoPlay ref="localVideo"></video>
            </div>
          </li>
          <li class="video-item" v-if="item.user.id !== user.id" v-for="(item, index) in listData" :key="index">
            <div class="item-info">{{item.name}}</div>
            <div class="item-video">
              <video autoPlay :ref="'video_' + item.user.id"></video>
            </div>
          </li>
        </ul>
      </div>
      <div class="left-tool">
        <div class="tool-btn">
          <el-button :icon="audioIcon" circle @click="audioSwitch"></el-button>
        </div>
        <div class="tool-btn">
          <el-button :icon="videoIcon" circle @click="videoSwitch"></el-button>
        </div>
        <div class="tool-btn">
          <el-button size="mini" type="danger" @click="leaveRoom">退出</el-button>
        </div>
        <div class="tool-btn">
          <el-button icon="el-icon-edit-outline" circle @click="boardSwitch"></el-button>
        </div>
      </div>
    </div>
    <div class="video_group-right" v-if="boardShow">
      <div class="right-board">sss</div>
      <div class="right-tool"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video_group',
  data () {
    return {
      searchVal: '',
      localStream: null,
      boardShow: false,
      MediaStreamAudio: null,
      audioIcon: 'el-icon-microphone',
      MediaStreamVideo: null,
      videoIcon: 'el-icon-camera-solid',
      listData: [],
      localPeer: null,
      remotePeerMap: {}
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    videoGroupId: function () {
      return this.$route.params.row.id
    }
  },
  sockets: {
    VideoGroupIce: function (data) {
      if (this.user.id !== data.userId) {
        console.log('ICE', data)
        if (data.type === 'local') {
          if (Object.keys(this.remotePeerMap).length) {
            this.remotePeerMap['remotePeer' + data.userId].addIceCandidate(data.data)
          }
        }
        if (data.type === 'remote') {
          this.localPeer.addIceCandidate(data.data)
        }
      }
    },
    VideoGroupOffer: function (data) {
      if (this.user.id !== data.userId) {
        console.log('OFFER', data)
        this.createAns(data)
      }
    },
    VideoGroupAnswer: function (data) {
      if (this.user.id !== data.userId) {
        console.log('ANSWER', data)
        this.localPeer.setRemoteDescription(data.data)
      }
    },
    VideoGroupNotice: function (data) {
      if (this.user.id !== data.userId) {
        this.getVideoGroupUserList()
      }
    }
  },
  created () {
    this.getVideoGroupUserList()
    this.getUserMedia()
  },
  methods: {
    // 获取视频会议成员
    getVideoGroupUserList () {
      this.$api.videoGroup.getVideoGroupUserList({
        id: this.$route.params.row.id
      }).then((res) => {
        if (res.status) {
          this.listData = res.data
          this.getUserMedia()
          this.createRemotePeer(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取流媒体
    getUserMedia () {
      let self = this
      let constraints = {
        audio: true,
        video: true
      }
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (!navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          let getUserMedia = (navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia)

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        /* 使用这个stream stream */
        this.$refs.localVideo.srcObject = stream
        // 保存视频流
        this.localStream = stream
        // 获取音频对象
        this.getAudio()
        this.createPeerConnection()
      }).catch((err) => {
        if (err) {
          self.$message.error('无法获取摄像头')
        }
      })
    },
    // 创建本地视频连接实例
    createPeerConnection () {
      if (this.localStream && this.listData.length) {
        let PeerConnection = window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection
        this.localPeer = new PeerConnection()
        this.localPeer.addStream(this.localStream)
        // 创建offer
        this.localPeer.createOffer().then(offer => {
          this.localPeer.setLocalDescription(offer).then(() => {
            console.log(offer)
            this.sendOffer(offer)
          })
        })
        // 创建信令
        this.localPeer.onicecandidate = (e) => {
          if (e.candidate) {
            this.sendIce('local', e.candidate)
          }
        }
      } else {
        setTimeout(() => {
          this.createPeerConnection()
        }, 200)
      }
    },
    // 创建远程视频连接实例
    createRemotePeer (list) {
      if (this.localStream && list.length) {
        let PeerConnection = window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection
        list.forEach((item) => {
          if (item.user.id !== this.user.id) {
            this.remotePeerMap['remotePeer' + item.user.id] = new PeerConnection()
            // 监听从对方过来的媒体流
            this.remotePeerMap['remotePeer' + item.user.id].onaddstream = (e) => {
              if (e.stream) {
                let tVideo = this.$refs['video_' + item.user.id]
                tVideo[0].srcObject = e.stream
              }
            }
          }
        })
      } else {
        setTimeout(() => {
          this.createRemotePeer(list)
        }, 200)
      }
    },
    // 创建offer
    createAns (res) {
      if (Object.keys(this.remotePeerMap).length) {
        this.remotePeerMap['remotePeer' + res.userId].setRemoteDescription(res.data).then(() => {
          this.remotePeerMap['remotePeer' + res.userId].onicecandidate = (e) => {
            if (e.candidate) {
              this.sendIce('remote', e.candidate)
            }
          }
          this.remotePeerMap['remotePeer' + res.userId].createAnswer().then(answer => {
            this.remotePeerMap['remotePeer' + res.userId].setLocalDescription(answer)
            this.sendAnswer(answer)
          })
        })
        this.remotePeerMap['remotePeer' + res.userId].ondatachannel = function (e) {
          let sendChannel = e.channel
          sendChannel.onmessage = (e) => {
            console.log(e.data)
          }
        }
      } else {
        setTimeout(() => {
          this.createAns(res)
        }, 100)
      }
    },
    // 发送ICE
    sendIce (type, data) {
      this.$socket.emit('video_group_ice', {
        type: type,
        userId: this.user.id,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 发送信令
    sendOffer (data) {
      this.$socket.emit('video_group_offer', {
        userId: this.user.id,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 发送应答
    sendAnswer (data) {
      this.$socket.emit('video_group_answer', {
        userId: this.user.id,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 获取Audio对象
    getAudio () {
      let tracks = this.localStream.getTracks()
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'audio') {
          this.MediaStreamAudio = tracks[i]
        }
        if (tracks[i].kind === 'video') {
          this.MediaStreamVideo = tracks[i]
        }
      }
    },
    // 关闭/开启声音
    audioSwitch () {
      this.MediaStreamAudio.enabled = !this.MediaStreamAudio.enabled
      this.audioIcon = this.MediaStreamAudio.enabled ? 'el-icon-microphone' : 'el-icon-turn-off-microphone'
    },
    // 关闭摄像头
    videoSwitch () {
      this.MediaStreamVideo.enabled = !this.MediaStreamVideo.enabled
      this.videoIcon = this.MediaStreamVideo.enabled ? 'el-icon-camera-solid' : 'el-icon-camera'
    },
    // 打开白板
    boardSwitch () {
      this.boardShow = !this.boardShow
    },
    // 退出/结束会议
    leaveRoom () {
      this.$api.videoGroup.delVideoGroupUser({
        id: this.$route.params.memberId
      }).then((res) => {
        if (res.status) {
          let data = {
            videoGroupId: this.videoGroupId,
            userId: this.user.id
          }
          this.$socket.emit('video_group_room_leave', data)
          this.$router.push({
            path: '/index/video_groupList'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/video_group.css";
</style>
