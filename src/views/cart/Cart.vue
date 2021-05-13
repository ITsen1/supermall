<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import cartList from "./childComps/CartList.vue";

import { mapGetters } from "vuex";
import CartBottomBar from "./childComps/CartBottomBar.vue";
export default {
  name: "Cart",
  components: {
    NavBar,
    cartList,
    CartBottomBar,
  },
  computed: {
    // 两种语法
    ...mapGetters(["cartLength", "cartList"]),
  },
};
</script>

<style  >
.cart {
  height: 100%;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>