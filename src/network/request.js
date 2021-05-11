import axios from 'axios'

export function request(config) {
  // 1. 创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })


  // 2. axios拦截器
  // 2.1请求拦截的作用.
  // 1.比如config中的一些信息不符合服务器的要求

  // 2.比如每次发送网络请求时，都希望在界面中显示一个请求的图标

  // 3. 某些网络请求(比如登录(token))时必须携带一些特殊的信息


  instance.interceptors.request.use(config => {
    // 拦截完后要将数据返回出去

    return config
  }, err => {
    // console.log(err);
  })

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    // 拦截完后要将数据返回出去

    return res.data
  }, err => {
    console.log(err);
  })

  // 3. 发送真正的网络请求
  // 返回一个promise对象，可以调用then方法0
  return instance(config)
}