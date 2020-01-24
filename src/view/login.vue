<template>
  <div class="login">
    <div class="login-form" v-loading="isLoading">
      <div class="login-form-left">
        <div class="login-form-title">
          <img src="../assets/image/title.png" alt="">
        </div>
        <div class="login-form-box" v-if="isShow">
          <div class="login-form-input">
            <el-input
              placeholder="输入手机号"
              v-model="phone"
              :maxlength="11"
              size="small"
              clearable>
            </el-input>
          </div>
          <div class="login-form-btn">
            <el-tooltip class="item" effect="dark" content="点击登陆" placement="top-start">
              <el-button class="form-btn" icon="el-icon-check" size="mini" @click="login"></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="login-form-box" v-if="!isShow">
          <div class="login-form-input" style="width: 220px">
            <el-input
              placeholder="输入验证码"
              v-model="code"
              :maxlength="11"
              size="small"
              clearable>
            </el-input>
          </div>
          <div class="login-form-btn">
            <el-tooltip class="item" effect="dark" content="重新发送短信验证码" placement="top-start">
              <el-button class="form-btn" icon="el-icon-refresh-right" size="mini" @click="checkCode"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击登陆" placement="top-start">
              <el-button class="form-btn" icon="el-icon-check" size="mini" @click="checkCode"></el-button>
            </el-tooltip>
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
      isShow: true,
      phone: '',
      code: '',
      isLoading: false
    }
  },
  methods: {
    login () {
      // 判断是否为空
      if (!this.phone) {
        this.$message.info('请输入手机号')
        return false
      }
      // 判断格式是否正确
      if (!this.$utils.regexp.isPhone(this.phone)) {
        this.$message.info('请输入正确的手机号')
        return false
      }
      let data = {
        phone: this.phone
      }
      this.$api.login.login(data).then(res => {
        if (res.status) {
          this.isShow = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkCode () {
      if (!this.code) {
        this.$message.info('请输入正确验证码')
        return false
      }
      let data = {
        code: this.code
      }
      this.$api.login.checkCode(data).then(res => {
        if (res.status) {
          this.$utils.cookie.set('t', res.t, {
            expires: 1
          })
          this.$router.push({
            path: '/index'
          })
          this.$message.success('登陆成功')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/login.css";
</style>
