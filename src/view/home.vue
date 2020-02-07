<template>
  <div class="home">
    <div class="header">
      <div class="header-logo">
        <span>chatApp</span>
      </div>
      <div class="header-menu">
        <ul>
          <li class="header-menu-item">
            首页
          </li>
          <li class="header-menu-item">
            视频会议
          </li>
        </ul>
      </div>
      <div class="header-set">
        <div class="header-set-avatar">
          <el-avatar shape="square" :size="30" src=""></el-avatar>
        </div>
        <div class="header-set-dropdown">
          <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.nickName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">个人信息</el-dropdown-item>
              <el-dropdown-item :command="2" @click="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-container>
      <el-aside width="70px">
        <div class="aside">
          <ul>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 1}" @click="handleMenu">
              <span :index="1" class="el-icon-chat-dot-square"></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 2}" @click="handleMenu">
              <span :index="2" class="el-icon-user"></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 3}" @click="handleMenu">
              <span :index="3" class="el-icon-copy-document "></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 4}" @click="handleMenu">
              <span :index="4" class="el-icon-bell "></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 5}" @click="handleMenu">
              <span :index="5" class="el-icon-collection-tag "></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 6}" @click="handleMenu">
              <span :index="6" class="el-icon-folder"></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 7}" @click="handleMenu">
              <span :index="7" class="el-icon-menu"></span>
            </li>
          </ul>
          <div class="aside-bottom">
            <span class="el-icon-setting"></span>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div :class="{'home-main': true, ' home-main-show': menuActive}">
          <div class="home-main-asid" v-if="menuActive">
            <keep-alive>
              <component v-bind:is="asideComments"
                         :closeCallback="closeAside"
                         :openChatWindow="openChatWindow"
                         :openGroupChatWindow="openGroupChatWindow"></component>
            </keep-alive>
          </div>
          <div class="home-main-view">
            <router-view/>
          </div>
        </div>
      </el-main>
    </el-container>
    <keep-alive>
      <chatWindow v-if="chatWindowShow" :closeCallback="closeChatWindow" ref="chat"></chatWindow>
      <groupChatWindow v-if="groupChatWindow" :closeCallback="closeGroupChatWindow" :closeAside="closeAside"></groupChatWindow>
    </keep-alive>
  </div>
</template>

<script>
import contactts from '../components/aside/contacts'
import history from '../components/aside/history'
import message from '../components/aside/message'
import group from '../components/aside/group'
import chatWindow from '../components/chatWindow/chatWindow'
import groupChatWindow from '../components/chatWindow/groupChatWindow'
export default {
  name: 'home',
  data () {
    return {
      chatWindowShow: false,
      groupChatWindow: false,
      isShow: true,
      menuActive: 0,
      phone: '',
      code: '',
      isLoading: false,
      asideComments: '',
      timer: null
    }
  },
  components: {
    contactts,
    history,
    message,
    group,
    chatWindow,
    groupChatWindow
  },
  sockets: {
    // 监听视频请求
    VideoReq: function (data) {
      let name = decodeURI(data.name)
      this.chatWindowShow = true
      this.$store.commit('setFriendsId', data.friendsId)
      this.timer = setTimeout(() => {
        this.$refs.chat.reqName = name
        this.$refs.chat.videoLoading = false
        this.$refs.chat.videoShow = false
        this.$refs.chat.videoBoxShow = true
        this.$refs.chat.videoReq = true
      }, 300)
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {},
  methods: {
    handleCommand (command) {
      switch (command) {
        case 1:
          break
        case 2:
          this.loginOut()
          break
        default:
          break
      }
    },
    loginOut () {
      this.$utils.cookie.remove('t')
      this.$router.push({
        path: '/'
      })
    },
    handleMenu (e) {
      this.menuActive = e.target.attributes.index.value - 0
      switch (this.menuActive) {
        case 1:
          this.asideComments = 'history'
          break
        case 2:
          this.asideComments = 'contactts'
          break
        case 3:
          this.asideComments = 'group'
          break
        case 4:
          this.asideComments = 'message'
          break
        default:
          break
      }
    },
    // 关闭侧边栏
    closeAside () {
      this.menuActive = 0
    },
    // 打开聊天窗口
    openChatWindow () {
      this.chatWindowShow = true
    },
    // 关闭聊天窗口
    closeChatWindow () {
      this.chatWindowShow = false
    },
    // 打开群组聊天窗口
    openGroupChatWindow () {
      this.groupChatWindow = true
    },
    // 关闭群组聊天窗口
    closeGroupChatWindow () {
      this.groupChatWindow = false
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/home.css";
</style>
