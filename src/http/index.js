import api from './api'

const install = Vue => {
  if (install.installed) return false
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    // 此处挂载在vue的原型的$api上
    $api: {
      get () {
        return api
      }
    }
  })
}

export default install
