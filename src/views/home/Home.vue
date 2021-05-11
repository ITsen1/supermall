<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />

    <!--scroll 实现better滚动 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />

      <feature-view />
      <tab-control
        class="tab-control"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
// 商品组件
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

// 公共组件
import NavBar from "components/common/navbar/NavBar";

import { getHomeMultidata, getHomeGoods } from "network/home.js";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
// 导入防抖函数
import { debounce } from "common/utils";

import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from "components/content/backTop/BackTop.vue";
import { itemListenerMixin } from "common/mixin.js";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    NavBar,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      // itemImgListener: null,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  destroyed() {
    // console.log("home销毁");
  },
  activated() {
    // 返回时回到当前位置
    // console.log("活跃");
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // console.log("活跃结束");
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    // console.log(this.saveY);

    // 2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  // 生命周期函数create
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    // 1.防抖函数处理item图片加载
    // 图片加载完的事件监听、
    // 导入mixin.js混入模块
    // const refresh = debounce(this.$refs.scroll.refresh, 50);
    // // 对我们监听的事件做一个保存
    // this.itemImgListener = () => {
    //   refresh();
    // };
    // //3 .监听item中图片加载完成
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
    // 2.获取tabControl的offertTop
    // 所有的组件都有一个$el:用于获取组件中的元素
    // this.tabOffsetTop = this.$refs.tabControl.tabOffsetTop;
  },
  methods: {
    // // 防抖函数
    // debounce(func, delay) {
    //   let timer = null;

    //   return function (...args) {
    //     if (timer) clearTimeout(timer);
    //     timer = setTimeout(() => {
    //       func.apply(this, args);
    //     }, delay);
    //   };
    // },
    // 事件监听相关
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;

      // console.log(this.currentType);
    },
    backClick() {
      // 点击回到顶部，封装在scroll.vue文件的scrollTo()方法
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      // console.log(position);
      // 1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      // 2.判断tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    // 上拉加载更多模块↓
    loadMore() {
      // console.log("上拉加载");
      // 调用网络请求数据，传递当前的currentType
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // -------------------
    // 网络请求相关
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // then方法接受到数据后要找个变量保存起来，方便后面数据的使用
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;

        // console.log(res);
      });
    },
    getHomeGoods(type) {
      // 获取传入元素的第一页  this.pop+1
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // 传入之后要将数据保存起来
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // console.log(res.data.list);
        //   需要调用BScroll的finishPullUp方法，才可以再次加载
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

// scopen style作用域 样式只在这个页面生效
<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9; */
}
.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}
.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* .content {
  /* height: 300px; */
/* height: calc(100% - 93px); */
/* overflow: hidden; */
/* margin-top: 44px; */
/* }  */
</style>