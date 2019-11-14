import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import http from './http'
import utils from './utils'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/publick.css'

Vue.use(element)
Vue.use(http)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
