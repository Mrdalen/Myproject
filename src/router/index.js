import Vue from 'vue'
import Router from 'vue-router'
// 导入登陆路由
import Login from '@/components/login/login.vue'
// 导入主页接口
import Home from '@/components/home/home.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    }
  ]
})
