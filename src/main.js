// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 导入vue 与app
import Vue from 'vue'
import App from './App'
// 导入路由
import router from './router'
// 导入饿了吗UI
import ElementUi from 'element-ui'
// 引入element 的插件
import ElTreeGrid from 'element-tree-grid'
// 引入样式饿了吗
import 'element-ui/lib/theme-chalk/index.css'
// 引入myaxiso
import Myaxios from '@/assets/js/myaxios';
// 使用插件
Vue.use(Myaxios)

// 使用
Vue.use(ElementUi)

// 将插件注册为全局组件
Vue.component(ElTreeGrid.name,ElTreeGrid)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
