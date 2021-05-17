

export default {
  // 访问actions是通过$store.dispatch
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find((item) => {
        return item.iid === payload.iid
      })
      //  2. 判断oldProduct 
      // 判断数组里面是否有这个数据，有的话数据+1，没有得话添加整个对象
      if (oldProduct) {
        // 数量+1
        // oldProduct.count += 1
        context.commit('addCounter', oldProduct)
        resolve('当前的商品数量+1')
      } else {
        // 添加商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit('addToCart', payload)
        resolve('添加了新的商品')
      }
    })
  }
}
