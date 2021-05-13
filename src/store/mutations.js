export default {
  // 更新state数据,修改state的数据都要通过mutations,跟踪数据
  addCounter(state, payload) {
    payload.count++
  },
  addToCart(state, payload) {
    payload.checked = false
    state.cartList.push(payload)
  }

}