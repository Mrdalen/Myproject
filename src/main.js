// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 导入vue 与app
import Vue from 'vue'
import App from './App'
// 导入路由
import router from './router'
// 导入饿了吗UI
import ElementUi from 'element-ui'
// 引入样式饿了吗
import 'element-ui/lib/theme-chalk/index.css'
// 引入axiso
import axios from 'axios'

// 把axios挂载到vue实例对象的属性里
Vue.use(ElementUi)

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
