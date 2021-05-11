// 封装首页数据的请求
import { request } from './request.js'

// Multidata 多数据
// 获取首页导航部分数据
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

// 获取首页商品数据
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }

  })
}
