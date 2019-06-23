import Vue from 'vue'
import Router from 'vue-router'
// 导入登陆路由
import Login from '@/components/login/login.vue'
// 导入主页接口
import Home from '@/components/home/home.vue'
// 导入uesers
import Users from '@/components/users/users.vue'
// 导入默认路由
import Index from '@/components/index/index.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/:id', name: 'index', component: Index }
      ]
    }
  ]
})
