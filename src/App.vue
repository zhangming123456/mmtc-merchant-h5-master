<template>
  <div id="app" class="appGlobal clearfix" :class="{'azm-navBarShow':$route.meta.navBarHide}">
    <div class="_navBar" v-if="$route.meta.navBarHide && navBarBtn.fixed"></div>
    <van-nav-bar :fixed="navBarBtn.fixed" :z-index="navBarBtn.zIndex" class="azm-navBar"
                 :title="navBarBtn.title || navBarTitle"
                 v-if="$route.meta.navBarHide" :style="navBarBtn.style"
                 :class="{'azm-navBar-link':navBarBtn.lowerLine}"
                 :left-text="navBarBtn.leftText"
                 :left-arrow="!$route.meta.currentPage && navBarBtn.leftArrow" @click-left="onClickLeft"
                 @click-right="onClickRight">
      <van-icon :style="navBarBtn.rightStyle" name="search" slot="right" v-if="navBarBtn.rightIcon === 'search'"/>
      <van-icon :style="navBarBtn.rightStyle" name="add-o" slot="right" v-else-if="navBarBtn.rightIcon === 'add-o'"/>
      <i class="iconfont icon-dui" :style="navBarBtn.rightStyle" slot="right"
         v-else-if="navBarBtn.rightIcon === 'icon-dui'"></i>
      <span class="van-nav-bar__text" :style="navBarBtn.rightStyle" slot="right" v-else-if="navBarBtn.rightText">{{navBarBtn.rightText}}</span>
    </van-nav-bar>
    <transition :name="!$route.meta.transition?transitionName:'fade'">
      <navigation v-if="$route.meta.keepAlive">
        <router-view class="azm-router-view clearfix maxWidth500" @transfer='transferFun'
                     v-if="isRouterRefresh"
                     ref="routerView"></router-view>
      </navigation>
      <router-view class="azm-router-view clearfix maxWidth500" v-if="!$route.meta.keepAlive  && isRouterRefresh"
                   @transfer='transferFun'
                   ref="routerView"></router-view>
    </transition>
    <tabbar v-if="$route.meta.isTabbar">
      <tabbar-item :selected="transferObj.tabbarLink === 'home'" link="/">
        <img slot="icon" src="../assets/icon/nav_form.png">
        <img slot="icon-active" src="../assets/icon/nav_form_active.png">
        <span slot="label">报表</span>
      </tabbar-item>
      <tabbar-item :selected="transferObj.tabbarLink === 'order'" link="/order">
        <img slot="icon" src="../assets/icon/nav_order.png">
        <img slot="icon-active" src="../assets/icon/nav_order_active.png">
        <span slot="label">点餐</span>
      </tabbar-item>
      <tabbar-item :selected="transferObj.tabbarLink === 'report'" link="/report">
        <img slot="icon" src="../assets/icon/nav_report.png">
        <img slot="icon-active" src="../assets/icon/nav_report_active.png">
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item :selected="transferObj.tabbarLink === 'me'" link="/me">
        <img slot="icon" src="../assets/icon/nav_me.png">
        <img slot="icon-active" src="../assets/icon/nav_me_active.png">
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { isMerchantH5 } from './libs/util'
  import { Tabbar, TabbarItem } from 'vux'
  import { mapState } from 'vuex'
  import { NavBar, Icon } from 'vant'
  //  import TouchRipple from 'vue-touch-ripple/src/component'

  export default {
    components: {
//      TouchRipple,
      [NavBar.name]: NavBar,
      [Icon.name]: Icon,
      Tabbar,
      TabbarItem
    },
    provide () {
      return {
        appRefresh: this.appRefresh,
        isMerchantH5: isMerchantH5,
        $$$setNarBar: this.$$$setNarBar
      }
    },
    events: this.navBarBtn,
    data () {
      return {
        name: 'app',
        navBarBtnRightText: '',
        navBarBtnRightBtn: null,
        navBarBtn: {},
        data: {},
        transferObj: {
          isTabbar: false,
          tabbarLink: 'home',
          backgroundColor: '#FFF',
          navBarHide: false
        },
        scrollX: 1000,
        isRouterRefresh: true,
        transitionName: 'fade',
        isFixed: false
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading,
        navBarTitle: state => state.vux.title,
        appIsFixed: state => state.product.appIsFixed
      })
    },
    watch: {
      [`isLoading`]: {
        handler: function (val) {
          if (val) {
            this.$vux.loading.show()
          } else {
            this.$vux.loading.hide()
          }
        },
        deep: true
      }
    },
    created () {
      let timer = null, i = 0, that = this;
      let $ = that.util.Zepto;
      let app = $('body');
      if (this.$device.isAndroid) {
        app.on('focus', 'input', function () {
          setTimeout(function () {
            this.scrollIntoViewIfNeeded && this.scrollIntoViewIfNeeded(true);
            this.scrollIntoView && this.scrollIntoView(true);
          }, 500);
        });
      }
      // bind event ， 更多参数移步vue-navigation
      this.$navigation.on('forward', (to, from) => {
        let currentPage = that.$route.meta.currentPage
        let VNK = that.$route.query.VNK
        if (!currentPage > 0 && VNK) {
          that.transitionName = 'slide-left'
        }
      })
      this.$navigation.on('back', (to, from) => {
        let VNK = that.$route.query.VNK
        if (VNK) {
          that.transitionName = 'slide-right'
        }
      })

      this.$navigation.on('replace', (to, from) => {
        console.log('replace')
      })

      this.$navigation.off('refresh', (to, from) => {
        console.log('refresh')
      })
      this.$navigation.on('reset', () => {
        console.log('reset')
      })
      window.$$$setNarBar = that.$$$setNarBar
      that.$$$setNarBar()
//      this.$azm.Zepto("#app").on('click', function () {
//        if (that.$route.path === '/debug') return
//        clearTimeout(timer)
//        if (i > 10) {
//          i = 0
//          that.$router.push('/debug')
//        } else {
//          timer = setTimeout(function () {
//            i = 0
//          }, 300)
//        }
//        i++
//      })
    },
    mounted () {
      let that = this
//      that.$store.commit('vux/setViewBox', that.$refs.viewBox)
    },
    methods: {
      /**
       * 项目刷新
       */
      appRefresh () {
        let that = this
        that.isRouterRefresh = false
        that.$nextTick(function () {
          that.isRouterRefresh = true
        })
      },
      $$$setNarBar (option = {}) {
        this.navBarBtn = Object.assign({
          leftText: '',
          rightText: '',
          rightIcon: '',
          leftArrow: true,
          fixed: true,
          zIndex: 1000,
          lowerLine: true,
          style: ''
        }, option)
        if (option.title) {
          this.$store.commit('vux/setNavigationBarTitle', {title: option.title})
        }
      },
      transferFun (a) {
        this.transferObj = Object.assign(this.transferObj, a)
      },
      onScroll (e) {
        console.log(e)
      },
      routerLink (path, params) {
        this.$router.push({path, query: params})
      },
      onClickLeft (...arg) {
        console.log(...arg, '点击了导航栏左按钮')
        if (this.$refs.routerView && this.$refs.routerView.narBackLeft) {

        } else {
          this.$router.back()
        }
      },
      onClickRight (...arg) {
        console.log(...arg, '点击了导航栏右按钮')
        if (this.navBarBtn && this.navBarBtn.rightBtn) {
          this.navBarBtn.rightBtn()
        } else if (this.$refs.routerView && this.$refs.routerView.narBackLeft) {
          let narBackRight = this.$refs.routerView.narBackRight
          narBackRight && narBackRight()
        } else {

        }
      },
      getScrollBody (v) {
        console.log(v)
      },
      getScrollTop (v) {
        console.log(v)
      }
    }
  }
</script>
<style lang='less'>
  @import '../static/libs/css/reset.css';
  @import './styles/iconfont/iconfont.css';
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/close.less';
  @import "./styles/1px";
  @import "./styles/vux-theme";
  @import './styles/common.less';
  /*@import '~vue-touch-ripple/component.css';*/

  /*html, body {*/
  /*!*height: 100%;*!*/
  /*!*width: 100%;*!*/
  /*overflow-x: hidden;*/
  /*}*/

  * {
    touch-action: auto;
  }

  #app .mu-elevation-4 {
    box-shadow: 0 0.027rem 0.053rem -1px rgba(0, 0, 0, .05), 0 0.053rem 0.067rem 0 rgba(0, 0, 0, .035), 0 1px 0.133rem 0 rgba(0, 0, 0, .03);
  }

  /*图表头部公共样式*/
  .azm-chart-top {
    box-sizing: border-box;
    padding: 12px 15px;
    .azm-chart-top-left {
      box-sizing: border-box;
      padding-left: 15px;
      position: relative;
      font-size: 14px;
      color: #171F24;
      font-weight: 500;
      &:before {
        content: ' ';
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        background-image: linear-gradient(-135deg, #309BFF 0%, #305BFF 100%);
      }
    }
    .azm-chart-top-right {
      border-radius: 1px;
      border: 1px solid #2D81E4;
      .mu-button {
        border-radius: 0;
        overflow: hidden;
        margin: 0;
        width: 30px;
        height: 30px;
        min-width: 30px;
        span {
          font-size: 15px;
        }
        &.azm-btn-bar {
          background-color: #2D81E4;
        }
      }
      &.azm-chart-btn-active {
        .mu-button {
          background-color: #2D81E4;
          &.azm-btn-bar {
            background-color: #fff;
          }
        }
      }
    }
  }

  .mu-load-more {
    min-height: 200px;
  }

  .azm-load-more-wrap {
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    top: 0;
    max-width: 100%;
    width: 100%;
    > div, section {
      width: 100%;
    }
    .azm-load-more-item {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  /*.isFixed {*/
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*bottom: 0;*/
  /*right: 0;*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*background-color: #f4f4f4;*/
  /*}*/

  #app .azm-icon-close {
    position: absolute;
    top: 0;
    right: 8px;
    z-index: 100;
    font-size: 16px;
    transform: translate(50%, -50%);
    background-color: #fff;
    color: #999;
  }

  .slide-left-enter-active, .slide-left-leave-active {
    transition: all .3s ease;
  }

  .slide-right-enter-active, .slide-right-leave-active {
    transition: all .3s ease;
  }

  /* , .slide-fade-leave-active for below version 2.1.8 */
  /*, .slide-fade-leave-active for below version 2.1.8 */
  .slide-left-enter {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-right-enter {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  #app {
    .slide-right-leave-active, .slide-left-leave-active,
    .slide-right-enter-active, .slide-left-enter-active {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    &.azm-navBarShow {
      .slide-right-leave-active, .slide-left-leave-active,
      .slide-right-enter-active, .slide-left-enter-active {
        top: 45px;
      }
    }
  }

  .slide-right-leave-active, .slide-left-leave-active {
    z-index: 2;
  }

  .marTop12 {
    margin-top: 12px;
  }

  .marBottom50 {
    margin-bottom: 50px;
  }

  .padLeft15 {
    box-sizing: border-box;
    padding-left: 15px;
  }

  .w100 {
    width: 100%;
  }

  .azm-btn-small {
    .mu-button {
      margin-left: 5px;
      min-width: 75px;
      border: 1px solid #2D81E4;
      font-size: 12px;
      &.azm-edit-btn {
        background-color: #2D81E4;
        /*background-image: linear-gradient(90deg, #35abfe, #3d70f7);*/
      }
      &.azm-disabled-btn {
        border: 1px solid #F5F5F5;
      }
    }
  }

  .azm-tab-box {
    text-align: center;
    min-width: 150px;
  }

  .azm-append-footer-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .azm-money {
    .azm-money-group-txt {
      font-size: 14px;
      color: #ff4919;
    }
    .azm-money-group-unit {
      font-size: 12px;
      color: #ff4919;
    }
    .azm-money-group-price, .azm-money-price {
      font-size: 20px;
      color: #ff4919;
    }
    .azm-money-decoration {
      margin-left: 5px;
      font-size: 12px;
      color: #999999;
    }
  }

  /*指示器颜色*/
  .van-swipe__indicator--active {
    background-color: #04d3af;
    width: 10px;
    border-radius: 3px;
  }

  button.van-col {
    border-width: 0;
    background-color: transparent;
    display: block;
    text-align: left;
  }

  .azm-template {
    .azm-template__box {
      line-height: 24px;
      min-height: 10px;
      overflow: hidden;
      padding-top: 15px;
      padding-bottom: 15px;
      p {
        font-size: 13px;
        line-height: 24px;
        width: 100%;
        padding-bottom: 10px;
        img {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }
      }
      &.azm-template__box-max {
        max-height: 462/2px;
      }
      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }
  }

  .rotate180 {
    transform: rotate(180deg);
  }

  .rotate90 {
    transform: rotate(90deg);
  }

  .box-shadow {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12)
  }

  .box-shadow-t {
    box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.12)
  }

  * {
    box-sizing: border-box;
    font-family: 'Roboto', PingFang-SC-Bold, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    text-rendering: optimizeLegibility;
  }

  .cropper-bg {
    background-image: none;
  }

  .text-left {
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  body {
    margin: 0 auto;
    position: relative;
    > div {
      position: relative;
    }

  }

  /*评分*/
  .azm-rate {
    display: inline-block;
    line-height: 1;
    img {
      vertical-align: middle;
      width: 15px;
      height: auto;
      margin-right: 5px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }

  /*项目列表*/
  .azm-item--list-2 {
    .azm-item--list-2-box {
      &.van-cell:after {
        border-width: 0;
      }
    }
  }

  /*项目盒子*/
  .azm-item--box {
    background-color: #fff;
    height: 100%;
    padding-bottom: 65px;
    box-sizing: border-box;
    border-radius: 5px;
    > div {
      box-sizing: border-box;
      padding: 0 3px;
    }
    .azm-img {
      padding: 0;
      width: 100%;
      border-radius: 4px;
      height: 336/2px;
      overflow: hidden;
      background-color: #f4f4f4;
      img {
        width: inherit;
        height: auto;
      }
    }
    .azm-title {
      margin-top: 10px;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .azm-txt {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }
    .azm-txt__footer {
      position: absolute;
      left: 0;
      bottom: 10px;
      width: 100%;
      .azm-txt2 {
        line-height: 1;
        font-size: 14px;
        color: #999;
        > div {
          &:nth-child(1) {

          }
          &:nth-child(2) {
            text-align: right;
          }
        }
      }
      .azm-txt3 {
        position: relative;
        color: #ff6283;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-price__txt {
        }
        .azm-price__unit {
        }
        .azm-price {
          font-size: 16px;
        }
        .azm-dash__price {
          color: #999;
          text-decoration: line-through;
        }
        .azm-likes--num {
          position: absolute;
          bottom: 0;
          right: 0;
          color: #999;
        }
      }
      .azm-txt4 {
        position: relative;
        margin-top: 15px;
        color: #666;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-txt--shop {

        }
        .azm-txt--distance {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .azm-txt5 {
        position: relative;
        margin-top: 5px;
        color: #666;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-txt--shop-avatar {
          display: inline-block;
          width: 25px;
          height: 25px;
          border-radius: 100%;
          overflow: hidden;
          transform: translateY(25%);
          img {
            width: 100%;
            height: auto;
          }
        }
        .azm-txt--shop {

        }
        .azm-txt--distance {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .azm-money {
        margin-top: 15px;
        color: #ff6283;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-price__txt {
        }
        .azm-price__unit {
        }
        .azm-price {
          font-size: 22px;
        }
        .azm-dash__price {
          color: #999;
          text-decoration: line-through;
          margin-left: 15px;
        }
      }
    }
  }

  .van-button--mmtcPrimary {
    color: #fff;
    background-color: #FF538B;
    border: 1px solid #FF538B;
    &.azm-btn-followed {
      background-color: #ccc;
      border: 1px solid #ccc;
    }
  }

  .van-tag--gray {
    background-color: #f4f4f4;
    border-radius: 2px;
    padding: 4.5px 7.5px;
    font-size: 12px;
    color: #666;
    &::after {
      border-color: #f4f4f4;
    }
  }

  #app {
    width: 100%;
    /*height: 100%;*/
    z-index: 0;
    .marginTop0 {
      margin-top: 0;
    }

    .pr {
      position: relative;
    }
    .pa {
      position: absolute;
    }
    .h100 {
      height: 100%;
    }
    .navBar {
      z-index: 1000;
      height: 46px;
      line-height: 46px;
    }

    .vux-loading {
      z-index: 1000;
    }
    .weui-tabbar {
      position: fixed;
    }
    .azm-tag {
      padding: 4.5px 7.5px;
      line-height: 1;
      font-size: 12px;
      border-radius: 2px;
    }
    .van-tag--defaultTag {
      line-height: 1;
      color: #04d3af;
      font-size: 12px;
      border-radius: 2px;
      padding: 4.5px 7.5px;
      &::after {
        border-color: #04d3af;
      }
    }
  }
</style>
