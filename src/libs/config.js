'use strict'
// import queryString from '../tools/querystring'

/**
 * 配置文件
 */
var host = `${window.location.protocol}//${window.location.hostname}:3000`//开发环境
// var host = 'http://192.168.3.41:3000'//开发环境
// var host = 'http://192.168.3.44:9001'
var Hash = +new Date()
var isVerifyApi = []
if (process.env.NODE_ENV === 'testing') {
  // host = 'http://192.168.3.65:9001'//本地测试反向代理
  Hash = +new Date()
} else if (process.env.NODE_ENV === 'production') {
  host = 'https://app.mmtcapp.com'//发布环境
  Hash = +new Date()
} else {
  var arr = []
  for (var i = 0; i < arr.length; i++) {
    isVerifyApi.push(arr[i])
  }
}

var config = {
  // 下面的地址配合云端 Server 工作
  host,
  Hash,
  name: 'merchantH5',
  NODE_ENV: process.env.NODE_ENV,
  isVerifyApi (path) {
    if (/^\/login/.test(path)) {
      return true;
    } else if (/^\/project/.test(path)) {
      return true;
    } else {
      for (var i = 0; i < isVerifyApi.length; i++) {
        if (isVerifyApi[i] === path) {
          return true;
        }
      }
    }
  },
  version: `2.0.${Hash}`,
  appid: 'wx27285cd6edabc289',//公众号的appid
  // 图片服务器地址
  imageUrl: `https://app.mmtcapp.com`,
  upImagesUrl: `${host}/services/uploader/uploadImgs`,//多图上传
  upImageUrl: `${host}/services/uploader/uploadImg`,//单图上传
  uploadImgObj: `${host}/services/uploader/uploadImgObj`,//单图上传(返回对象)
  isMerchantH5: window.mmtc_environment == 2 ? true : false,
  isClientH5: window.mmtc_environment == 1 ? true : false,
  isMiniWechat: window.__wxjs_environment === 'miniprogram' || /__wxjs_environment=miniprogram&/ig.test(window.location.search),
  debug: false,
  setSessionId: false
}
module.exports = config
