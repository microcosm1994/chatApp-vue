<template>
  <div class="chatWindow" ref="chatWindow">
    <div class="chatWindow-header" @mousedown="dropChatWindow" @mouseup="stop" @mouseleave="stop">
      {{group.groupName}}
      <div class="chatWindow-header-tool">
        <el-popover
          placement="bottom-start"
          width="200"
          trigger="click">
          <div class="tool-Box">
            <div class="tool-box-header">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                size="mini"
                v-model="searchMemberVal">
              </el-input>
            </div>
            <div class="tool-box-container">
              <div class="container-members">
                <ul>
                  <li class="container-members-item" v-for="(item, index) in groupUserList" :key="index">
                    <el-badge
                      value="主"
                      class="item"
                      :hidden="item.user.id !== group.groupMpId"
                      type="primary">
                      <el-avatar shape="square" :size="30"></el-avatar>
                    </el-badge>
                    <el-tooltip class="item" effect="dark" :content="item.user.nickName" placement="top">
                      <p>{{item.user.nickName}}</p>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
              <div class="container-des">
                <ul>
                  <li class="container-des-item">
                    <p class="item-label">群名称</p>
                    <p class="item-content">{{group.groupName}}</p>
                  </li>
                  <li class="container-des-item">
                    <p class="item-label">群说明</p>
                    <p class="item-content">{{group.groupDes}}</p>
                  </li>
                </ul>
              </div>
              <div class="container-tool">
                <ul>
                  <li class="container-tool-item">
                    <el-button v-if="group.groupMpId === user.id" size="mini" type="danger">解散群聊</el-button>
                    <el-button v-else size="mini" type="danger" @click="delGroupUser">退出群聊</el-button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="tool-box-searchBox">
            </div>
          </div>
          <span slot="reference" class="el-icon-s-tools" @click="getGroupUserList"></span>
        </el-popover>
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="chatWindow-container">
      <div class="chatWindow-container-chat" ref="chatWindow-container-chat">
        <ul>
          <li class="chat-msg" v-for="(item, index) in msgData" :key="index" v-if="msgData.length">
            <div :class="[user.id === item.userId ? 'chat-msg-right': 'chat-msg-left']">
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
  </div>
</template>

<script>
export default {
  name: 'contacts',
  props: ['closeCallback', 'closeAside'],
  data () {
    return {
      flag: true,
      range: null,
      msgData: [],
      groupUserList: [],
      searchMemberVal: ''
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    group: function () {
      return this.$store.state.group
    },
    groupMemberId: function () {
      return this.$store.state.groupMemberId
    }
  },
  sockets: {
    GroupRoomMsg: function (data) {
      this.msgData.push(data)
    }
  },
  activated () {
    this.getGroupMsgList()
    this.setScroll()
  },
  methods: {
    // 消息内容解码
    decodeMsg (val) {
      return decodeURI(val)
    },
    // 获取群消息列表
    getGroupMsgList () {
      let data = {
        groupId: this.group.id
      }
      this.msgData = []
      this.$api.groupMsg.getGroupMsgList(data).then((res) => {
        if (res.status) {
          this.msgData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取群成员列表
    getGroupUserList () {
      let data = {
        Id: this.group.id
      }
      this.groupUserList = []
      this.$api.group.getGroupUserList(data).then((res) => {
        if (res.status) {
          this.groupUserList = res.groupList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 退出群组
    delGroupUser () {
      let data = {
        id: this.groupMemberId,
        user: {
          id: this.user.id
        },
        group: {
          id: this.group.id
        }
      }
      this.$api.group.delGroupUser(data).then((res) => {
        if (res.status) {
          this.closeCallback()
          this.closeAside()
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
        groupId: this.group.id,
        userId: this.user.id,
        content: encodeURI(msg)
      }
      this.$socket.emit('SendGroupMessage', data)
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
