import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import http from './http'
import utils from './utils'
import store from './store'
import filters from './filer'
import cookie from 'js-cookie'
import VueSocketIO from 'vue-socket.io'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/publick.css'

Vue.use(element)
Vue.use(http)
Vue.use(new VueSocketIO({
  // 服务器端地址
  connection: '/socket.io/',
  vuex: {
    store
  }
}))

Vue.config.productionTip = false
Vue.prototype.$cookie = cookie
Vue.prototype.$utils = utils
Vue.prototype.$store = store

// 注册全局过滤器
Object.keys(filters).forEach((fnc) => {
  Vue.filter(fnc, filters[fnc])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
