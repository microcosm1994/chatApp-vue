<template>
  <div class="login">
    <div class="login-form">
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
            <el-button class="form-btn" icon="el-icon-check" size="mini" @click="login"></el-button>
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
        console.log(res)
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
