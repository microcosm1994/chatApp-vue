<template>
  <div class="chatWindow" ref="chatWindow">
    <div class="chatWindow-header" @mousedown="dropChatWindow" @mouseup="stop" @mouseleave="stop">
      {{target.sourceName === user.nickName ? target.targetMark : target.sourceMark}}
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
              <div class="chat-msg-content" v-html="item.content"></div>
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
      range: null,
      msgData: []
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
  sockets: {
    RoomMsg: function (data) {
      data.content = decodeURI(data.content)
      this.msgData.push(data)
      console.log(this.msgData)
    }
  },
  mounted () {
    this.setScroll()
  },
  methods: {
    // 发送消息
    sendMessage () {
      let msg = this.$refs['reply-input'].innerHTML
      if (!msg) {
        return false
      }
      this.$refs['reply-input'].innerHTML = ''
      let data = {
        targetUid: this.target.id,
        sourceUid: this.user.id,
        content: encodeURI(msg)
      }
      console.log(data)
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
      let scrollHeight = this.$refs['chatWindow'].scrollHeight
      // 聊天界面滚动条一直保持在底部
      this.$refs['chatWindow-container-chat'].scrollTop = scrollHeight
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/chatWindow/chatWindow.css";
</style>
