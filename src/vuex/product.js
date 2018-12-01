/**
 * Created by Aaronzm on 2018/8/29.
 */

import util from '../libs/util'
import { dateFormat } from 'vux'

let now = new Date()
let toDay = dateFormat(now, 'YYYY-MM-DD')
now.setFullYear(now.getFullYear() + 1)//设置年数 +1年
now.setDate(now.getDate() - 1)//设置天数 -1 天
let twoDay = dateFormat(now, 'YYYY-MM-DD')

const PRODUCT_DATA = {
  id: '',//产品ID 编辑模式需要
  title: '',//标题
  profile: '',//副标题
  market_price: null,//市场价格（门市价）
  price: null,//价格 （折扣）
  category_ids: [],//产品分类ID
  category: [],//产品分类ID
  cover: [],//产品封面
  service: '',//服务内容
  service_char: '',//服务特色
  service_flow: [],//服务流程
  intro: '',//产品详情介绍 (图文详情)
  label: [],//产品标签 ["a","b"]
  isTheTerm: false,//是否设置使用限制日期 1：使用
  start_date: toDay,//限制起始日期
  end_date: twoDay,//限制结束日期
  note: '',//期限说明
  start_time: '8:00',//开始时间
  end_time: '20:00',//结束时间
  item_brand: [],//[{title 名称, brand 品牌，cover 图片}] 使用物料（商品）
  taboo_crowd: '',//禁忌人群
  other_instructions: '',//其它说明
  group_num: null,//成团要求数量
  group_price: null,//成团价格
  is_valid: false,//是否有效
}

// 产品详情
let Product = {
  namespaced: true,
  state: {
    productData: {},
    appIsFixed: {
      num: 0
    },
    // 上架数据
    shelfData: [],
    // 下架数据
    obtainedData: [],
    // 审核数据
    reviewData: [],
  },
  mutations: {
    resetProductData (state, payload) {
      state.productData = {
        id: '',//产品ID 编辑模式需要
        title: '',//标题
        profile: '',//副标题
        market_price: null,//市场价格（门市价）
        price: null,//价格 （折扣）
        category_ids: [],//产品分类ID
        category: [],//产品分类ID
        cover: [],//产品封面
        service: '',//服务内容
        service_char: '',//服务特色
        service_flow: [],//服务流程
        intro: '',//产品详情介绍 (图文详情)
        label: [],//产品标签 ["a","b"]
        isTheTerm: false,//是否设置使用限制日期 1：使用
        start_date: toDay,//限制起始日期
        end_date: twoDay,//限制结束日期
        note: '',//期限说明
        start_time: '8:00',//开始时间
        end_time: '20:00',//结束时间
        item_brand: [],//[{title 名称, brand 品牌，cover 图片}] 使用物料（商品）
        taboo_crowd: '',//禁忌人群
        other_instructions: '',//其它说明
        group_num: null,//成团要求数量
        group_price: null,//成团价格
        is_valid: false,//是否有效
      }
    },
    coverProductData (state, payload) {
      let data = payload.data
      for (let k in data) {
        if (util.isNumberOfNaN(data[k])) {
          data[k] = Number(data[k])
        }
      }
      state.productData.id = data.id
      state.productData.title = data.title
      state.productData.profile = data.profile
      state.productData.price = data.price
      state.productData.market_price = data.market_price
      state.productData.group_num = data.group_num
      state.productData.group_price = data.group_price
      state.productData.service = data.service
      state.productData.service_char = data.service_char
      state.productData.taboo_crowd = data.taboo_crowd
      state.productData.other_instructions = data.other_instructions
      state.productData.note = data.note
      state.productData.intro = data.intro
      state.productData.is_valid = !!data.is_valid ? true : false
      state.productData.isTheTerm = !!data.istheterm ? true : false

      if (util.isArray(data.category_ids) && data.category_ids.length > 0) {
        state.productData.category_ids = data.category_ids
      } else if (data.category_id) {
        state.productData.category_ids = [{
          title: data.category,
          id: data.category_id
        }]
      }
      if (util.isArray(data.covers) && data.covers.length > 0) {
        state.productData.cover = data.covers
      } else if (data.cover) {
        state.productData.cover = [data.cover]
      }
      if (util.isArray(data.service_flow) && data.service_flow.length > 0) {
        state.productData.service_flow = data.service_flow
      }
      if (util.isArray(data.label) && data.label.length > 0) {
        state.productData.label = data.label
      }
      if (util.isArray(data.item_brand) && data.item_brand.length > 0) {
        state.productData.item_brand = data.item_brand
      }
      state.productData.start_date = data.start_date
      state.productData.end_date = data.end_date
      state.productData.start_time = data.start_time
      state.productData.end_time = data.end_time
    },
    updateShelfData (state, payload) {
      let p = payload.p
      let data = payload.data
      let len = state.shelfData.length
      if (+p <= 1) {
        state.shelfData.splice(0, len, data);
      } else {
        state.shelfData.splice(p, 1, data)
      }
    },
    updateObtainedData (state, payload) {
      let p = payload.p
      let data = payload.data
      let len = state.obtainedData.length
      if (+p <= 1) {
        state.obtainedData.splice(0, len, data);
      } else {
        state.obtainedData.splice(p, 1, data)
      }
    },
    updateReviewData (state, payload) {
      let p = payload.p
      let data = payload.data
      let len = state.reviewData.length
      if (+p <= 1) {
        state.reviewData.splice(0, len, data);
      } else {
        state.reviewData.splice(p, 1, data)
      }
    },
  },
  actions: {}
}
export default Product
