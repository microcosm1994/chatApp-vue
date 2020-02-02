<template>
  <div class="chatWindow" ref="chatWindow">
    <div class="chatWindow-header" @mousedown="dropChatWindow" @mouseup="stop" @mouseleave="stop">
      {{target.sourceName === user.nickName ? target.targetMark : target.sourceMark}}
      <div class="chatWindow-header-tool">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="chatWindow-container">
      <div class="chatWindow-container-chat"></div>
      <div class="chatWindow-container-tool"></div>
      <div class="chatWindow-container-reply">
        <div class="reply-input" contenteditable="true"></div>
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
      flag: true
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
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/chatWindow/chatWindow.css";
</style>
