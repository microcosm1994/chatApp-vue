<template>
  <div class="contacts">
    <div class="contacts-header">
      <div class="contacts-header-title">
        联系人
      </div>
      <div class="contacts-header-close">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="contacts-container">
      <div class="contacts-container-box">
        <div class="box-header" @click="handleLabelClick('friends')">
          好友列表
        </div>
        <div class="box-list" v-show="friendsListShow">
          <ul v-if="friendsList.length">
            <li class="box-list-item" v-for="(item, index) in friendsList" :key="index">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                <el-popover
                  placement="top"
                  width="210"
                  trigger="click"
                  v-model="visible">
                  <div class="item-name-input" style="display: inline-block;vertical-align: middle; width: 140px;">
                    <el-input
                      placeholder="修改备注名"
                      v-model="popoverValue"
                      size="mini"
                      :maxlength="10"
                      clearable>
                    </el-input>
                  </div>
                  <div class="item-name-btn" style="display: inline-block;vertical-align: middle;width: 30px;">
                    <el-button icon="el-icon-check" size="mini" type="success" @click="putFriendsList(item)" ></el-button>
                  </div>
                  <p style="line-height: 24px;font-size: 14px;color:#333;cursor: pointer;" slot="reference">{{item.sourceUid === user.id ? item.targetMark : item.sourceMark}}</p>
                </el-popover>
                <p>{{item.sourceUid === user.id ? item.targetName : item.sourceName}}</p>
              </div>
              <div class="item-btn">
                <span class="el-icon-chat-dot-round" @click="openWindow(item)"></span>
              </div>
            </li>
          </ul>
          <div class="box-list-null" v-else>您还没有好友</div>
        </div>
      </div>
      <div class="contacts-container-box">
        <div class="box-header" @click="handleLabelClick('grounp')">
          我的群组
        </div>
        <div class="box-list" v-show="grounpListShow">
          <ul>
            <li class="box-list-item">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                ssssssssssssssssssssssss
              </div>
              <div class="item-btn">
                <span class="el-icon-chat-dot-round"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="contacts-search">
        <div class="contacts-search-top">
          <div class="contacts-search-input">
            <el-input
              size="mini"
              placeholder="手机号搜索好友"
              v-model="searchVal"
              clearable>
            </el-input>
          </div>
          <div class="contacts-search-btn">
            <el-button size="mini" icon="el-icon-search" @click="searchUser"></el-button>
          </div>
        </div>
        <div class="contacts-search-container" v-if="searchContainerShow">
          <ul v-if="searchList.length">
            <li class="box-list-item" v-for="(item, index) in searchList" :key="index">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                {{item.nickName}}
              </div>
              <div class="item-btn" v-if="item.phone !== user.phone">
                <span class="el-icon-plus" @click="addFriendsAsk(item)"></span>
              </div>
            </li>
          </ul>
          <div class="contacts-search-null" v-else>没有这个用户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contacts',
  props: ['closeCallback', 'openChatWindow'],
  data () {
    return {
      visible: false,
      popoverValue: '',
      searchVal: '',
      searchContainerShow: false,
      searchList: [],
      friendsList: [],
      friendsListShow: false,
      grounpListShow: false
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    socket: function () {
      console.log(this.$socket)
      return this.$socket
    }
  },
  mounted () {
    this.getFriendsList()
  },
  methods: {
    // 搜索用户
    searchUser () {
      this.searchList = []
      if (!this.searchVal || !this.$utils.regexp.isPhone(this.searchVal)) {
        this.searchContainerShow = false
        return false
      }
      let data = {
        phone: this.searchVal
      }
      this.$api.user.searchUser(data).then(res => {
        if (res.status) {
          this.searchContainerShow = true
          this.searchList = res.data
          this.$message.success(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 发送好友请求
    addFriendsAsk (row) {
      let data = {
        sourceMark: '',
        sourceName: this.user.nickName,
        sourceUid: this.user.id,
        targetMark: '',
        targetName: row.nickName,
        targetUid: row.id
      }
      this.$api.friends.addFriendsAsk(data).then((res) => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取好友列表
    getFriendsList () {
      let data = {
        id: this.user.id
      }
      this.friendsList = []
      this.$api.friends.getFriendsList(data).then((res) => {
        if (res.status) {
          this.friendsList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改好友信息
    putFriendsList (row) {
      if (!this.popoverValue) {
        return false
      }
      let data = {
        id: row.id
      }
      if (this.user.id === row.sourceUid) {
        data.targetMark = this.popoverValue
        data.sourceMark = row.sourceMark
      } else {
        data.sourceMark = this.popoverValue
        data.targetMark = row.targetMark
      }
      this.$api.friends.putFriends(data).then((res) => {
        if (res.status) {
          this.popoverValue = ''
          this.visible = false
          this.getFriendsList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示隐藏列表
    handleLabelClick (labelName) {
      switch (labelName) {
        case 'friends':
          this.friendsListShow = !this.friendsListShow
          break
        case 'grounp':
          this.grounpListShow = !this.grounpListShow
          break
        default:
          break
      }
    },
    // 关闭侧边栏
    close () {
      this.closeCallback()
    },
    // 打开聊天窗口
    openWindow (row) {
      this.openChatWindow()
      this.$store.commit('setTarget', row)
      // 房间名
      let roomName = this.user.id + ':' + (row.sourceUid === this.user.id ? row.targetUid : row.sourceUid)
      this.$socket.emit('JoinRoom', roomName)
    }
  }
}
</script>

<style scoped>
@import "../../assets/css/aside/contacts.css";
</style>
