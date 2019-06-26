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
const router = new Router({
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
        { path: '/users', name: 'users', component: Users },
        { path: '/', name: 'index', component: Index },
        // 角色列表
        { path: '/roles', name: 'roles', component: Roles },
        // 权限列表
        { path: '/rights', name: 'rights', component: Rights }
      ]
    }
  ]
})
// 当路由发生变化时执行的代码     
router.beforeEach(function (to, from, next) {
  // 判断请求的是不是login
  if (to.name !== 'login') {

    //获取
    let token = window.localStorage.getItem("token");

    if (!token) {
      // 弹出警告信息
      router.push('/login')
      console.log('不行？');
    } else {
      next()
    }
  } else {

    next()
  }



})

export default router
