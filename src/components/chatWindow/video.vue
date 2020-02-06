<template>
  <div class="video" ref="video">
    <div class="video-remote">
      <video object-fit="fill" autoPlay ref='remoteVideo'></video>
    </div>
    <div class="video-local">
      <video object-fit="fill" autoPlay ref='localVideo'></video>
    </div>
    <div class="video-tool">
      <div class="video-tool-btn">
        <el-button size="small" type="danger" @click="close">结束</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contacts',
  props: ['closeVideo'],
  data () {
    return {
      flag: true,
      range: null,
      msgData: [],
      remotePeer: null,
      remoteStream: null,
      localPeer: null,
      localStream: null,
      listenOn: false
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    target: function () {
      return this.$store.state.target
    },
    friendsId: function () {
      return this.$store.state.friendsId
    }
  },
  sockets: {
    VideoIce: function (data) {
      if (this.listenOn) {
        if (data.type === 'local') {
          this.remotePeer.addIceCandidate(data.data)
        }
        if (data.type === 'remote') {
          this.localPeer.addIceCandidate(data.data)
        }
      }
    },
    VideoOffer: function (data) {
      if (this.listenOn) {
        this.createAns(data)
      }
    },
    VideoAnswer: function (data) {
      if (this.listenOn) {
        this.localPeer.setRemoteDescription(data.data)
      }
    }
  },
  activated () {
    this.getUserMedia()
  },
  methods: {
    // 关闭聊天窗口
    close () {
      this.closeVideo()
    },
    // 获取流媒体
    getUserMedia () {
      let self = this
      let localVideo = this.$refs.localVideo
      let constraints = {
        audio: false,
        video: true
      }
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (!navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

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
        localVideo.srcObject = stream
        // 保存视频流
        self.localStream = stream
        this.listenOn = true
        self.createPeerConnection(stream)
      }).catch((err) => {
        if (err) {
          this.listenOn = false
          self.$message.error('无法获取摄像头')
        }
      })
    },
    // 创建视频连接实例
    createPeerConnection (stream) {
      if (stream) {
        let PeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection
        this.localPeer = new PeerConnection()
        this.remotePeer = new PeerConnection()
        this.localPeer.oniceconnectionstatechange = () => {
          console.log(this.localPeer.iceConnectionState)
        }
        this.remotePeer.oniceconnectionstatechange = () => {
          console.log(this.remotePeer.iceConnectionState)
        }
        stream.getTracks().forEach(item => {
          this.localPeer.addTrack(item, stream)
        })
        // 创建offer
        this.localPeer.createOffer().then(offer => {
          this.localPeer.setLocalDescription(offer).then(() => {
            this.sendOffer('local', offer)
          })
        })
        // 创建信令
        this.localPeer.onicecandidate = (e) => {
          if (e.candidate) {
            this.sendIce('local', e.candidate)
          }
        }
        // 监听从对方过来的媒体流
        this.remotePeer.onaddstream = (e) => {
          if (e.stream) {
            let tVideo = this.$refs.remoteVideo
            tVideo.srcObject = e.stream
          }
        }
      } else {
        setTimeout(() => {
          this.createPeerConnection()
        }, 100)
      }
    },
    // 创建offer
    createAns (res) {
      if (this.remotePeer) {
        this.remotePeer.setRemoteDescription(res.data).then(() => {
          if (res.type === 'local') {
            this.remotePeer.onicecandidate = (e) => {
              if (e.candidate) {
                this.sendIce('remote', e.candidate)
              }
            }
          }
          this.remotePeer.createAnswer().then(answer => {
            this.remotePeer.setLocalDescription(answer)
            this.sendAnswer(answer)
          })
        })
        this.remotePeer.ondatachannel = function (e) {
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
      this.$socket.emit('video_ice', {
        type: type,
        friendsId: this.friendsId // 房间号
      }, data)
    },
    // 发送信令
    sendOffer (type, data) {
      this.$socket.emit('video_offer', {
        type: type,
        friendsId: this.friendsId // 房间号
      }, data)
    },
    // 发送应答
    sendAnswer (data) {
      this.$socket.emit('video_answer', {
        friendsId: this.friendsId // 房间号
      }, data)
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/chatWindow/video.css";
</style>