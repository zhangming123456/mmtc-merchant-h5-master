'use strict'
import Vue from 'vue'
import queryString from '../tools/querystring'
import md5 from '../tools/md5'
import regExp from './util/RegExp'
import trim from '../tools/string/trim'
import throttle from '../tools/throttle'
import dsBridge from 'dsbridge'
import config from './config'
import cookie from 'js-cookie'

let util = {}
util.queryString = queryString
util.md5 = md5
util.regExp = regExp
util.throttle = throttle
util.dsBridge = dsBridge
util.cookie = cookie
// mmtc_environment
// 1:用户端APP 2:商家端APP
const isMerchantH5 = util.isMerchantH5 = config.isMerchantH5
const isClientH5 = util.isClientH5 = config.isClientH5
const Zepto = util.Zepto = window.jQuery || window.Zepto

function _trim (x = '') {
  if (isString(x)) {
    try {
      return trim(x)
    } catch (e) {
      return x
    }
  } else {
    return false
  }
}

util.trim = _trim

/**
 * 判读是否是微信客户端
 * @return true - 微信客户端打开; false - 其他浏览器打开页面
 */
function is_wechat_client () {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

util.is_wechat_client = is_wechat_client

function sign (secretKey, params) {
  if (!params) return ''
  try {
    let [arr, str] = [[], '']
    for (let k in params) {
      arr.push(k)
    }
    arr.sort()
    for (let v of arr) {
      str += `${v}${params[v]}`
    }
    let sb = str.replace(/(&|undefined|null)/g, '')
    return md5(secretKey + sb).toUpperCase()
  } catch (e) {
    return ''
  }
}

util.sign = sign

var arr = []
var getProto = Object.getPrototypeOf
var slice = arr.slice
var concat = arr.concat
var push = arr.push
var indexOf = arr.indexOf
var class2type = {}
var toString = class2type.toString
var hasOwn = class2type.hasOwnProperty
var fnToString = hasOwn.toString
var ObjectFunctionString = fnToString.call(Object)
var support = {}

util.isArray = Array.isArray

function isBoolean (arg) {
  return typeof arg === 'boolean'
}

util.isBoolean = isBoolean

function isNull (arg) {
  return arg === null
}

util.isNull = isNull

function type (ob) {
  if (isNaN(ob)) {
    return 'NaN'
  } else {
    return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase()
  }
}

util.type = type

function isNullOrUndefined (arg) {
  return arg === null || arg === undefined
}

util.isNullOrUndefined = isNullOrUndefined

function isEqualToString (value, other) {
  return JSON.stringify(value) === JSON.stringify(other)
}

util.isEqualToString = isEqualToString

function isNumber (arg) {
  return typeof arg === 'number'
}

util.isNumber = isNumber

function isNumberOfNaN (arg) {
  if (!!arg && typeof arg === 'string') {
    arg = Number(arg)
  }
  return typeof arg === 'number' && !isNaN(arg)
}

util.isNumberOfNaN = isNumberOfNaN

function isString (arg) {
  return typeof arg === 'string'
}

util.isString = isString

function isJsonString (arg = '') {
  try {
    let json = trim(arg)
    if (!!json && isString(json)) {
      JSON.parse(json)
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

util.isJsonString = isJsonString

function isSymbol (arg) {
  return typeof arg === 'symbol'
}

util.isSymbol = isSymbol

function isUndefined (arg) {
  return arg === undefined
}

util.isUndefined = isUndefined

function isRegExp (re) {
  return regExp.isRegExp(re)
}

util.isRegExp = isRegExp

function isObject (arg) {
  return arg !== null && typeof arg === 'object'
}

util.isObject = isObject

function isDate (d) {
  return regExp.isDate(d)
}

util.isDate = isDate

function isFunction (arg) {
  return typeof arg === 'function'
}

util.isFunction = isFunction

function isPlainObject (obj) {
  var proto, Ctor

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }

  proto = getProto(obj)

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
}

util.isPlainObject = isPlainObject

function isPrimitive (arg) {
  return arg === null ||
    typeof arg !== 'object' && typeof arg !== 'function'
}

util.isPrimitive = isPrimitive

// util.isBuffer = Buffer.isBuffer;

function unique (arr) {
  const res = new Map()
  return arr.filter((a) => !res.has(a) && res.set(a, 1))
}

util.unique = unique

function pad (n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10)
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec']

// 26 Feb 16:19:34
function timestamp (text) {
  var d = new Date()
  var time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':')
  return [d.getDate(), months[d.getMonth()], time].join(' ')
}

util.timestamp = timestamp

function strToDate (date) {
  if (typeof date === 'string') {
    let arr = date.split(/[- : \/]/),
      _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0)
    return _date
  } else if (date instanceof Date) {
    return new Date()
  } else if (typeof +date === 'number' && !isNaN(+date)) {
    return new Date(+date)
  } else {
    return date
  }
}

util.strToDate = strToDate

/**
 * 判断是否为非空对象
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject (obj) {
  try {
    for (var name in obj) {
      return true
    }
    return false
  } catch (e) {
    return false
    console.log('非对象')
  }
}

util.isEmptyObject = isEmptyObject

/**
 * 判断是否为非空值
 * @param value
 * @returns {boolean}
 */
function isEmptyValue (value) {
  try {
    if (!value) {
      return false
    } else if (isString(value)) {
      return !!value
    } else if (Array.isArray(value)) {
      return value && value.length >= 0
    } else if (isObject(value)) {
      return isEmptyObject(value)
    }
  } catch (e) {
    return false
    console.log('判断是否为非空值出差', value)
  }
}

util.isEmptyValue = isEmptyValue

function isFalse (arg) {
  if (isString(arg) && arg.trim() === '') {
    return arg.trim()
  }
  if (arg === 'false' || arg === false || arg === null) {
    return false
  } else if (arg === 'undefined') {
    return undefined
  } else if (arg === 'true') {
    return true
  } else if (arg === 'null') {
    return null
  } else if (arg === 'NaN') {
    return NaN
  } else {
    return arg
  }
}

util.isFalse = isFalse
// log is just a thin wrapper to console.log that prepends a timestamp
util.log = function () {
  console.log('%s - %s', timestamp(), util.format.apply(util, arguments))
}

util.deepClone = function (obj) {
  var proto = Object.getPrototypeOf(obj)
  return Object.assign({}, Object.create(proto), obj)
}

util.number_filter = function (e) {
  //先把非数字的都替换掉，除了数字和.
  e = e.replace(/[^\d\.]/g, '')
  //必须保证第一个为数字而不是.
  e = e.replace(/^\./g, '0.')
  //保证只有出现一个.而没有多个.
  e = e.replace(/\.{2,}/g, '.')
  //保证.只出现一次，而不能出现两次以上
  e = e.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  //只能输入两个小数
  e = e.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return e
}

util.number_format = function (number, decimals = 2, dec_point, thousands_sep) {
  /*
   * 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? '' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec)
      return '' + Math.round(n * k) / k
    }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0]) && sep) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

util.money_format = function (number) {
  let symbol = ''
  let money = null
  if (number >= 100000000) {
    money = util.number_format(number / 100000000, 2, undefined, ',')
    symbol = '亿'
  } else if (number >= 10000000) {
    money = util.number_format(number / 10000000, 2, undefined, ',')
    symbol = '千万'
  } else if (number >= 1000000) {
    money = util.number_format(number / 1000000, 2, undefined, ',')
    symbol = '百万'
  } else if (number >= 10000) {
    money = util.number_format(number / 10000, 2, undefined, ',')
    symbol = '万'
  } else {
    money = util.number_format(number, 2, undefined, ',')
  }
  if (money !== undefined) {
    return `${money.replace(/(\.00)$/, '')}${symbol}`
  } else {
    return number
  }
}

/* 长宽占位 rem算法, 根据root的rem来计算各元素相对rem, 默认html 375/5 = 75px */

function placeholderPic (num = false, maxW = 750) {
  let w = document.documentElement.offsetWidth;
  let h = document.documentElement.offsetHeight;
  if (w > maxW) {
    w = maxW
  }

  if (isBoolean(num) && num === true) {
    document.documentElement.style.fontSize = w / 5 + 'px'
  } else if (isNumber(num) && num > 0) {
    return num / 5
  } else {
    return w / 5
  }
}

util.placeholderPic = placeholderPic

util.link_filter = function (input = '', route) {
  if (!/^\//.test(input) && input !== '') {
    input = '/' + input
  }
  let path = route.matched[0].path + input
  return path
}

util.getSystemInfo = function () {
  const isNative = util.Native.isNative()
  if (isNative.status) {
    Vue.$device.isNative = true
  } else {
    Vue.$device.isNative = false
  }
  return Vue.$device
}

/*******************************appNative方法****************************/
let timer = null

class _Native {
  constructor () {
    /**
     * 编辑套卡(editCard)
     * @param card_id
     */
    /**
     * 分享套卡二维码(shareCardQRcode)
     * @param card_id
     */
    const jsApiList = ['editCard', 'shareCardQRcode']
    this.expires = 1 / 24
    this.loginInfo = {}
    for (let v of jsApiList) {
      this.call(v)
    }
  }

  call (name) {
    if (!name) return
    this[name] = function ({...arg}) {
      let that = this,
        data = {...arg},
        prompt = arguments[1]
      console.log(data, `${name}方法所需参数`)
      return new Promise((resolve, reject) => {
        let isNative = that.isNative()
        if (isNative.status === 0) {
          if (prompt === 'alert') {
            Vue.$vux.alert.show({
              title: '提示',
              content: '该功能待开发中，请前往美美天成商家端APP操作~~',
              onHide () {

              }
            })
          } else if (prompt === 'downApp') {
            if (Vue.$device.isWechat && !config.isMiniWechat) {

            } else if (Vue.$device.isAndroid) {

            } else if (Vue.$device.isIphone) {

            } else {

            }
          }
          resolve({msg: isNative.msg, status: 203})
        } else {
          let text = dsBridge.call(name, data, function (obj) {
            resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
          })
          if (text !== '' && +text === 1) {
            resolve({msg: '调用成功', status: 200})
          } else if (text !== '' && +text === 0) {
            resolve({msg: '调用失败', status: 201})
          }
        }
      }).catch(err => {
        Vue.$vux.toast.text(`${name}调用出错${JSON.stringify(err)}`, 'top')
      })
    }
  }

  isNative (...arg) {
    let data = {}
    try {
      let text = dsBridge.call('isNative', {...arg})
      // console.log(`isNative`, text, dsBridge)
      if (text !== '' && +text === 1) {
        data = ({msg: '是内嵌页面', status: 1})
      } else {
        data = ({msg: '不是内嵌页面', status: 0})
      }
    } catch (err) {
      data = ({msg: `isNative调用出错${err}`, status: 0})
    }
    return data
  }

  /**
   * 获取当前的地理位置 getLocation
   * @param arg
   * @returns {Promise} lon Float 经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
   * @returns {Promise} lat Float 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
   * @returns {Promise} name String 否 位置名
   * @returns {Promise} address String 否 地址的详细说明
   * @returns {Promise} city_id int 城市ID
   * @returns {Promise} city_name String 城市ID
   */
  getLocation (...arg) {
    let that = this
    //异步调用
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('getLocation', {...arg}, function (obj) {
          if (config.NODE_ENV === 'development' && !config.debug) {
            // Vue.$vux.alert.show({
            //   title: 'getLocation',
            //   content: obj
            // })
            // Vue.$vux.loading.show()
          }
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`getLocation调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 根据地图定位获取经纬度 openLocation
   * @param arg
   * @returns {Promise} lon Float 经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
   * @returns {Promise} lat Float 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
   * @returns {Promise} name String 否 位置名
   * @returns {Promise} address String 否 地址的详细说明
   * @returns {Promise} city_id int 城市ID
   * @returns {Promise} city_name String 城市ID
   */
  openLocation (...arg) {
    let that = this
    //异步调用
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('openLocation', {...arg}, function (obj) {
          if (config.NODE_ENV === 'development' && !config.debug) {
            Vue.$vux.alert.show({
              title: 'openLocation',
              content: obj
            })
          }
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`getLocation调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 从本地相册选择图片或使用相机拍照。 chooseImage
   * @param zoom 是否压缩 1：是 0：否
   * @param crop 是否裁剪 1：是 0：否
   * @param aspectRatio 裁剪比例 '16:9'
   * @returns {Promise} img String 图片链接
   */
  chooseImage ({zoom = 1, crop = 1, aspectRatio = ''} = {}) {
    let that = this, data = {zoom, crop, aspectRatio};
    //异步调用
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('chooseImage', data, function (obj) {
          if (config.NODE_ENV === 'development' && !config.debug) {
            Vue.$vux.alert.show({
              title: 'chooseImage',
              content: obj
            })
          }
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`chooseImage调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 获取SessionId的方法 getSessionId
   * @param arg
   * @returns {Promise} sessionId{String} cookie信息
   * @returns {Promise} isLogin{Boolean} 是否登入
   */
  getSessionId (...arg) {
    let that = this
    const p = new Promise((resolve) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('getSessionId', {...arg}, function (obj) {
          let data = {info: JSON.parse(obj), msg: '调用成功', status: 1}
          console.log('getSessionId' + JSON.stringify(data))
          util.setLogin(data.info)
          resolve(data)
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: 'getSessionId调用出错', status: 0})
        }
      }
    })
    p.catch(err => {
      Vue.$toast.error(`getSessionId调用出错${JSON.stringify(err)}`, 'top')
    });
    return p
  }

  /**
   * 设置app Cookie
   * setSessionId
   * @param sessionId
   */
  setSessionId ({sessionId = ''}) {
    let that = this, _t = 'setSessionId', data = {sessionId};
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call(_t, data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`${_t}调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 打开App地图方法 openAppMap
   * @param lat 经度
   * @param lon 维度
   * @param address 地址
   * @returns {Promise}
   */
  openAppMap ({lon = 0, lat = 0, address = ''}) {
    let that = this,
      data = {lon, lat, address}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (!lat || !lon) {
        resolve({msg: '经纬度为空', status: 0})
      } else if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('openAppMap', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: 'openAppMap调用出错', status: 0})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`openAppMap调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 预览图片 previewImage
   * @param current{String} 非必填 当前显示图片的链接，不填则默认为 urls 的第一张
   * @param urls {StringArray} 必填 需要预览的图片链接列表
   * @returns {Promise}
   */
  previewImage ({current = '', urls = []}) {
    let that = this,
      data = {current, urls}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (!urls || urls.length === 0) {
        resolve({msg: '预览的图片链接列表不能为空', status: 0})
      } else if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('previewImage', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }

    })
    p.catch(err => {
      Vue.$vux.toast.text(`previewImage调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 拨打电话号码 makePhoneCall
   * @param phoneNumber{String} 必填 需要拨打的电话号码
   * @returns {Promise}
   */
  makePhoneCall ({phoneNumber = ''}) {
    let that = this,
      data = {phoneNumber}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative(),
        isLogin = util.getLogin().isLogin
      if (!_trim(phoneNumber)) {
        resolve({msg: '电话号码为空', status: 0})
      } else if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('makePhoneCall', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`makePhoneCall调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * app获取分享内容
   * shareContent
   * @param store
   * @return title  {String} 分享的标题
   * @return link   {String} 分享链接
   * @return imgUrl {String} 图片链接
   * @return describe {String} 副标题
   */
  shareContent (store) {
    dsBridge.register('shareContent', function () {
      try {
        let shareContent = store.state.Wechat.shareData
        return shareContent
      } catch (err) {
        return {}
      }
    })
  }

  /**
   * 去登入
   * toLogin
   * @param arg
   * @returns {Promise}
   */
  toLogin ({...arg} = {}) {
    let that = this,
      data = {...arg}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('toLogin', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 去海报浏览记录
   * toPosterBrowse
   * @param arg
   * @returns {Promise}
   */
  toPosterBrowse ({...arg} = {}) {
    let that = this, _t = 'toPosterBrowse',
      data = {...arg}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call(_t, data, function (obj) {
          resolve({info: JSON.parse(obj), msg: `${_t}调用成功`, status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: `${_t}调用成功`, status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: `${_t}调用失败`, status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`${_t}调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 立即支付
   * toPay
   * @param item_id 商品ID
   * @param is_group 是否拼团 默认0  否
   * @param group_id 拼团ID
   * @return {Promise}
   */
  toPay ({item_id = 0, is_group = 0, group_id = 0}) {
    let that = this,
      data = {item_id, is_group, group_id}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative(),
        isLogin = util.getLogin().isLogin
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else if (+isLogin === 0) {
        resolve({msg: '未登入', status: 202})
      } else if (!item_id) {
        resolve({msg: '项目id不能为空', status: 0})
      } else {
        let text = dsBridge.call('toPay', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`toPay调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 立即支付 店铺支付
   * shopToPay
   * @param id 用户ID
   * @param sessionId 用户ID
   * @return {Promise}
   */
  shopToPay ({id = 0, sessionId = 0}) {
    let that = this,
      data = {id, sessionId}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else if (!id) {
        resolve({msg: 'id不能为空', status: 0})
      } else {
        let text = dsBridge.call('shopToPay', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 1})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`shopToPay调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 去登入 美容宝
   * shopToLogin
   * @param arg
   * @returns {Promise}
   */
  shopToLogin ({...arg}) {
    let that = this,
      data = {...arg}
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('shopToLogin', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`shopToLogin调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * app跳转链接方法
   * router
   * @param router
   * @param path  {String} 跳转路径
   * @param query   {Object} 携带参数
   * @param type {String} 跳转方式（
   *              push:默认记入history 记录，
   *              replace:不会留下 history 记录
   *              ）
   * @return status 状态
   * @return msg 提示
   */
  router (router) {
    let that = this
    that.$router = router
    dsBridge.register('router', function ({path, query = {}, type = 'push'}) {
      if (['push', 'replace'].indexOf(type) === -1) {
        type = 'push'
      }
      if (!path) {
        return {status: 0, msg: '路径为空'}
      }
      that.$router[type]({path, query})
      return {status: 1, msg: ''}
    })
  }

  /**
   * h5条跳app路由
   * appRouter
   * @param router
   * @param path  {String} 跳转路径
   * @param query   {Object} 携带参数
   * @param type {String} 默认为空  finish：不留记录
   * @return status 状态
   * @return msg 提示
   */
  appRouter ({path = '', query = {}, type = ''}) {
    let that = this, _t = 'appRouter', data = {path, query, type};
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative();
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call(_t, data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        });
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    });
    p.catch(err => {
      Vue.$vux.toast.text(`${_t}调用出错${JSON.stringify(err)}`, 'top')
    });
    return p;
  }

  /**
   * app导航栏点击方法（navBar）
   * @param store
   * @param router
   * @param type  {Number | String} 点击类型
   * @param query   {Object} 携带参数
   * @return status 状态
   * @return msg 提示
   */
  navBar (store, router) {
    let that = this
    that.$store = store
    that.$router = router
    dsBridge.register('navBar', function ({type = 1, query = {}, slot = 'right'} = {}) {
      if (util.isJsonString(query)) {
        query = JSON.parse(query)
      }
      console.log(that.$store, type, query, slot, 'refresh')
      that.$store.commit('System/NarBarCallback', {type, query, slot})
      return {status: 1, msg: ''}
    })
  }

  /**
   * 保存图片到系统相册。
   * saveImageToPhotosAlbum
   * @param filePath {String}
   * @param type {String} [base64 | url]
   * @returns {Promise<any>}
   */
  saveImageToPhotosAlbum ({filePath = '', type = 'base64'}) {
    let that = this,
      data = {filePath, type};
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call('saveImageToPhotosAlbum', data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`shopToLogin调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }

  /**
   * 设置页面导航栏
   * setNavigation
   * @param title {String} 导航title
   * @param color {String}
   * @param backgroundColor {String}
   * @param opacity {Number} 透明度 0-1
   * @param isHide {Number} 0:不隐藏，1：隐藏
   * @param isDisabled {Number} 0:不禁止点击事件，1：禁止点击事件
   */
  setNavigation ({title = '', color = '', backgroundColor = '', opacity = 1, isHide = 0, isDisabled = 0} = {}) {
    let that = this, _t = 'setNavigation', data = {title, color, backgroundColor, opacity, isHide, isDisabled};
    const p = new Promise((resolve, reject) => {
      let isNative = that.isNative()
      if (isNative.status === 0) {
        resolve({msg: isNative.msg, status: 203})
      } else {
        let text = dsBridge.call(_t, data, function (obj) {
          resolve({info: JSON.parse(obj), msg: '调用成功', status: 1})
        })
        if (text !== '' && +text === 1) {
          resolve({msg: '调用成功', status: 200})
        } else if (text !== '' && +text === 0) {
          resolve({msg: '调用失败', status: 201})
        }
      }
    })
    p.catch(err => {
      Vue.$vux.toast.text(`${_t}调用出错${JSON.stringify(err)}`, 'top')
    })
    return p
  }
}

const Native = util.Native = new _Native()
/****************************appNative方法end****************************/

// 分页数据合并
util.pagingConcat = function (arr) {
  let a = []
  if (util.isArray(arr)) {
    for (let v of arr) {
      let b = Array.apply(null, v)
      a = a.concat(b)
    }
  }
  return a
}

util.setLogin = function ({sessionId, isLogin}) {
  let expires = 1 / 24 * 5
  if (+isLogin === 1 && /\=/ig.test(sessionId)) {
    let PHPSESSID = sessionId.split('=')[1]
    cookie.set('PHPSESSID', PHPSESSID, {expires})
    cookie.set('isLogin', 1, {expires})
  } else {
    util.removeLogin()
  }
}
util.getLogin = function () {
  return {
    sessionId: cookie.get('PHPSESSID'),
    isLogin: cookie.get('isLogin')
  }
}
util.removeLogin = function () {
  cookie.remove('PHPSESSID')
  cookie.remove('isLogin')
}

util.getCurrentHref = function () {
  return window.location.href
}

// 快速排序
util.quickSort = function (val) {
  //如果数组长度小于等于1无需判断直接返回即可
  let arr = []
  if (val.length <= 1) {
    return val
  }
  for (let v of val) {
    arr.push(v)
  }
  var midIndex = Math.floor(arr.length / 2)//取基准点
  var midIndexVal = arr.splice(midIndex, 1)//取基准点的值,splice(index,1)函数可以返回数组中被删除的那个数arr[index+1]
  var left = []//存放比基准点小的数组
  var right = []//存放比基准点大的数组
  //遍历数组，进行判断分配
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < midIndexVal) {
      left.push(arr[i])//比基准点小的放在左边数组
    }
    else {
      right.push(arr[i])//比基准点大的放在右边数组
    }
  }
  //递归执行以上操作,对左右两个数组进行操作，直到数组长度为<=1；
  return util.quickSort(left).concat(midIndexVal, util.quickSort(right))
}

function setMutations (state, payload, key) {
  let data = payload.data,
    _key = payload.key,
    page = payload.page
  if (!key) return
  if (page !== undefined && _key !== undefined) {
    let type = util.Zepto.type(state[key])
    if (state[key] && type !== 'object') {
      state[key] = {}
      if (page === 1) {
        state[key][_key] = []
      }
    }
    let type2 = util.Zepto.type(state[key][_key])
    if (!state[key][_key] || type !== 'array') {
      if (page === 1) {
        state[key][_key] = []
      }
    }
    state[key][_key][page - 1] = data
  } else if (page !== undefined) {
    if (page === 1) {
      state[key] = []
    }
    state[key][page - 1] = data
  } else if (_key !== undefined) {
    if (!state[key]) {
      state[key] = {}
    }
    state[key][_key] = data
  } else {
    state[key] = data
  }
}

util.setMutations = setMutations

const absUrl = util.absUrl = function absUrl (url, imgw) {
  if (url) {
    var reg0 = /^blob:https?:\/\//ig;
    var reg = /^https?:\/\//ig;
    var reg1 = /^wxfile:\/\//ig;
    var reg2 = /^wxftp:\/\//ig;
    var reg3 = /^data:image\/jpg;base64,/ig;

    if (reg.test(url) || reg0.test(url) || reg1.test(url) || reg3.test(url)) {
      return url;
    } else if (/^wxftp:/i.test(url)) {
      return url.replace(/^wxftp:/, '')
    }
    if (imgw) {
      if (typeof imgw === 'boolean') {
        if (url.indexOf('?') === -1) {
          url += '?'
        } else {
          url += '&'
        }
        url += '_t=' + new Date().getTime();
      } else {
        url += '!' + imgw + 'x' + imgw;
      }
    }
    if (!/^\//.test(url)) {
      url = `/${url}`
    }
    return config.imageUrl + url;
  } else {
    return "";
  }
};

function getScriptLoad (url, funName, callback) {
  let $ = util.Zepto;
  if (!url || !funName) {
    callback && callback();
  } else if (window[funName]) {
    callback && callback(window[funName]);
  } else {
    $.getScript(url, function (response, status) {
      if (window[funName] && status === 'success') {
        callback && callback(window[funName]);
      } else {
        callback && callback();
      }
    });
  }
}

util.getScriptLoad = getScriptLoad;

// exports = module.exports = util


function base64toBlob (urlData, type = 'png') {
  if (!/^data:image\/[a-z]+;base64,/ig.test(urlData)) {
    urlData = `data:image/${type};base64,${urlData}`
  }
  var arr = urlData.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {type: mime});
};

util.base64toBlob = base64toBlob

const UUID = {
  v1 () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
  v2 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  v3 () {
    function S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  v5 (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }
}
util.UUID = UUID

// function sss () {
//   // IOING 中部分源代码
// // dom 为 input 元素
// // scroll 为滚动容器的 Scroll 对象
//
//   function scrollTo (y, _y, t, s, r) {
//     r = r == undefined ? 1 : r
//     y = y == undefined ? top.scrollY : y
//     if (r == 1 ? y > _y : y < _y) return
//     s = s == undefined ? Math.abs((_y - y) / t * 17.6) : s
//     rAF(function () {
//       top.scrollTo(0, y += r * s)
//       scrollTo(y, _y, t, s, r)
//     })
//   }
//
//   function visibility () {
//     if (this.moving || this.wheeling) {
//       var top = dom.offset().top
//       var height = dom.offsetHeight
//       var viewTop = keyboardHeight + scrollOffsetTop
//       var viewBottom = factWindowHeight - scrollOffsetBottom
//
//       if (top + height <= viewTop || top >= viewBottom) {
//         dom.blur()
//       }
//     }
//   }
//
//   function refreshCursor () {
//     rAF(function () {
//       dom.getSelectionRangeInsert('')
//     })
//   }
//
//   function getScroll () {
//     var scroller = reactScroller || dom.closest('scroll')
//
//     scroll = scroller ? scroller.scrollEvent : null
//
//     if (type == 1) {
//       minScrollY = scroll.minScrollY
//     }
//   }
//
//   function getViewOffset () {
//     // android : (top.scrollY == 0 ? keyboardHeight : 0)
//     viewOffset = viewCenter - rangeOffset.top - (top.scrollY == 0 ? keyboardHeight : 0) + (that.module.config.sandbox ? keyboardHeight : 0)
//
//     return viewOffset
//   }
//
//   function keyboardUp (e) {
//     getScroll(1)
//
//     if (!scroll) return
//
//     // refresh cursor {{
//
//     if (device.os.ios && device.os.iosVersion < 12) {
//       scroll.on('scroll scrollend', refreshCursor)
//     }
//
//     // }}
//
//     if (normal) return
//
//     function upend (e) {
//
//       window.keyboard.height = keyboardHeight = top.scrollY || factWindowHeight - top.innerHeight
//
//       // change minScrollY
//
//       scroll.minScrollY = minScrollY + keyboardHeight
//       scroll.options.minScrollY = scroll.minScrollY
//
//       // 光标位置
//
//       rangeOffset = dom.getSelectionRangeOffset()
//
//       // 可见视图的中心
//
//       viewWrapper = factWindowHeight - keyboardHeight - scrollOffsetTop - scrollOffsetBottom
//       viewCenter = keyboardHeight + viewWrapper / 2
//
//       scroll.scrollBy(0, getViewOffset(), 600, null, false)
//
//       // 滚动到不可见区域时 blur
//
//       scroll.on('scroll', visibility)
//
//       window.trigger('keyboardup', {
//         height: keyboardHeight
//       })
//
//       if (reactResize) {
//         scrollTo(null, 0, 300, null, -1)
//       }
//     }
//
//     setTimeout(function () {
//
//       top.one('scrollend', upend)
//
//       // no scroll
//
//       setTimeout(function () {
//         if (keyboardHeight == 0) upend()
//       }, 300)
//
//       // ``` old
//
//       var offset = 0
//
//       if (device.os.mobileSafari && device.os.iosVersion < 12) {
//         offset = 24 * viewportScale
//       }
//
//       // scroll to bottom
//
//       scrollTo(null, viewportHeight - offset, 300, null, 1)
//
//     }, 300)
//   }
//
//   function keyboardDown () {
//     getScroll()
//
//     if (!scroll) return
//
//     // ``` old : refresh cursor {{
//
//     if (device.os.ios && device.os.iosVersion < 11) {
//       scroll.off('scroll scrollend', refreshCursor)
//     }
//
//     // }}
//
//     if (normal) return
//     if (keyboardHeight == 0) return false
//
//     top.scrollTo(0, 0)
//     scroll.wrapper.scrollTop = 0
//
//     // change minScrollY
//
//     scroll.minScrollY = minScrollY
//     scroll.options.minScrollY = minScrollY
//     scroll.off('scroll', visibility)
//     scroll._refresh()
//
//     window.keyboard.height = keyboardHeight = 0
//   }
//
//   function selectionRange (e) {
//     getScroll()
//
//     if (!scroll) return
//
//     // 非箭头按键取消
//
//     if (e.type == 'keyup' && ![8, 13, 37, 38, 39, 40].consistOf(e.keyCode)) return
//
//     // 重置光标位置
//
//     if (reactOffset) {
//       rangeOffset = dom.getSelectionRangeOffset()
//     } else if (reactPosition) {
//       rangeOffset = dom.getSelectionRangePosition()
//     }
//
//     if (reactOrigin && rangeOffset) {
//       rangeOffset.each(function (i, v) {
//         scope.setValueOfHref(reactOrigin + '.' + i, v)
//       })
//     }
//
//     if (normal) return
//
//     // 光标居中
//
//     if (e.type == 'input' && e.timeStamp - timeStamp < 2000) return
//     if (!scroll || !viewCenter) return
//     if (!reactOffset) {
//       rangeOffset = dom.getSelectionRangeOffset()
//     }
//
//     timeStamp = e.timeStamp
//
//     scroll.scrollBy(0, getViewOffset(), 400, null, false)
//   }
//
//   dom.on('click', checkChange)
//   dom.on('focus', keyboardUp)
//   dom.on('blur', keyboardDown)
//   dom.on('focus keyup input paste mouseup', selectionRange)
// }


export default util

export {
  config,
  Zepto,
  isMerchantH5,
  isClientH5,
  dsBridge,
  queryString,
  cookie,
  regExp,
  setMutations,
  Native,
  md5,
  absUrl,
  isNumberOfNaN,
  placeholderPic,
  UUID,
  base64toBlob,
  getScriptLoad
}

// export default  util
