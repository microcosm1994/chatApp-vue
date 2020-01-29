export default {
  // 时间
  timeFormat: function (time) {
    if (!time) {
      return ''
    }
    let date = new Date(time)
    let Y = date.getFullYear()
    let M = date.getMonth() + 1
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
  },
  // 好友请求状态
  isAgree (val) {
    let result = ''
    switch (val) {
      case 0:
        result = '未同意'
        break
      case 1:
        result = '已同意'
        break
      case 2:
        result = '拒绝'
        break
      default:
        break
    }
    return result
  }
}
