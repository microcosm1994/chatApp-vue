import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login'
import home from '@/view/home'
import index from '@/view/index'
import videoGroupList from '@/view/video_groupList'
import videoGroup from '@/view/video_group'

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
        },
        {
          path: '/index/video_groupList',
          name: 'video_groupList',
          component: videoGroupList
        },
        {
          path: '/index/video_group',
          name: 'video_group',
          component: videoGroup
        }
      ]
    }
  ]
})
