<template>
  <div class="video_group">
    <div class="video_group-left">
      <div class="left-container">
        <ul>
          <li class="video-item" v-for="(item, index) in listData" :key="index">
            <div class="item-info">{{item.name}}</div>
            <div class="item-video">
              <video autoPlay ref="video"></video>
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
          <el-button size="mini" type="danger" @click="out">退出</el-button>
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
      listData: [
        {
          name: '1'
        },
        {
          name: '2'
        },
        {
          name: '3'
        }
      ]
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.getUserMedia()
  },
  sockets: {},
  methods: {
    // 获取流媒体
    getUserMedia () {
      let self = this
      let localVideos = this.$refs.video
      console.log(localVideos)
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
        for (let i = 0; i < localVideos.length; i++) {
          localVideos[i].srcObject = stream
        }
        // 保存视频流
        this.localStream = stream
        // 获取音频对象
        this.getAudio()
      }).catch((err) => {
        if (err) {
          self.$message.error('无法获取摄像头')
        }
      })
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
    out () {
      this.$router.push({
        path: '/index/video_groupList'
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/video_group.css";
</style>
