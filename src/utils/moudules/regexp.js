export default {
  // 检测手机号码
  isPhone (s) {
    return /^1[0-9]{10}$/.test(s)
  }
}
