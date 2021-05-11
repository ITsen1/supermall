<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @loadImgEvent="imageLoad" />
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :comment="comment" />

      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "components/common/scroll/Scroll.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";

import GoodsList from "components/content/goods/GoodsList.vue";
// 导入防抖函数
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin.js";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailShopInfo,
    DetailBaseInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      comment: {},
      recommends: [],
      // itemImgListener: null,
      themeTops: [],
    };
  },
  created() {
    // 1.保存传入的 iid
    // console.log(this.$route.params);
    this.iid = this.$route.params.iid;

    // 2. 根据 iid 请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      // 1. 获取顶部轮播图数据
      this.topImages = data.itemInfo.topImages;

      // 2. 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3. 创建店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.comment = data.rate.list[0];
      }
    });

    // 3. 请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },
  methods: {
    imageLoad() {
      // console.log("+++++");
      this.$refs.scroll.refresh();
      // this.newRefresh();
    },
    titleClick(index) {
      // 点击导航栏，跳转到参数指定的模块
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100);
    },
  },
  mounted() {
    // 获取四个参数的offsetTop值    注意：要从$el中获取
    this.themeTops.push(0); //商品
    this.themeTops.push(this.$refs.params.$el.offsetTop); // 参数
    this.themeTops.push(this.$refs.comment.$el.offsetTop); // 评论
    this.themeTops.push(this.$refs.recommend.$el.offsetTop); // 推荐
    console.log(this.themeTops);
  },
  destroyed() {
    // console.log("deactivated");
    // 离开该页面时停止图片更新的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  overflow: hidden;
  /* position: absolute; */
  height: calc(100% - 44px);
  /* top: 44px; */
  /* left: 0; */
  /* right: 0; */
}
</style>