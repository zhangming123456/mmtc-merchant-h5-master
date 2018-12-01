/**
 * Created by Aaronzm on 2018/9/27.
 */
/**
 * Created by Aaronzm on 2018/8/24.
 */
import HTTP from './index2'

class $http extends HTTP {
  constructor (store) {
    super(store)
  }

  /**
   * 获取套卡分享图片
   * @param card_id
   * @return {*}
   */
  getShopCardShareImg ({card_id = 0}) {
    this.requestOptions = {
      url: '/shopapi/shop/get_share',
      method: 'GET',
      data: {card_id},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取订单套卡详情
   * @param bill_id
   * @return {*}
   */
  getOrderCardInfo ({bill_id = 0}) {
    this.requestOptions = {
      url: '/shopapi/order_card/card_info',
      method: 'GET',
      data: {bill_id},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取微信jssdk签名
   * @param url
   * @returns {*}
   */
  getWxSignature (url) {
    this.requestOptions = {
      url: '/nodeapi/wx/getSignature',
      method: 'GET',
      data: {url},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取微信用户信息
   * @param code
   */
  getWxUserInfo (code) {
    this.requestOptions = {
      url: '/nodeapi/wx/oauth-userInfo',
      method: 'GET',
      data: {code},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取海报配置信息
   * @param id
   */
  getPosterConfig ({id = 0}) {
    this.requestOptions = {
      url: '/shopapi/poster/set',
      method: 'GET',
      data: {id},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取模板list
   * @param id
   */
  getPosterModel ({id = 0, page = 1}) {
    this.requestOptions = {
      url: '/shopapi/poster/model',
      method: 'GET',
      data: {id, page},
      callback () {

      }
    }
    return this.request
  }

  /**
   * 获取店铺审核状态
   * @param id
   */
  getShopVerifyStatus ({id = 0}) {
    let that = this;
    this.requestOptions = {
      url: '/shopapi/login/get_step',
      method: 'GET',
      data: {id},
      callback (data) {
        that.$store.commit('merchant/updateMerchantData', {data})
      }
    };
    return this.request
  }

  /**
   * 商家端登入
   * @param username
   * @param password
   */
  login ({username = 0, password = 0}) {
    let that = this;
    this.requestOptions = {
      url: '/shopapi/login/login',
      method: 'POST',
      data: {username, password},
      callback (data) {

      }
    };
    return this.request
  }

  /**
   * 商家端 获取产品列表
   * @param username
   * @param password
   */
  getProductList ({p = 0, t = 0}) {
    let that = this;
    this.requestOptions = {
      url: '/shopapi/itemlist/site',
      method: 'GET',
      data: {p, t},
      callback (data) {
        if (+t === 2) {
          that.$store.commit('product/updateReviewData', {p, data})
        } else if (+t === 1) {
          that.$store.commit('product/updateObtainedData', {p, data})
        } else {
          that.$store.commit('product/updateShelfData', {p, data})
        }

      }
    };
    return this.request
  }

  /**
   * 单图上传图片
   * @param card_id
   * @return {*}
   */
  uploadImg ({file}) {
    this.requestOptions = {
      url: '/services/uploader/uploadImgObj',
      method: 'FormData',
      data: {file},
      callback () {
      }
    }
    return this.request
  }

  /**
   * 上传注册信息
   * @param set
   * @param edit
   * @param telephone
   * @param code
   * @param id
   * @returns {*}
   */
  setRegisterNewAdmission ({set = {}, edit = {}, telephone, code, id}) {
    let that = this;
    this.requestOptions = {
      url: '/shopapi/Register2/newAdmission',
      method: 'post2',
      data: {set, edit, telephone, code, id},
      callback () {

      }
    }
    return this.request
  }

  getFontsPath ({txt = '', fontSize = 12, fontFamily = 'PingFangSCBold'}) {
    let that = this;
    this.requestOptions = {
      url: '/nodeapi/fonts/getFontsPath',
      method: 'GET',
      data: {txt, fontSize, fontFamily},
      callback () {

      }
    }
    return this.request
  }
}

const plugin = {
  install (Vue, store, config = {}) {
    let http = new $http(store)
    if (!Vue.$https) {
      Vue.$https = http
    } else {
      Vue.$ajax = http
    }

    Vue.mixin({
      created: function () {
        let store = this.$store
        let http = new $http(store)
        if (this.$https) {
          this.$https = http
        } else {
          this.$ajax = http
        }
      }
    })
  }
}

export default plugin
export const install = plugin.install
