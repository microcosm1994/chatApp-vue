<template>
  <div class="index">
    <div class="index-header">
      <div class="index-header-user">
        <span>{{greetingValue}}</span>
        {{'aaaa'}}
      </div>
      <div class="index-header-time">
        <span>{{time}}</span>
      </div>
      <div class="index-header-weather">
        <span>...........</span>
      </div>
    </div>
    <div class="index-container">
      <div class="index-container-leftBox">
        <div class="index-container-noteList">
          <div class="noteList-header">
            <div class="noteList-header-title">
              公告
            </div>
          </div>
          <div class="noteList-content">
            <ul>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="index-container-noteList">
          <div class="noteList-header">
            <div class="noteList-header-title">
              便签
            </div>
            <div class="noteList-header-tool">
              <span class="el-icon-plus icon"></span>
            </div>
          </div>
          <div class="noteList-content">
            <ul>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
                <span class="el-icon-close item-del"></span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
                <span class="el-icon-close item-del"></span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水</span>
                <span class="el-icon-close item-del"></span>
              </li>
              <li class="noteList-content-item">
                <span class="item-content">多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水多喝热水</span>
                <span class="el-icon-close item-del"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="index-container-calendar">
        <el-calendar v-model="date">
        </el-calendar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      date: new Date(),
      time: '00:00:00',
      greetingValue: '',
      timer: null
    }
  },
  mounted () {
    this.greetings()
    this.timer = setInterval(() => {
      this.formatTime()
    }, 1000)
  },
  methods: {
    formatTime () {
      let date = new Date()
      let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      this.time = h + ':' + m + ':' + s
    },
    greetings () {
      let h = new Date().getHours()
      if (h > 0 && h < 6) {
        this.greetingValue = '凌晨好'
      }
      if (h > 5 && h < 10) {
        this.greetingValue = '早上好'
      }
      if (h > 9 && h < 13) {
        this.greetingValue = '上午好'
      }
      if (h > 12 && h < 20) {
        this.greetingValue = '下午好'
      }
      if (h > 19 && h < 24) {
        this.greetingValue = '晚上好'
      }
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/index.css";
</style>
