<template>
  <div class="chatWindow" ref="chatWindow">
    <div class="chatWindow-header" @mousedown="dropChatWindow" @mouseup="stop" @mouseleave="stop">
      {{target.sourceName === user.nickName ? target.targetMark : target.sourceMark}}
      <div class="chatWindow-header-tool">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="chatWindow-container">
      <div class="chatWindow-container-chat">
        <ul>
          <li class="chat-msg">
            <div class="chat-msg-left">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content">
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
              </div>
            </div>
          </li>
          <li class="chat-msg">
            <div class="chat-msg-left">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content">
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
              </div>
            </div>
          </li>
          <li class="chat-msg">
            <div class="chat-msg-right">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content">
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
              </div>
            </div>
          </li>
          <li class="chat-msg">
            <div class="chat-msg-right">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content">
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
              </div>
            </div>
          </li>
          <li class="chat-msg">
            <div class="chat-msg-left">
              <div class="chat-msg-avator">
                <el-avatar shape="square" :size="30"></el-avatar>
              </div>
              <div class="chat-msg-content">
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
                图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为
              </div>
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
  </div>
</template>

<script>
export default {
  name: 'contacts',
  props: ['closeCallback'],
  data () {
    return {
      flag: true,
      range: null
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    target: function () {
      return this.$store.state.target
    }
  },
  mounted () {
  },
  methods: {
    // 发送消息
    sendMessage () {
      let msg = this.$refs['reply-input'].innerHTML
      if (!msg) {
        return false
      }
      this.$refs['reply-input'].innerHTML = ''
      console.log(msg)
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
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/chatWindow/chatWindow.css";
</style>
