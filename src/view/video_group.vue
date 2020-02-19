<template>
  <div class="video_group">
    <div class="video_group-left">
      <div class="left-container">
        <ul>
          <li class="video-item" v-for="(item, index) in listData" :key="index">
            <div class="item-info">{{item.user.nickName}}</div>
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
      <Board
        v-if="boardShow"
        :remoteChannelMap="remoteChannelMap"
        :localChannelMap="localChannelMap">
      </Board>
    </div>
  </div>
</template>

<script>
import Board from '../components/board/board'

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
      localPeerMap: {},
      remotePeerMap: {},
      localChannelMap: {},
      remoteChannelMap: {},
      configuration: {
        iceServers: [{
          urls: 'turn:68.168.128.247:3478',
          username: 'dubo',
          credential: '113655'
        }, {
          urls: [
            'stun:68.168.128.247:3478'
          ]
        }]
      }
    }
  },
  components: {
    Board
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
      if (this.user.id === data.targetId) {
        if (data.type === 'local') {
          if (Object.keys(this.remotePeerMap).includes('remotePeer' + data.userId)) {
            this.remotePeerMap['remotePeer' + data.userId].addIceCandidate(data.data)
          }
        }
        if (data.type === 'remote') {
          this.localPeerMap['localPeer' + data.userId].addIceCandidate(data.data)
        }
      }
    },
    VideoGroupOffer: function (data) {
      if (this.user.id === data.targetId) {
        this.createAns(data)
      }
    },
    VideoGroupAnswer: function (data) {
      if (this.user.id === data.targetId) {
        this.localPeerMap['localPeer' + data.userId].setRemoteDescription(data.data)
      }
    },
    VideoGroupJoin: function (data) {
      if (this.user.id !== data.userId) {
        this.getVideoGroupUserList()
      }
    },
    VideoGroupLeave: function (data) {
      if (this.user.id !== data.userId) {
        this.localPeerMap['localPeer' + data.userId].close()
        this.remotePeerMap['remotePeer' + data.userId].close()
        delete this.localPeerMap['localPeer' + data.userId]
        delete this.remotePeerMap['remotePeer' + data.userId]
        this.getVideoGroupUserList()
      }
    }
  },
  created () {
    this.getVideoGroupUserList()
  },
  methods: {
    // 获取视频会议成员
    getVideoGroupUserList () {
      this.$api.videoGroup.getVideoGroupUserList({
        id: this.$route.params.row.id
      }).then((res) => {
        if (res.status) {
          this.listData = res.data
          for (let i = 0; i < this.listData.length; i++) {
            this.listData[i]['isLoading'] = true
          }
          this.getUserMedia()
          this.createLocalPeer(this.listData)
          this.createRemotePeer(this.listData)
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
        let video = this.$refs['video_' + this.user.id]
        video[0].srcObject = stream
        this.localStream = stream
        // 获取音频对象
        this.getAudio()
      }).catch((err) => {
        if (err) {
          console.log(err)
          self.$message.error('无法获取摄像头')
        }
      })
    },
    // 创建本地视频连接实例
    createLocalPeer (list) {
      let self = this
      if (this.localStream && list.length) {
        let PeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection
        for (let i = 0; i < list.length; i++) {
          let userId = list[i].user.id
          if (userId !== this.user.id) {
            this.localPeerMap['localPeer' + userId] = new PeerConnection(this.configuration)
            this.localPeerMap['localPeer' + userId].addStream(this.localStream)
            // 监听peer连接状态
            this.localPeerMap['localPeer' + userId].onconnectionstatechange = function () {
              let status = self.localPeerMap['localPeer' + userId].connectionState
              console.log('local', status)
            }
            // 创建数据通道
            this.createLocalChannel(userId, this.localPeerMap['localPeer' + userId])
            // 创建信令
            this.localPeerMap['localPeer' + userId].onicecandidate = (e) => {
              if (e.candidate) {
                this.sendIce('local', userId, e.candidate)
              }
            }
            // 创建offer
            this.localPeerMap['localPeer' + userId].createOffer().then(offer => {
              this.localPeerMap['localPeer' + userId].setLocalDescription(offer).then(() => {
                this.sendOffer(userId, offer)
              })
            })
          }
        }
      } else {
        setTimeout(() => {
          this.createLocalPeer(list)
        }, 200)
      }
    },
    // 创建远程视频连接实例
    createRemotePeer (list) {
      let self = this
      if (this.localStream && list.length) {
        let PeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection
        for (let i = 0; i < list.length; i++) {
          let userId = list[i].user.id
          if (userId !== this.user.id) {
            this.remotePeerMap['remotePeer' + userId] = new PeerConnection(this.configuration)
            // 监听peer连接状态
            this.remotePeerMap['remotePeer' + userId].onconnectionstatechange = function () {
              let status = self.remotePeerMap['remotePeer' + userId].connectionState
              console.log('remote', status)
              if (status === 'connected') {}
              if (status === 'failed') {
                self.$message.error('连接时发生错误，请退出重新加入。')
              }
            }
            // 监听从对方过来的媒体流
            this.remotePeerMap['remotePeer' + userId].onaddstream = (e) => {
              if (e.stream) {
                console.log(e.stream)
                let tVideo = this.$refs['video_' + userId]
                tVideo[0].srcObject = e.stream
              }
            }
          }
        }
      } else {
        setTimeout(() => {
          this.createRemotePeer(list)
        }, 200)
      }
    },
    // 创建offer
    createAns (res) {
      let self = this
      if (Object.keys(this.remotePeerMap).length) {
        this.remotePeerMap['remotePeer' + res.userId].setRemoteDescription(res.data).then(() => {
          this.remotePeerMap['remotePeer' + res.userId].onicecandidate = (e) => {
            if (e.candidate) {
              this.sendIce('remote', res.userId, e.candidate)
            }
          }
          this.remotePeerMap['remotePeer' + res.userId].createAnswer().then(answer => {
            this.remotePeerMap['remotePeer' + res.userId].setLocalDescription(answer)
            this.sendAnswer(res.userId, answer)
          })
        })
        // 监听数据通道
        this.remotePeerMap['remotePeer' + res.userId].ondatachannel = function (e) {
          // 创建远程数据通道
          self.createRemoteChannel(res.userId, e)
        }
      } else {
        setTimeout(() => {
          this.createAns(res)
        }, 100)
      }
    },
    // 发送ICE
    sendIce (type, targetId, data) {
      this.$socket.emit('video_group_ice', {
        type: type,
        userId: this.user.id,
        targetId: targetId,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 发送信令
    sendOffer (targetId, data) {
      this.$socket.emit('video_group_offer', {
        userId: this.user.id,
        targetId: targetId,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 发送应答
    sendAnswer (targetId, data) {
      this.$socket.emit('video_group_answer', {
        userId: this.user.id,
        targetId: targetId,
        videoGroupId: this.videoGroupId // 房间号
      }, data)
    },
    // 创建本地数据通道
    createLocalChannel (userId, Peer) {
      let channel = Peer.createDataChannel('board')
      channel.onopen = (e) => {
        console.log('local', e)
        this.localChannelMap['channel' + userId] = channel
      }
    },
    // 创建远程数据通道
    createRemoteChannel (userId, obj) {
      this.remoteChannelMap['channel' + userId] = obj.channel
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
          for (let key in this.localPeerMap) {
            this.localPeerMap[key].close()
          }
          for (let key1 in this.remotePeerMap) {
            this.remotePeerMap[key1].close()
          }
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
