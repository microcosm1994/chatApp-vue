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
        杜波<i class="el-icon-arrow-down el-icon--right"></i>
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
            <li class="aside-item">
              <span class="el-icon-chat-dot-square"></span>
            </li>
            <li class="aside-item">
              <span class="el-icon-user"></span>
            </li>
            <li class="aside-item">
              <span class="el-icon-collection-tag "></span>
            </li>
            <li class="aside-item">
              <span class="el-icon-folder"></span>
            </li>
            <li class="aside-item">
              <span class="el-icon-menu"></span>
            </li>
          </ul>
          <div class="aside-bottom">
            <span class="el-icon-setting"></span>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="home-main">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      isShow: true,
      phone: '',
      code: '',
      isLoading: false
    }
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
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/home.css";
</style>
