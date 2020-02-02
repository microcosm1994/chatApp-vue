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
              <span :index="3" class="el-icon-bell "></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 4}" @click="handleMenu">
              <span :index="4" class="el-icon-collection-tag "></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 5}" @click="handleMenu">
              <span :index="5" class="el-icon-folder"></span>
            </li>
            <li :class="{'aside-item': true, 'aside-item_active': menuActive === 6}" @click="handleMenu">
              <span :index="6" class="el-icon-menu"></span>
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
              <component v-bind:is="asideComments" :closeCallback="closeAside" :openChatWindow="openChatWindow"></component>
            </keep-alive>
          </div>
          <div class="home-main-view">
            <router-view/>
          </div>
        </div>
      </el-main>
    </el-container>
    <chatWindow v-if="chatWindowShow" :closeCallback="closeChatWindow"></chatWindow>
  </div>
</template>

<script>
import contactts from '../components/aside/contacts'
import history from '../components/aside/history'
import message from '../components/aside/message'
import chatWindow from '../components/chatWindow/chatWindow'
export default {
  name: 'home',
  data () {
    return {
      chatWindowShow: false,
      isShow: true,
      menuActive: 0,
      phone: '',
      code: '',
      isLoading: false,
      asideComments: ''
    }
  },
  components: {
    contactts,
    history,
    message,
    chatWindow
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
  },
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
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/home.css";
</style>
