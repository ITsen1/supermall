export default {
  // 访问actions是通过$store.dispatch
  addCart(context, payload) {
    let oldProduct = context.state.cartList.find((item) => {
      return item.iid === payload.iid
    })
    //  2. 判断oldProduct 
    // 判断数组里面是否有这个数据，有的话数据+1，没有得话添加整个对象
    if (oldProduct) {
      // oldProduct.count += 1
      context.commit('addCounter', oldProduct)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit('addToCart', payload)
    }
  }
}
