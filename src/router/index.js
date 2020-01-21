import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login'
import home from '@/view/home'
import index from '@/view/index'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'home',
      component: home,
      children: [
        {
          path: '/',
          name: 'index',
          component: index
        }
      ]
    }
  ]
})
