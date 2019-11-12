
import Vue from 'vue'
import axios from 'axios'
// 设置公共跟地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

// 配置token 如果有token在请求头中设置token信息
axios.interceptors.request.use(function (config) {
  // userinfo并不是始终存在的，要做判断使用
  let token1 = window.localStorage.getItem('token')
  if (token1) {
    // 给axios请求头配置token
    config.headers.Authorization = 'Bearer ' + JSON.parse(token1).token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
