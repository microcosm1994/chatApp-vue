<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-left">
        <div class="login-form-title">
          <img src="../assets/image/title.png" alt="">
        </div>
        <div class="login-form-input">
          <el-input
            placeholder="请输入昵称"
            v-model="nickname"
            size="small"
            clearable>
          </el-input>
        </div>
        <div class="login-form-btn">
          <el-button class="form-btn" size="mini">进入网站</el-button>
        </div>
      </div>
      <div class="login-form-img">
        <img src="../assets/image/bg.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      nickname: ''
    }
  },
  methods: {
    login () {
      let data = {
        username: 'zs',
        password: '123456'
      }
      this.$api.login.login(data).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../assets/css/login.css";
</style>
