/**
 * Created by Aaronzm on 2018/9/8.
 */
'use strict'
import Vue from 'vue'
import config from '../libs/config'

const jsApiList = [
  'checkJsApi',
  "updateAppMessageShareData",
  "updateTimelineShareData",
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]

const SHARECONTENT = {
  title: '美美天成 - 商家端',
  link: 'https://app.mmtcapp.com',
  imgUrl: 'https://app.mmtcapp.com/merchanth5/images/favicon.png',
  describe: '如题'
}

function getShareHref () {
  let href = window.location.href
  if (window.location.search) {
    let search = "\\" + window.location.search;
    let reg = new RegExp(search, "ig");
    return href.replace(reg, '')
  } else {
    return href;
  }
}

getShareHref()
// 产品详情
export default {
  namespaced: true,
  state: {
    shareData: {
      title: document.title, // 分享标题
      desc: SHARECONTENT.describe,// 分享描述
      link: getShareHref(),// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '', // 分享图标
      success: function () {
        // Vue.$vux.toast.text('分享成功')
      },
      cancel: function () {
        // Vue.$vux.toast.text('分享失败')
      }
    }
  },
  mutations: {},
  actions: {
    signature ({commit, state, dispatch, rootState}, payload) {
      if (config.isWxRegister) {
        return
      }
      let wx = payload.wx,
        url = payload.url,
        code = payload.code,
        debug = payload.debug,
        flag = false
      config.isWxRegister = true;
      console.log(config.isWxRegister, 'wxjssdk-signature');
      return Vue.$https.getWxSignature(url).finally(res => {
        if (1 === res.status) {
          let data = res.info
          wx.config({
            debug,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList
          })
          wx.ready(() => {
            // 分享给朋友(即将废弃)
            wx.onMenuShareAppMessage && wx.onMenuShareAppMessage(state.shareData)
            // 分享到朋友圈(即将废弃)
            wx.onMenuShareTimeline && wx.onMenuShareTimeline(state.shareData)
            // 分享到QQ(即将废弃)
            wx.onMenuShareQQ && wx.onMenuShareQQ(state.shareData)
            // 分享到腾讯微博(即将废弃)
            wx.onMenuShareWeibo && wx.onMenuShareWeibo(state.shareData)
            // 分享到QQ空间(即将废弃)
            wx.onMenuShareQZone && wx.onMenuShareQZone(state.shareData)
            // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
            wx.updateAppMessageShareData && wx.updateAppMessageShareData(state.shareData, function (res) {
              console.log(res, '自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）')
              state.shareData.success()
            })
            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
            wx.updateTimelineShareData && wx.updateTimelineShareData(state.shareData, function (res) {
              console.log(res, '自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）')
              state.shareData.success()
            })
            config.isWxRegister = true
          })
          wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            config.isWxRegister = false
          })
        }
      })
    },
    updateShareData ({commit, state, dispatch, rootState}, payload) {
      state.shareData.title = payload.title || rootState.vux.title || document.title
      state.shareData.desc = payload.desc || SHARECONTENT.describe
      state.shareData.describe = state.shareData.desc
      state.shareData.link = payload.link || getShareHref()
      state.shareData.imgUrl = payload.imgUrl || SHARECONTENT.imgUrl
      if (payload.success) {
        state.shareData.success = payload.success
      }
      if (payload.cancel) {
        state.shareData.success = payload.cancel
      }
    }
  }
}
