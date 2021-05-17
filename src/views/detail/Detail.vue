<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @loadImgEvent="imageLoad" />
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :comment="comment" />

      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <detail-bottom-bar @addCart="addToCart" />
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
import { itemListenerMixin, backTopMixin } from "common/mixin.js";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";

// 导入actions的映射
import { mapActions } from "vuex";

// toast模块
import Toast from "components/common/toast/Toast";

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
    DetailBottomBar,
  },
  mixins: [itemListenerMixin, backTopMixin],
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
      themeTopsYs: [],
      getThemTopY: null,
      currentIndex: 0,
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
      //

      //  1.第一次获取值不对
      // 值不对的原因：this.$refs.params.$el 压根没有渲染
      // this.themeTops = [];
      // this.themeTops.push(0); //商品
      // this.themeTops.push(this.$refs.params.$el.offsetTop); // 参数
      // this.themeTops.push(this.$refs.comment.$el.offsetTop); // 评论
      // this.themeTops.push(this.$refs.recommend.$el.offsetTop); // 推荐
      // console.log(this.themeTops);

      // created不一定会将$el完全渲染出来，但是可以通过$nextTick获取
      // this.$nextTick(() => {
      //   // 2. 第二次值：不对
      //   // 原因：图片没有计算在内

      //   // 根据最新数据的，对应的DOM是已经渲染出来了，
      //   // 但是图片是还没加载完的(目前获取offsetTop是不包含图片的 )
      //   // offsetTop值不对的时候，就是因为图片的问题
      //   this.themeTops = [];
      //   this.themeTops.push(0); //商品
      //   this.themeTops.push(this.$refs.params.$el.offsetTop); // 参数
      //   this.themeTops.push(this.$refs.comment.$el.offsetTop); // 评论
      //   this.themeTops.push(this.$refs.recommend.$el.offsetTop); // 推荐
      //   console.log(this.themeTops);
      // });
    });

    // 3. 请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4.给getThemTopY赋值
    this.getThemTopY = debounce(() => {
      // this.newRefresh();
      this.themeTopsYs = [];
      this.themeTopsYs.push(0); //商品
      this.themeTopsYs.push(this.$refs.params.$el.offsetTop); // 参数
      this.themeTopsYs.push(this.$refs.comment.$el.offsetTop); // 评论
      this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop); // 推荐
      console.log(this.themeTopsYs);
    });
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      // 监听图片加载完成
      console.log("+++++");
      this.$refs.scroll.refresh();
      // 调用防抖函数
      this.getThemTopY();
    },
    titleClick(index) {
      // 点击导航栏，跳转到参数指定的模块
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopsYs[index], 100);
    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取y值
      const positionY = -position.y;

      // 2.positionY和主题中值进行对比
      //es6语法for循环中的i是字符串 01 02 03
      for (let i = 0; i < this.themeTopsYs.length; i++) {
        // console.log(i + 1);
        let length = this.themeTopsYs.length;
        // if (
        //   positionY > this.themeTopsYs[i] &&
        //   positionY < this.themeTopsYs[i + 1]
        // ) {
        //   console.log(i);
        // }
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopsYs[i] &&
            positionY < this.themeTopsYs[i + 1]) ||
            (i === length - 1 && positionY > this.themeTopsYs[i]))
        ) {
          // console.log(i);
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 3. 是否显示回到顶部
      this.isShowBackTop = -position.y > 1000;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 100);
    },
    addToCart() {
      // 接受购物车点击
      // console.log("点击了购物123车");
      //1.获取购物车需要展示的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2. 将商品添加到购物车里，使用Vuex
      // this.$store.cartList.push(product);
      // this.$store.commit("addCart", product);

      // 1.直接从vuex取得promise方法(promise)
      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });

      // 2.导入vuex映射，直接获取自身属性(mapActions)
      this.addCart(product).then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    // 获取四个参数的offsetTop值    注意：要从$el中获取
  },
  updated() {
    // this.themeTops = [];
    // this.themeTops.push(0); //商品
    // this.themeTops.push(this.$refs.params.$el.offsetTop); // 参数
    // this.themeTops.push(this.$refs.comment.$el.offsetTop); // 评论
    // this.themeTops.push(this.$refs.recommend.$el.offsetTop); // 推荐
    // console.log(this.themeTops);
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
  height: calc(100% - 44px - 42px);
  /* top: 44px; */
  /* left: 0; */
  /* right: 0; */
}
</style>