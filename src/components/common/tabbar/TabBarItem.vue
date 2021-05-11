<template>
  <div class="tab-bar-itme" @click="itemClick">
    <!-- <img src="../../assets/img/tabbar/home.svg" alt="" />
    <div>首页</div> -->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      // isActive: true,
    };
  },
  methods: {
    itemClick() {
      // 若不想返回上一个页面，后面加replace，若允许可以跳转上个页面，加上push
      this.$router.replace(this.path);
    },
  },
  computed: {
    isActive() {
      // home -> item(/home) = true
      // home -> item(/cart) = false
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
};
</script>

<style>
.tab-bar-itme {
  flex: 1;
  text-align: center;
  height: 49px;
  /* line-height: 49px; */
  font-size: 14px;
}
.tab-bar-itme img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>