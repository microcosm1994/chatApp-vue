import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import http from './http'
import utils from './utils'
import store from './store'
import filters from './filer'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/publick.css'

Vue.use(element)
Vue.use(http)
Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$store = store
Vue.prototype.$socket = null

// 注册全局过滤器
Object.keys(filters).forEach((fnc) => {
  Vue.filter(fnc, filters[fnc])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
