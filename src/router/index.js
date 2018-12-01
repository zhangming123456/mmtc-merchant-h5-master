import Vue from 'vue'
import Router from 'vue-router'
import config from '../libs/config'
// import { WechatPlugin } from 'vux'

import WechatPlugin from '../libs/WechatPlugin/index'

Vue.use(WechatPlugin);

import { Native, Zepto, cookie, queryString } from '../libs/util'

window.$azm.isRegister = 0
Vue.use(Router)
Vue.prototype._router = {}
import NProgress from 'muse-ui-progress'
import routes from './config'
import util from "../libs/util";

const wx = Vue.wechat;
const router = new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    let data = savedPosition || {}
    // 如果你的連結是帶 # 這種
    // to.hash 就會有值(值就是連結)
    // 例如 #3
    if (to.hash) {
      data.selector = to.hash
      // {
      // 這個是透過 to.hash 的值來找到對應的元素
      // 照你的 html 來看是不用多加處理這樣就可以了
      // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
      // }
    }
    // console.log(to, from, data, savedPosition, '___hhh__hhh_')
    if (savedPosition) {
      return data
    } else if (to.path === from.path) {
      return Object.assign(data, {x: 0, y: 0})
    } else {
      if (to.meta.keepPosition) {
        return Object.assign(data, {x: 0, y: 0}, to.meta.savedPosition)
      }
      return Object.assign(data, {x: 0, y: 0})
    }
  }
});

// 微信jssdk授权
async function wx_auth_fun (to) {
  const store = router.app.$store;
  let href = window.location.href;
  let _query = queryString.parse(window.location.search);
  let js_code = cookie.get("js_code");
  if (config.NODE_ENV === 'production' && Vue.$device.isWechat && !_query.PHPSESSID && !config.isMiniWechat && !_query.code && to.path === '/login') {
    let redirect_uri = `${config.host}/nodeapi/wx/redirectUrl?scope=1&redirect_uri=${encodeURIComponent(href)}`;
    // await store.dispatch('ApiService/wxRedirectUri', {scope: true, redirect_uri: href});
    window.location.replace(redirect_uri);
    return true;
  }
  if (Vue.$device.isWechat && !config.isWxRegister && process.env.NODE_ENV === 'production') {
    /**-------------------------- 微信jssdk ----------------------**/
    let url = window.location.href.split('#')[0],
      debug = true;
    if (config.NODE_ENV === 'production') {
      debug = false
    }
    debug = debug || config.debug;
    await store.dispatch('Wechat/signature', {wx, url, debug}).finally(res => {
      if (res.status === 1) {

      }
    })
    if (_query.code) {
      await Vue.$https.getWxUserInfo(_query.code).finally(res => {
        if (res.status === 1) {

        }
      })
    }
  }
}


async function openVConsole () {
  if (Vue.config.vconsole) return;
  if (!window.VConsole) {
    await $.getScript('https://app.mmtcapp.com/js/vconsole/vconsole.min.js')
  }
  Vue.config.devtools = true;
  await new VConsole();
  Vue.config.vconsole = true;
  Vue.config.silent = true;
  console.info('欢迎使用 vConsole。vConsole 是一个由微信公众平台前端团队研发的 Web 前端开发者面板，可用于展示 console 日志，方便开发、调试。')
  // 39vsj0tnd247ed10qbm0csrco3
}

router.onReady(function (to, from) {
  let _query = queryString.parse(window.location.search);
  let device = util.getSystemInfo();
  if (config.debug || /isDebug=1/ig.test(window.location.href)) {
    openVConsole()
  }

  if (device.isNative && !config.setSessionId) {
    Native.getSessionId()
  } else if (_query.PHPSESSID) {
    cookie.set('PHPSESSID', _query.PHPSESSID);
  }
  to.meta.currentPage = true
})
router.beforeEach(async function (to, from, next) {
  const store = router.app.$store;
  let isNative = Native.isNative()
  if (isNative.status === 0 && to.meta.navBarHide === undefined && !config.isMiniWechat) {
    to.meta.navBarHide = true
    config.navBarHide = true
  }
  let href = window.location.href;
  let _query = queryString.parse(window.location.search);
  console.log(Vue.$device.isWechat, config.isWxRegister, href, '微信');
  if (wx_auth_fun(to) === true) {
    return;
  }
  if (!Vue.$device.isWechat) {
    NProgress.start()//顶部进度条
  }
  window.$$$setNarBar && window.$$$setNarBar();
  store.commit('vux/updateLoadingStatus', {isLoading: true});
  store.commit('System/setNarBarFun', {
    callback: v => {

    }
  });
  store.commit('vux/setNavigationBarTitle', {title: to.meta.title || ''})//设置title
  document.querySelector('html').style.backgroundColor = to.meta.backgroundColor || 'transparent';//设置背景色
  Zepto('html').addClass(`html-${to.name}`);
  store.dispatch('Wechat/updateShareData', {title: to.meta.title})//更新微信分享数据
  store.commit('vux/initNavBar');
  let savedPosition = {x: Zepto(window).scrollLeft(), y: Zepto(window).scrollTop()}
  from.meta.savedPosition = savedPosition;
  to.meta.savedPosition = savedPosition;
  store.commit('ApiService/setLocation', {query: to.query});
  let $location = store.state.ApiService.$location,
    data = Zepto.extend(true, {}, from.query, to.query, $location);
  to.meta.$location = {lon: data.lon, lat: data.lat};
  // 设置是什么系统
  let _f = isNative.status === 1 ? 1 : 0
  to.meta.systemInfo = {_f}
  store.commit('vux/updateSystemInfo', {_f})
  next()
})
router.beforeResolve(function (to, from, next) {
  next()
})
router.afterEach(function (to, from) {
  NProgress.done()
  const store = router.app.$store
  console.log(to, from, 'afterEach')
  store.commit('vux/updateLoadingStatus', {isLoading: false})
  if (window.ga) {
    window.ga('set', 'page', to.fullPath) // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
    window.ga('send', 'pageview')
  }
})
export default router
