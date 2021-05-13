<template>
  <div class="cart-list">
    <scroll class="content">
      <cart-list-item
        v-for="(item, index) in cartList"
        :key="index"
        :item="item"
        ref="scroll"
      />
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Scroll from "components/common/scroll/Scroll.vue";
import CartListItem from "./CartListItem.vue";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem,
  },
  methods: {
    activated() {
      this.$refs.scroll.refresh();
    },
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
};
</script>

<style scoped>
.cart-list {
  height: calc(100vh - 1.9rem - 2.09rem - 1.9rem - 2.5rem);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>