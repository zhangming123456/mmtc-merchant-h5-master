import RequestParams from './vue-ajax'
import util, { setMutations } from '../../libs/util'

RequestParams.Api_1 = {
  getTechnician: '/app/technician/technician',
  gatTechnicianDetail: '/app/technician/technicianDetail',
  getSpecialList: '/app/special/special_list',
  getSpecialItem: '/api/special/special_item',
  getShopImg: '/app/Shop_img/img_list',
  getPageData: '/app/Page_data/detail',
  getOtherGroups: '/api/group/getOtherGroups',
  mmgPutFootPlace: '/api/mmg/putFootPlace',
  itemInfoItemDetail: '/app/Item_info/item_detail',
  itemInfoGetItemsOfShop: '/app/Item_info/getItemsOfShop',//店铺 - 更多项目
  itemInfoMoreItem: '/app/Item_info/moreItem',//其他推荐项目
  shopShopDetail: '/app/Shop/shop_detail',//店铺 - 详情
  itemInfoNoteZan: '/app/Item_info/note_zan',//点赞 -- 日记
  shopFollowOn: '/app/Shop/follow_on',//关注 -- 店铺
  shopFollowOff: '/app/Shop/follow_off',//取消关注 -- 店铺
  itemInfoItemCollection: '/app/Item_info/item_collection',//收藏 -- 项目
  albumDetail: '/app/album/detail',//获取专题详情和专题下的分类信息
  albumDetailData: '/app/album/detailData',//获取分类下的产品信息
  itemInfoMoreNoteSocre: '/app/Item_info/more_note_socre',//获取更多日记tabs
  register2SendSMS: '/shopapi/Register2/sendSMS',//发送验证码
  register2register: '/shopapi/Register2/register',//商家入驻注册
  shop2category_parent: '/shopapi/shop2/category_parent/',//获取主营业务一级分类
  shop2setShop: '/shopapi/Shop2/setShop',//获取主营业务一级分类
  shop2editShop: '/shopapi/Shop2/editShop',//编辑商家资料接口
  shop2get_step: '/shopapi/login/get_step',//获取店铺审核状态
  payCheckOrder: '/shopapi/pay/check_order',//检测订单支付状态
  shop2edit_discount_code: '/shopapi/shop2/edit_discount_code',//更新邀请码
  AchievementIndex: '/shopapi/Achievement/index',//更新邀请码
  AchievementRuank: '/shopapi/Achievement/ruank',//品项排行
  itemlistFigure: '/shopapi/itemlist/figure',//产品管理-tab数量
  itemlistSite: '/shopapi/itemlist/site',//产品管理-已有产品list
}

export default {
  state: {
    $location: {lon: '', lat: ''},
    technicianList: [],//全部技师
    technicianDetail: {},
    specialList: [],//专题列表tab
    specialIitem: [],
    otherGroupsInfo: [],
    Shop_img: {},
    pageData: {},
    mmgPutFootPlace: [],//用户浏览商品足迹
    itemInfoItemDetail: {},//商品详情
    itemInfoGetItemsOfShop: [],//店铺 - 更多项目
    itemInfoMoreItem: [],//其他推荐项目
    shopShopDetail: {},//店铺 - 详情
    albumDetail: {},//获取专题详情和专题下的分类信息
    albumDetailData: {},//获取分类下的产品信息
    itemInfoMoreNoteSocre: {},//获取更多日记tabs
    shop2category_parent: [],//获取主营业务一级分类
    AchievementIndex: {},//获取业绩数据
    AchievementRuank: [],//获取业绩数据
    itemlistFigure: {},//产品管理tab数量
    itemlistSite: {},//产品管理已有产品list
  },
  mutations: {
    ['setLocation'] (state, payload) {
      setMutations(state, payload, 'technicianList')
    },
    ['setLocation'] (state, payload) {
      let data = payload.query
      state.$location = {
        lon: data.lon,
        lat: data.lat
      }
    },
    async ['getTechnician'] (state, payload) {
      setMutations(state, payload, 'technicianList')
    },
    async ['gatTechnicianDetail'] (state, payload) {
      setMutations(state, payload, 'technicianDetail')
    },
    async ['getSpecialList'] (state, payload) {
      setMutations(state, payload, 'specialList')
    },
    async ['getSpecialItem'] (state, payload) {
      setMutations(state, payload, 'specialIitem')
    },
    async ['getShopImg'] (state, payload) {
      setMutations(state, payload, 'Shop_img')
    },
    async ['getPageData'] (state, payload) {
      setMutations(state, payload, 'pageData')
    },
    async ['getOtherGroups'] (state, payload) {
      setMutations(state, payload, 'otherGroupsInfo')
    },
    async ['mmgPutFootPlace'] (state, payload) {
      setMutations(state, payload, 'mmgPutFootPlace')
    },
    async ['itemInfoItemDetail'] (state, payload) {
      setMutations(state, payload, 'itemInfoItemDetail')
    },
    async ['itemInfoGetItemsOfShop'] (state, payload) {
      setMutations(state, payload, 'itemInfoGetItemsOfShop')
    },
    async ['shopShopDetail'] (state, payload) {
      setMutations(state, payload, 'shopShopDetail')
    },
    async ['itemInfoMoreItem'] (state, payload) {
      setMutations(state, payload, 'itemInfoMoreItem')
    },
    async ['albumDetail'] (state, payload) {
      setMutations(state, payload, 'albumDetail')
    },
    async ['albumDetailData'] (state, payload) {
      setMutations(state, payload, 'albumDetailData')
    },
    async ['itemInfoMoreNoteSocre'] (state, payload) {
      setMutations(state, payload, 'itemInfoMoreNoteSocre')
    },
    async ['shop2category_parent'] (state, payload) {
      setMutations(state, payload, 'shop2category_parent')
    },
    async ['AchievementIndex'] (state, payload) {
      setMutations(state, payload, 'AchievementIndex')
    },
    async ['AchievementRuank'] (state, payload) {
      setMutations(state, payload, 'AchievementRuank')
    },
    async ['itemlistFigure'] (state, payload) {
      setMutations(state, payload, 'itemlistFigure')
    },
    async ['itemlistSite'] (state, payload) {
      setMutations(state, payload, 'itemlistSite')
    },
    async ['getPackageCardDetail'] (state, payload) {
      setMutations(state, payload, 'getPackageCardDetail')
    },
  },
  actions: {
    async [`wxRedirectUri`] ({commit, state, dispatch}, {redirect_uri, scope}) {
      let type = 'wxRedirectUri', data = {redirect_uri, scope}
      RequestParams.Api_1[type] = `/nodeapi/wx/redirectUrl`
      console.log(RequestParams.Api_1[type])
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              // commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },
    async [`wxRegister`] ({commit, state, dispatch}, {url, code}) {
      let type = 'wxRegister', data = {url, code}
      RequestParams.Api_1[type] = `/nodeapi/wx/register`
      const p = new RequestParams(state, data).post(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },
    //  技师列表
    async ['getTechnician'] ({commit, state, dispatch}, {shop_id = 0}) {
      let type = 'getTechnician', data = {shop_id}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: shop_id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    //  技师详情
    async ['gatTechnicianDetail'] ({commit, state, dispatch}, {id = 0}) {
      let type = 'gatTechnicianDetail', data = {id}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    // 首页列表专题
    async ['getSpecialList'] ({commit, state, dispatch}, {}) {
      let type = 'getSpecialList', data = {}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    // 首页列表专题商品
    async ['getSpecialItem'] ({commit, state, dispatch}, {id = 2, page = 1, limit = 10}) {
      let type = 'getSpecialItem', data = {id, page, limit}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: id, page})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    /**
     * 店铺相册图片
     * @param commit
     * @param state
     * @param dispatch
     * @param shop_id
     * @returns {Promise.<*>}
     */
    async ['getShopImg'] ({commit, state, dispatch}, {shop_id = 0}) {
      let type = 'getShopImg', data = {shop_id}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: shop_id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    /**
     * 用户协议
     * @param commit
     * @param state
     * @param dispatch
     * @param token
     * agreement  注册登录-美美天成用户注册协议与隐私条款
     * join_agreement  美美天成入驻协议
     * user_agreement  相关协议-美美天成用户注册协议与隐私条款
     * @returns {Promise.<*>}
     */
    async ['getPageData'] ({commit, state, dispatch}, {token = 'join_agreement'}) {
      let type = 'getPageData', data = {token}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: token})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    /**
     * 获取其他团购信息
     * @param commit
     * @param state
     * @param dispatch
     * @param item_id
     * @returns {Promise.<*>}
     */
    async ['getOtherGroups'] ({commit, state, dispatch}, {item_id = 0}) {
      let type = 'getOtherGroups', data = {item_id}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: item_id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    /**
     * 用户浏览商品足迹
     * @param commit
     * @param state
     * @param dispatch
     * @param id
     * @returns {Promise.<*>}
     */
    async ['mmgPutFootPlace'] ({commit, state, dispatch}, {id = 0}) {
      let type = 'mmgPutFootPlace', data = {id}
      const p = new RequestParams(state, data).get(type)
      try {
        p.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return p
    },

    /**
     * 商品详情
     * @param commit
     * @param state
     * @param dispatch
     * @param t 分类 {0:全部}
     * @param item_id 项目id
     * @returns {Promise.<*>}
     */
    async ['itemInfoItemDetail'] ({commit, state, dispatch}, {t = 0, item_id = 0}) {
      let type = 'itemInfoItemDetail', data = {t, item_id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: item_id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 店铺 - 更多项目
     * @param commit
     * @param state
     * @param dispatch
     * @param p
     * @param shop_id
     * @returns {Promise.<*>}
     */
    async ['itemInfoGetItemsOfShop'] ({commit, state, dispatch}, {shop_id = 0, p = 1}) {
      let type = 'itemInfoGetItemsOfShop', data = {p, shop_id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: shop_id, page: p})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 店铺 - 详情
     * @param commit
     * @param state
     * @param dispatch
     * @param id
     * @param lon
     * @param lat
     * @returns {Promise.<*>}
     */
    async ['shopShopDetail'] ({commit, state, dispatch}, {shop_id = 0}) {
      let type = 'shopShopDetail', data = {shop_id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: shop_id})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 其他推荐项目
     * @param commit
     * @param state
     * @param dispatch
     * @param t
     * @param p
     * @returns {Promise.<*>}
     */
    async ['itemInfoMoreItem'] ({commit, state, dispatch}, {p = 1, t = 0}) {
      let type = 'itemInfoMoreItem', data = {p, t}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, page: p})
            }
          },
          (rsp) => {

          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 点赞 - 日记
     * @param commit
     * @param state
     * @param dispatch
     * @param note_id 产品ID
     * @param mark 标记 0 取消  1 点赞
     * @returns {Promise.<*>}
     */
    async ['itemInfoNoteZan'] ({commit, state, dispatch}, {note_id = 0, mark = 1}) {
      let type = 'itemInfoNoteZan', data = {note_id, mark}
      const P = new RequestParams(state, data, true).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 关注 -- 店铺
     * @param commit
     * @param state
     * @param dispatch
     * @param note_id 产品ID
     * @param mark 标记 0 取消  1 点赞
     * @returns {Promise.<*>}
     */
    async ['shopFollowOn'] ({commit, state, dispatch}, {shop_id = 0}) {
      let type = 'shopFollowOn', data = {shop_id}
      const P = new RequestParams(state, data, true).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 取消关注 -- 店铺
     * @param commit
     * @param state
     * @param dispatch
     * @param note_id 产品ID
     * @param mark 标记 0 取消  1 点赞
     * @returns {Promise.<*>}
     */
    async ['shopFollowOff'] ({commit, state, dispatch}, {shop_id = 0}) {
      let type = 'shopFollowOff', data = {shop_id}
      const P = new RequestParams(state, data, true).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 收藏 -- 项目
     * @param commit
     * @param state
     * @param dispatch
     * @param item_id 项目ID
     * @param mark 标记 0 取消  1 点赞
     * @returns {Promise.<*>}
     */
    async ['itemInfoItemCollection'] ({commit, state, dispatch}, {item_id = 0, mark = 1}) {
      let type = 'itemInfoItemCollection', data = {item_id, mark}
      const P = new RequestParams(state, data, true).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 专题中心 - list
     * @param commit
     * @param state
     * @param dispatch
     * @param id 专题分类ID
     * @returns {Promise.<*>}
     */
    async ['albumDetail'] ({commit, state, dispatch}, {id = 0}) {
      let type = 'albumDetail', data = {id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: id})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取专题分类下的产品
     * @param commit
     * @param state
     * @param dispatch
     * @param category_id 分类ID
     * @returns {Promise.<*>}
     */
    async ['albumDetailData'] ({commit, state, dispatch}, {category_id = 0, p = 1}) {
      let type = 'albumDetailData', data = {category_id, p}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info, key: category_id, page: p})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取专题分类下的产品
     * @param commit
     * @param state
     * @param dispatch
     * @param category_id 分类ID
     * @returns {Promise.<*>}
     */
    async ['itemInfoMoreNoteSocre'] ({commit, state, dispatch}, {item_id = 0, shop_id = 0}) {
      let type = 'itemInfoMoreNoteSocre', data = {shop_id, item_id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 发送验证码
     * @param commit
     * @param state
     * @param dispatch
     * @param telephone
     * @return {Promise.<*>}
     */
    async ['register2SendSMS'] ({commit, state, dispatch}, {telephone = 0}) {
      let type = 'register2SendSMS', data = {telephone}
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 商家入驻注册
     * @param commit
     * @param state
     * @param dispatch
     * @param telephone 手机号码
     * @param code 验证码
     * @param pwd 密码
     * @return {Promise.<*>}
     */
    async ['register2register'] ({commit, state, dispatch}, {telephone = 0, code = 0, pwd = ''}) {
      let type = 'register2register', data = {telephone, pwd, code}
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 添加新商家接API
     * @param commit
     * @param state
     * @param dispatch
     * @param id
     * @param shop_name
     * @param license_name
     * @param license_code
     * @param license_type
     * @param legal_username
     * @param legal_identity
     * @param front_identity
     * @param end_identity
     * @param discount_code
     * @param license_img
     * @return {Promise.<*>}
     */
    async ['shop2editShop'] ({commit, state, dispatch}, {
      id = '', shop_name = '', license_name = '', license_code = '', license_type = 0, legal_username = '', legal_identity = '', front_identity = '', end_identity = '', discount_code = '', license_img = ''
    }) {
      let type = 'shop2editShop',
        data = {
          id,
          shop_name,
          license_img,
          license_name,
          license_code,
          license_type,
          legal_username,
          legal_identity,
          front_identity,
          end_identity,
          discount_code
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 添加新商家接API
     * @param commit
     * @param state
     * @param dispatch
     * @param id
     * @param shop_name
     * @param pic
     * @param major_business
     * @param city_id
     * @param city_name
     * @param address
     * @param position
     * @param day
     * @param open_starttime
     * @param open_endtime
     * @param lon
     * @param lat
     * @param service_phone
     * @param discount_code
     * @return {Promise.<*>}
     */
    async ['shop2setShop'] ({commit, state, dispatch}, {id = '', shop_name = '', pic = '', major_business = '', city_id = 0, city_name = '', address = '', position = '', day = '', open_starttime = '', open_endtime = '', lon = '', lat = '', service_phone = '', discount_code = ''}) {
      let type = 'shop2setShop',
        data = {
          id,
          lon,
          lat,
          shop_name,
          pic,
          major_business,
          city_id,
          city_name,
          address,
          position,
          day,
          open_starttime,
          open_endtime,
          service_phone,
          discount_code
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取主营业务一级分类
     * @param commit
     * @param state
     * @param dispatch
     * @return {Promise.<*>}
     */
    async ['shop2category_parent'] ({commit, state, dispatch}, {}) {
      let type = 'shop2category_parent', data = {}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取主营业务一级分类
     * @param commit
     * @param state
     * @param dispatch
     * @param id  用户id
     * @return {Promise.<*>}
     */
    async ['shop2get_step'] ({commit, state, dispatch}, {id}) {
      let type = 'shop2get_step', data = {id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 检测订单支付状态
     * @param commit
     * @param state
     * @param dispatch
     * @param id  用户id
     * @return {Promise.<*>}
     */
    async ['payCheckOrder'] ({commit, state, dispatch}, {id}) {
      let type = 'payCheckOrder', data = {id}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 更新邀请码
     * @param commit
     * @param state
     * @param dispatch
     * @param id  用户id
     * @param discount_code  用户id
     * @return {Promise.<*>}
     */
    async ['shop2edit_discount_code'] ({commit, state, dispatch}, {id, discount_code}) {
      let type = 'shop2edit_discount_code', data = {id, discount_code}
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({type: `${type}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 查询业绩
     * @param commit
     * @param state
     * @param dispatch
     * @param type  类别(0:至今六个月 1:按日 2:按月)
     * @param start_time  开始日期（按日统计时才提交）
     * @param end_time  截止日期 (按月统计时为提交的月份)
     * @return {Promise.<*>}
     */
    async ['AchievementIndex'] ({commit, state, dispatch}, {type, start_time, end_time}) {
      let type1 = 'AchievementIndex', data = {type, start_time, end_time}
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              commit({type: `${type1}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 品相排名接口
     * @param commit
     * @param state
     * @param dispatch
     * @param type  类别(1:按日 2:按月)
     * @param status  显示类型(1:服务 2:卡项)
     * @param p  分页
     * @param start_time  开始日期
     * @param end_time  截止日期
     * @return {Promise.<*>}
     */
    async ['AchievementRuank'] ({commit, state, dispatch}, {type = 2, status = 1, start_time, end_time, p = 1}) {
      let type1 = 'AchievementRuank', data = {type, status, start_time, end_time, p}
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              commit({type: `${type1}`, data: res.info, page: p, key: status})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 产品管理tab数量
     * @param commit
     * @param state
     * @param dispatch
     * @return {Promise.<*>}
     */
    async ['itemlistFigure'] ({commit, state, dispatch}, {} = {}) {
      let type1 = 'itemlistFigure', data = {}
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              commit({type: `${type1}`, data: res.info})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 产品管理已有产品list
     * @param commit
     * @param state
     * @param dispatch
     * @param p  分页
     * @param t  类型 （0：已上架 1：已下架 2：待审核）
     * @return {Promise.<*>}
     */
    async ['itemlistSite'] ({commit, state, dispatch}, {p = 1, t = 0} = {}) {
      let type1 = 'itemlistSite', data = {p, t}
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 提交保存产品
     * @param data
     * @param {Number} [id] 产品ID 编辑模式需要
     * @param {String} title 标题
     * @param {String} profile 副标题
     * @param {Number} market_price 市场价格（门市价）
     * @param {Number} price 价格（折扣）
     * @param {Array} category_id 产品分类ID
     * @param {Array} cover 产品封面
     * @param {String} service 服务内容
     * @param {String} service_char 服务特色
     * @param {Array} service_flow 服务流程
     * @param {String} intro 产品详情介绍 (图文详情)
     * @param {Array} label 产品标签 ["a","b"]
     * @param {int} isTheTerm 是否设置使用限制日期 1：使用
     * @param {String} start_date 限制起始日期
     * @param {String} end_date 限制结束日期
     * @param {String} note 期限说明
     * @param {String} start_time 开始时间
     * @param {String} end_time 结束时间
     * @param {Array} item_brand [{title 名称, brand 品牌，cover 图片}] 使用物料（商品）
     * @param {String} taboo_crowd 禁忌人群
     * @param {String} other_instructions 其它说明
     * @param {Number} [group_num] 成团要求数量
     * @param {Number} [group_price] 成团价格
     * @param {Number} is_valid 是否有效
     * @returns {*}
     */
    async ['saveItemInfo'] ({commit, state, dispatch}, data = {}) {
      let type1 = 'saveItemInfo'
      RequestParams.Api_1[type1] = '/shopapi/iteminfo/sav_new'
      const P = new RequestParams(state, data).postData(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 下架
     * @param commit
     * @param state
     * @param dispatch
     * @param data
     * @return {Promise.<*>}
     */
    async ['iteminfoDownOn'] ({commit, state, dispatch}, data = {}) {
      let type1 = `iteminfoDownOn`
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/downOn`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 上架
     * @param commit
     * @param state
     * @param dispatch
     * @param data
     * @return {Promise.<*>}
     */
    async ['iteminfoUpOn'] ({commit, state, dispatch}, data = {}) {
      let type1 = `iteminfoUpOn`
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/upOn`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 撤销申请
     * @param commit
     * @param state
     * @param dispatch
     * @param data
     * @return {Promise.<*>}
     */
    async ['iteminfoRevokeAuth'] ({commit, state, dispatch}, data = {}) {
      let type1 = `iteminfoRevokeAuth`
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/revokeAuth`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 删除
     * @param commit
     * @param state
     * @param dispatch
     * @param data
     * @return {Promise.<*>}
     */
    async ['iteminfoDel'] ({commit, state, dispatch}, data = {}) {
      let type1 = `iteminfoDel`
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/del`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 审核
     * @param commit
     * @param state
     * @param dispatch
     * @param id
     * @return {Promise.<*>}
     */
    async ['iteminfoToExamine'] ({commit, state, dispatch}, {id = 0}) {
      let type1 = `iteminfoToExamine`, data = {id}
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/to_examine`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取产品类别
     * @param commit
     * @param state
     * @param dispatch
     * @return {Promise.<*>}
     */
    async ['iteminfoDataList'] ({commit, state, dispatch}, {} = {}) {
      let type1 = `iteminfoDataList`, data = {}
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/dataList`
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取产品类别
     * @param commit
     * @param state
     * @param dispatch
     * @param nodes
     * @param id
     * @return {Promise.<*>}
     */
    async ['iteminfoSite'] ({commit, state, dispatch}, {nodes = 1, id = 0} = {}) {
      let type1 = `iteminfoSite`, data = {nodes, id}
      RequestParams.Api_1[type1] = `/shopapi/iteminfo/site`
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 获取套卡详情
     * @param commit
     * @param state
     * @param dispatch
     * @param card_id
     * @return {Promise.<*>}
     */
    async ['getPackageCardDetail'] ({commit, state, dispatch}, {card_id = 0} = {}) {
      let type1 = `getPackageCardDetail`, data = {card_id}
      RequestParams.Api_1[type1] = `/shopapi/order_card/shop_card_info`
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              commit({type: `${type1}`, data: res.info, key: card_id})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    /**
     * 套卡上下架
     * @param commit
     * @param state
     * @param dispatch
     * @param card_id
     * @param status
     * @return {Promise.<*>}
     */
    async ['setOrderCardUpDown'] ({commit, state, dispatch}, {card_id = 0, status} = {}) {
      let type1 = `setOrderCardUpDown`, data = {card_id, status}
      RequestParams.Api_1[type1] = `/shopapi/order_card/up_down`
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, key: t})
            }
          },
          (rsp) => {
          }
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    }
  }
}
