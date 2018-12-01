import config from '../libs/config'
import Fly from 'flyio/dist/npm/fly'
import Vue from 'vue'
// import axios from 'axios'
import util, { cookie, Native, queryString } from '../libs/util'

class https {
  constructor ({state, data = {}, isVerify = false} = {}, Api = {}) {
    this.Api = {...Api, ...https.httpConfig}
    this.setOptions({state, data, isVerify})
  }

  static httpConfig = {}

  static use (config = {}) {
    https.httpConfig = {...config}
  }

  static getFly (option = {}) {
    let fly = new Fly();
    fly.engine = XMLHttpRequest;
    if (option.contentType === 'multipart/form-data') {
      fly.config = {
        baseURL: config.host,  //请求的基地址
        timeout: 30000, //本次请求的超时时间 30S
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true //跨域请求是否发送第三方cookie
      }
    } else {
      fly.config = {
        baseURL: config.host,  //请求的基地址
        timeout: 5000, //本次请求的超时时间 5S
        responseType: 'text',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': option.contentType || 'application/json'
        },
        withCredentials: true //跨域请求是否发送第三方cookie
      }
      fly.config.parseJson = option.contentType ? false : true
    }

    if (config.NODE_ENV === 'production') {
      fly.config.withCredentials = false
    }

    //添加请求拦截器
    fly.interceptors.request.use((config, promise) => {
      //给所有请求添加自定义header
      // config.headers['X-Tag'] = 'flyio'
      //打印出请求体
      // console.log(config.body)
      //终止请求
      //var err=new Error("xxx")
      //err.request=request
      //return Promise.reject(new Error(""))
      //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
      return config
    })
    //添加响应拦截器，响应拦截器会在then/catch处理之前执行
    fly.interceptors.response.use(
      (res) => {
        let code = null
        try {
          if (typeof res.data === 'string') {
            res.data = JSON.parse(res.data)
          }
          res.data.status = +res.data.status
          if (res.data.code) {
            code = +res.data.code
          }
          let data = res.data.info
          if (util.isJsonString(data)) {
            res.data.info = JSON.parse(data)
          } else if (typeof data === 'string') {
            res.data = {
              msg: res.data.info,
              info: null,
              status: res.data.status
            }
            if (code) {
              res.data.code = code
            } else if (/,error:[0-9]+$/ig.test(res.data.msg)) {
              let msgs = res.data.msg.split(',')
              let status = msgs[1].split(':')
              res.data = {
                msg: msgs[0],
                info: msgs[0],
                status: +status[1]
              }
            }
          }
        } catch (err) {
          Vue.$vux.alert.show({
            title: '温馨提示',
            content: `网络连接失败(System unknown error)`
          })
          res.data = {msg: `网络连接失败`, status: 0, info: null}
        }

        let _query = queryString.parse(window.location.search);

        let device = util.getSystemInfo();
        let sessionId = `PHPSESSID=${cookie.get('PHPSESSID')}`;
        if (device.isNative && config.setSessionId) {
          util.Native.setSessionId({sessionId})
        }
        if (res.data.status === 202 && config.isMiniWechat && _query._t === 'miniProgramPoster') {
          let hash = window.location.hash;
          Vue.wechat.miniProgram.postMessage({data: {status: 202, hash}});
          Vue.wechat.miniProgram.navigateBack(1);
        }
        //只将请求结果的data字段返回
        return res.data
      },
      (err) => {
        //发生网络错误后会走到这里
        //return Promise.resolve("ssss")
        Vue.$vux.alert.show({
          title: '温馨提示',
          content: `网络连接失败{${err}`
        })
        return {msg: `网络连接失败{${err}`, status: 0, info: null}
      }
    )
    return fly
  }

  async request ({type, method = 'GET', contentType = 'application/json'}) {
    method = method.toUpperCase();
    let that = this,
      options = {
        headers: {
          'Content-Type': contentType
        }, //自定义的请求头
        method, // 请求方法
        parseJson: contentType === 'application/x-www-form-urlencoded' ? false : true
      }
    let _query = queryString.parse(window.location.search);
    let device = util.getSystemInfo()
    if (device.isNative && !/\/#\/merchant_register\?/ig.test(window.location.href) && config.setSessionId) {
      await util.Native.getSessionId()
    }
    const fly = await https.getFly(options);
    // const PHPSESSID = cookie.get('PHPSESSID');
    // const isLogin = cookie.get('isLogin');
    // // console.log(`PHPSESSID=${PHPSESSID}&isLogin=${isLogin}`, this.isVerify);
    let _fl = false;
    if (!that.params) {
      that.params = {}
      _fl = true
    } else if (!that.params.lon) {
      _fl = true
    }
    if (_fl) {
      await Native.getLocation().finally(res => {
        that.params['_t'] = 'merchantH5'
        try {
          if (res.status === 1) {
            let info = res.info
            that.params.lon = info.lon
            that.params.lat = info.lat
          }
        } catch (err) {
        }
      })
    }

    if (method === 'POST') {
      that.Api[type] = `${that.Api[type]}?_f=${this.params._f}&_t=${this.params._t}`
    }
    if (contentType === 'multipart/form-data') {
      return await fly.post(that.Api[type], this.params.file)
    } else {
      return await fly.request(that.Api[type], that.params, options)
    }
  }

  setOptions ({state, data = {}, isVerify = false, Api = {}}) {
    try {
      if (!data.lon && state.$location) {
        data.lon = state.$location.lon
      }
      if (!data.lat && state.$location) {
        data.lat = state.$location.lat
      }
    } catch (err) {

    }
    for (let k in data) {
      let v = data[k]
      if (v === undefined || v === null) {
        delete data[k]
      } else if (util.trim(v) === '') {
        delete data[k]
      } else if (util.isArray(v) && v.length === 0) {
        delete data[k]
      }
    }
    data._f = 1;
    data._t = config.name;
    this.params = data
    this.isVerify = isVerify
    for (let k in Api) {
      this.Api[k] = Api[k]
    }
  }

  postData (type) {
    let that = this
    return that.request({type, method: 'post'})
  }

  post2 (type) {
    let that = this
    return that.request({type, method: 'post'})
  }

  post (type) {
    let that = this
    return that.request({type, method: 'post', contentType: 'application/x-www-form-urlencoded',})
  }

  formdata (type) {
    let that = this;
    return that.request({type, method: 'post', contentType: 'multipart/form-data'})
  }

  get (type) {
    let that = this
    return that.request({type, method: 'get'})
  }
}

export default https
