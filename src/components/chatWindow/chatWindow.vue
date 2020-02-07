<template>
  <div class="chatWindow" ref="chatWindow">
    <div class="chatWindow-header" @mousedown="dropChatWindow" @mouseup="stop" @mouseleave="stop">
      {{target.sourceName === user.nickName ? target.targetMark : target.sourceMark}}
      <span class="el-icon-video-camera" @click="openVideo"></span>
      <div class="chatWindow-header-tool">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="chatWindow-container">
      <div class="chatWindow-container-chat" ref="chatWindow-container-chat">
        <ul>
          <li class="chat-msg" v-for="(item, index) in msgData" :key="index" v-if="msgData.length">
            <div :class="[user.id === item.sourceUid ? 'chat-msg-right': 'chat-msg-left']">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content" v-html="decodeMsg(item.content)"></div>
            </div>
          </li>
        </ul>
        <div class="chatWindow-container-reply">
          <div class="reply-input" ref="reply-input" contenteditable="true" @blur="getPosition"></div>
          <div class="reply-annex-btn">
            <span class="el-icon-paperclip"></span>
          </div>
          <div class="reply-emoji-btn">
            <span>🙂</span>
          </div>
          <div class="reply-send-btn" contenteditable="false">
            <span class="el-icon-s-promotion" size="mini" type="primary" @click="sendMessage"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="chatWindow-video" v-if="videoBoxShow">
      <keep-alive>
        <Video v-if="videoShow" :closeVideo="closeVideo"></Video>
      </keep-alive>
      <div class="chatWindow-video-req" v-if="videoReq">
        <div class="req-avator">
          <el-avatar :size="80"></el-avatar>
        </div>
        <div class="req-name">
          {{reqName}}
        </div>
        <p class="req-des">请求与您视频通话</p>
        <div class="req-btn">
          <el-button size="mini" type="success" @click="okVideoReq">接听</el-button>
          <el-button size="mini" type="danger" @click="closeVideo">结束</el-button>
        </div>
      </div>
      <div class="chatWindow-video-loading"
           v-if="videoLoading"
           v-loading="videoLoading"
           element-loading-text="请等待对方回应"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)"
      ></div>
    </div>
  </div>
</template>

<script>
import Video from './video'
export default {
  name: 'contacts',
  props: ['closeCallback'],
  data () {
    return {
      flag: true,
      range: null,
      msgData: [],
      videoLoading: false,
      videoBoxShow: false,
      videoReq: false,
      videoShow: false,
      reqName: ''
    }
  },
  components: {
    Video
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
    RoomMsg: function (data) {
      this.msgData.push(data)
      this.setScroll()
    },
    video_req_result: function (data) {
      if (data.data) {
        this.videoBoxShow = true
        this.videoLoading = false
        this.videoReq = false
        this.videoShow = true
      } else {
        this.videoReq = false
        this.videoLoading = false
        this.videoBoxShow = false
      }
    }
  },
  activated () {
    this.getMsgList()
  },
  methods: {
    // 消息内容解码
    decodeMsg (val) {
      return decodeURI(val)
    },
    // 获取消息列表
    getMsgList () {
      let data = {
        friendsId: this.friendsId
      }
      this.msgData = []
      this.$api.msg.getMsgList(data).then((res) => {
        if (res.status) {
          this.msgData = res.data
          this.setScroll()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 发送消息
    sendMessage () {
      let msg = this.$refs['reply-input'].innerHTML
      if (!msg) {
        return false
      }
      this.$refs['reply-input'].innerHTML = ''
      let data = {
        friendsId: this.friendsId,
        targetUid: this.target.id,
        sourceUid: this.user.id,
        content: encodeURI(msg)
      }
      this.$socket.emit('SendMessage', data)
      this.setScroll()
    },
    // 聊天窗口拖拽
    dropChatWindow (e) {
      e.stopPropagation()
      this.flag = true
      let self = this
      let clientX = e.clientX - this.$refs.chatWindow.offsetLeft
      let clientY = e.clientY - this.$refs.chatWindow.offsetTop
      document.onmousemove = (event) => {
        event.stopPropagation()
        if (!self.flag) return false
        let domX = event.clientX
        let domY = event.clientY
        let flowTop = domY - clientY
        let flowLeft = domX - clientX
        let windowWidth = document.documentElement.clientWidth
        let windowHeight = document.documentElement.clientHeight
        // 左侧边界
        if (flowLeft < -200) {
          flowLeft = -200
        }
        // 右侧边界
        if ((windowWidth - flowLeft) < 100) {
          flowLeft = windowWidth - 100
        }
        // 上方边界
        if (flowTop < 300) {
          flowTop = 300
        }
        // 下方边界
        if ((windowHeight - flowTop) < -195) {
          flowTop = windowHeight + 195
        }
        self.$refs.chatWindow.style.top = flowTop + 'px'
        self.$refs.chatWindow.style.left = flowLeft + 'px'
        event.target.onmouseup = (e) => {
          self.flag = false
        }
      }
      document.onmouseup = (e) => {
        self.flag = false
      }
    },
    // 阻止冒泡
    stop (e) {
      e.stopPropagation()
      this.flag = false
      return false
    },
    // 关闭聊天窗口
    close () {
      this.closeCallback()
    },
    // 获取光标位置
    getPosition () {
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      this.range = range
    },
    // 让滚动条一直保持在底部
    setScroll () {
      let scrollHeight = this.$refs['chatWindow-container-chat'].scrollHeight
      // 聊天界面滚动条一直保持在底部
      this.$refs['chatWindow-container-chat'].scrollTop = scrollHeight + 50
    },
    // 打开视频
    openVideo () {
      let mark = this.user.id === this.target.sourceUid ? this.target.sourceMark : this.target.targetMark
      let name = this.user.id === this.target.sourceUid ? this.target.sourceName : this.target.targetName
      let targetId = this.user.id === this.target.sourceUid ? this.target.targetUid : this.target.sourceUid
      // 加入视频房间
      this.videoRoom()
      // 发送视频请求
      this.$socket.emit('video_send_req', {
        name: encodeURI(mark || name),
        friendsId: this.friendsId,
        targetId: targetId
      })
      this.videoReq = false
      this.videoShow = false
      this.videoBoxShow = true
      this.videoLoading = true
    },
    // 加入房间
    videoRoom () {
      // 加入视频房间
      this.$socket.emit('video_room', {
        friendsId: this.friendsId // 房间号
      })
    },
    // 关闭视频
    closeVideo () {
      this.$socket.emit('video_req', {
        data: 0,
        friendsId: this.friendsId
      })
      this.videoBoxShow = false
      this.videoReq = false
      this.videoShow = false
    },
    // 接听视频
    okVideoReq () {
      // 加入视频房间
      this.videoRoom()
      // 加入聊天房间
      this.$socket.emit('JoinRoom', {
        friendsId: this.friendsId
      })
      // 发送同意请求
      this.$socket.emit('video_req', {
        data: 1,
        friendsId: this.friendsId
      })
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/chatWindow/chatWindow.css";
</style>
