<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-left">
        <div class="login-form-title">
          <img src="../assets/image/title.png" alt="">
        </div>
        <div class="login-form-box" v-if="isShow">
          <div class="login-form-input">
            <div class="form-input-code">
              <el-input
                placeholder="输入手机号"
                v-model="phone"
                size="small"
                clearable>
              </el-input>
            </div>
          </div>
          <div class="login-form-btn">
            <el-button class="form-btn" size="mini" @click="getMessageCode">获取短信验证码</el-button>
          </div>
        </div>
        <div class="login-form-box" v-if="!isShow">
          <div class="login-form-input">
            <div class="form-input-phone">
              <el-input
                placeholder="输入短信验证码"
                v-model="code"
                size="small"
                clearable>
              </el-input>
            </div>
          </div>
          <div class="login-form-btn">
            <el-button class="form-btn" size="mini" @click="checkingCode">进入网站</el-button>
          </div>
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
      phone: '',
      code: '',
      isShow: true
    }
  },
  methods: {
    getMessageCode () {
      if (!this.phone) {
        this.$message.info('请输入手机号')
        return false
      }
      let data = {
        phone: this.phone
      }
      this.$api.login.getMessageCode(data).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    checkingCode () {
      if (!this.phone) {
        this.$message.info('请输入手机号')
        return false
      }
      let data = {
        phone: this.phone
      }
      this.$api.login.checkingCode(data).then(res => {
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
