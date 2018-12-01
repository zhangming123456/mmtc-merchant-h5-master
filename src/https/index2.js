import HTTPS from "./https";
import util from "../libs/util";

export default class {
  constructor (store) {
    if (store) {
      this.$store = store
    }
    this._isVerify = false
    this._data = {}
    this._type = {}
    this._url = {}
    this._method = 'GET'
    this._callback = () => {
    }
    this.requestObj = {}
    this.options = {}
  }

  install (obj, {method = 'GET'} = {}, callback) {
    method = method.toLocaleLowerCase()
    let type, url, promise
    if (util.isObject(obj) && util.isErrorObject(obj)) {
      type = Object.keys(obj)[0]
      url = obj[type]
    } else if (typeof obj === 'string') {
      type = obj
    }
    if (!type) return
    const $http = this.requestObj[type]
    if ($http[method]) {
      promise = $http[method](type)
    } else {
      promise = $http.get(type)
    }
    return promise.finally(res => {
      if (1 === res.status && util.isEmptyValue(res.info)) {
        console.log(promise.params, type + `_______获取${type}接口数据__________`)
        callback && callback(res.info)
      }
    }).catch(function (err) {
      console.warn(`调用${type}赋值失败:${err}`)
    })
  }

  use ({data = {}, type, url, method = 'GET', isVerify = false}, callback) {
    if (!(this.requestObj[type] instanceof HTTPS)) {
      this.requestObj[type] = new HTTPS()
    }
    this.requestObj[type].setOptions({data, Api: {[type]: url}, isVerify})
    return this.install(type, {method}, function (res) {
      callback && callback(res)
    })
  }

  /**
   * 设置请求参数
   * @param data
   * @param type
   * @param url
   * @param isVerify
   * @param method
   * @param callback
   */
  set requestOptions ({data = {}, type, url, method = 'GET', isVerify = false, callback}) {
    let options = {}
    options._data = {...data}
    options._url = url || ''
    options._isVerify = isVerify
    options._method = method
    options._callback = callback
    if (type) {
      options._type = type
    } else {
      options._type = url.replace(/\//ig, '')
    }
    this._type = options._type
    this.options[options._type] = options
  }

  get request () {
    let options = this.options[this._type]
    return this.use({
      type: options._type,
      url: options._url,
      method: options._method,
      data: options._data,
      isVerify: options._isVerify
    }, options._callback)
  }

  /**
   * 注册获取验证码
   * @param telephone
   * @param id
   * @returns {*}
   */
  register2sendSMS ({telephone, id}) {
    this.requestOptions = {
      url: '/shopapi/Register2/sendSMS2',
      method: 'GET',
      data: {telephone, id},
      callback () {

      }
    }
    return this.request
  }
}
