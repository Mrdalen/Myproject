// 创建axios插件
import axios from "axios";
//创建插件对象
const Myaxios = {}

// 添加插件方法
Myaxios.install = function (vue) {
    vue.prototype.$http = axios
}

// 设置默认的请求地址，将来只要是axios发送的请求都回在前面加上这段路就
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
// 设置统一的请求头
// axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')

// 拦截器   必须返回config才会执行后续代码（每次请求的时候都会执行一次）
axios.interceptors.request.use(function (config) {
    // 包含login
    if (!config.url.includes('login')) {
        // 如果是login就不执行
        config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config
})
// 暴露
export default Myaxios