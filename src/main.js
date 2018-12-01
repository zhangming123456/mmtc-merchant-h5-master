require('es6-promise').polyfill()

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value (callback, type, quality) {
      var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      callback(new Blob([arr], {type: type || 'image/png'}));
    }
  });
}



import Vue from 'vue'
import config from './libs/config'

Vue.prototype.isClientH5 = config.isClientH5
Vue.prototype.isMerchantH5 = config.isMerchantH5
Vue.prototype.isMiniWechat = config.isMiniWechat
// import FastClick from 'fastclick'
import App from './App'
import { sync } from 'vuex-router-sync'
import util, { queryString, cookie, dsBridge, Zepto } from './libs/util'
import store from './vuex'
import router from './router'

// 引入公共插件
import "./plugins"

(function (document) {
  util.placeholderPic(true)
  Zepto(window).on('resize', function () {
    util.placeholderPic(true)
  })
}(document))

// FastClick.attach(document.body)

Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback(value)).then(() => value),
    reason => P.resolve(callback(reason)).then(() => {
      throw reason
    })
  )
}

// 过滤器
import filter from './filter'

Vue.use(filter)

Vue.prototype.$routerLink = function ({path = '', query = {}}, type = 'push') {
  Object.assign(query, store.state.ApiService.$location)
  if (Zepto.isNumeric(path)) {
    router.go(path)
  } else if (query && Zepto.type(query) === 'boolean') {
    router.replace({path})
  } else if (query && Zepto.type(query) === 'string') {
    router[query] && router[query]({path})
  } else if (type && Zepto.type(type) === 'boolean') {
    router.replace({path, query})
  } else if (type && Zepto.type(type) === 'string') {
    if (type === 'reload') {
      type = 'replace'
    }
    router[type] && router[type]({path, query})
  } else {
    router.push({path, query})
  }
}

sync(store, router)


Vue.navigation.on('forward', (to, from) => {
  to.route.meta.isRefresh = true
  to.route.meta.keepAlive2 = true
})
Vue.navigation.on('back', (to, from) => {
  to.route.meta.isRefresh = false
  to.route.meta.keepAlive2 = false
})

Vue.prototype.$azm = {
  config,
  util,
  queryString,
  cookie,
  Zepto,
  // scrollTo: VueScrollTo.scrollTo,
  getSystemInfo: util.getSystemInfo
}
Vue.prototype.$dsBridge = dsBridge

const mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc',
      isMiniWechat: config.isMiniWechat
    }
  }
}

Vue.mixin({
  created () {
    this.util = util
    this.isMiniWechat = config.isMiniWechat
  }
})

//注册分享界面
util.Native.shareContent(store)
//注册路由
util.Native.router(router)
//注册导航按钮
util.Native.navBar(store, router)

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

/* eslint-disable no-new */

import http from './https'

Vue.use(http, store)

new Vue({
  mixins: [mixin],
  store,
  router,
  render: h => h(App)
}).$mount('#app')
