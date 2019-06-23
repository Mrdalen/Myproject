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
// 导入Roles
import Roles from '../components/rolelist/roleList.vue'
// 导入Rights
import Rights from '../components/rightsList/rightslist.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: '/home'
    },
    // 登陆路由
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // 主页路由
    {
      path: '/home',
      name: 'home',
      component: Home,
      // 子路由
      children: [
        // 用户列表
        { path: '/users', component: Users },
        { path: '/', name: 'index', component: Index },
        // 角色列表
        { path: '/roles', component: Roles },
        // 权限列表
        { path: '/rights', component: Rights }
      ]
    }
  ]
})
