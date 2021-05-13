import Vue from 'vue'
import Vuex from 'vuex'

// 导入Vuex
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const state = {
  cartList: []
}


const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters

})
// 3.挂载到Vue实例上
export default store