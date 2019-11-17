
import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import JSONbig from 'json-bigint'
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
// 在响应拦截中判断token是否过期  让用户重新登录
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(error)
})
axios.defaults.transformResponse = [function (data) {
  // 服务器端返回给客户端的data数据主要就两种类型
  // 1) 字符串对象  '{xx:xx...}'
  // 2) 空字符串   ''
  // 在此处要利用JSONbig对返回的信息加以处理，如果不处理，系统默认是通过JSON.parse()给处理的
  // 这样大数字就错误了
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}]
