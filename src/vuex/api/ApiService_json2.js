import RequestParams from './vue-ajax'
import util, {
  setMutations
} from '../../libs/util'

RequestParams.Api_2 = {
  getSpecialItemList: '/app/special/special_item_list',
  getMoreNote: '/app/Item_info/more_note',
  getTechnicianList: '/shopapi/technician/technician/major',
  getTechnicianDel: '/shopapi/technician/tec_del',
  getTechnicianInfo: '/shopapi/technician/tec_info',
  getTechnicianMajor: '/shopapi/technician/major',
  getTechnicianCategory: '/shopapi/technician/category',
  getTechnicianSave: '/shopapi/technician/save',
  getCustomerlists: '/shopapi/Customer/lists',
  getCustomerGetRanking: '/shopapi/Customer/getRanking',
  getCustomerInfo: '/shopapi/Customer/getCustomer',
  getcustomerData: '/shopapi/Customer/customerData',
  getSearch: '/shopapi/Customer/getSearch',
  getOrder: '/shopapi/Customer/getOrder',
  getConsume: '/shopapi/Customer/getConsume',
  getOrderDetail: '/shopapi/Customer/getUsedInfo',
  getListCustomer: '/shopapi/Customer/getListCustomer',
  getSetListCustomer: '/shopapi/Customer/setListCustomer',
  getTag: '/shopapi/Customer/getTag',
  grtSetCustomer: '/shopapi/Customer/setCustomer',
  getsetTag: '/shopapi/Customer/setTag',
  getHistory: '/shopapi/Customer/getHistory',
  getOrderInfo: '/shopapi/Customer/getOrderInfo'
}

export default {
  state: {
    special_item_list: [],
    more_note: {},
    getCity: [],
    get_technician_ist: [],
    get_technician_info: {},
    get_technician_major: {},
    get_technician_category: [],
    get_technician_save: {},
    get_Customer_lists: [],
    get_CustomerGet_Ranking: [],
    get_Customer: {},
    get_customer_Data: [],
    get_Search: [],
    get_Order: [],
    get_Consume: [],
    get_Order_Detail: {},
    get_List_Customer: [],
    getTag: [],
    get_History: [],
    get_Order_Info: {}
  },
  mutations: {
    async ['getSpecialItemList'](state, payload) {
      setMutations(state, payload, 'special_item_list')
    },
    async ['getMoreNote'](state, payload) {
      setMutations(state, payload, 'more_note')
    },
    async ['getTechnicianList'](state, payload) {
      setMutations(state, payload, ' get_technician_ist')
    },
    async ['getTechnicianDel'](state, payload) {
      setMutations(state, payload, '')
    },
    async ['getTechnicianInfo'](state, payload) {
      setMutations(state, payload, 'get_technician_info')
    },
    async ['getTechnicianMajor'](state, payload) {
      setMutations(state, payload, 'get_technician_major')
    },
    async ['getTechnicianCategory'](state, payload) {
      setMutations(state, payload, 'get_technician_category')
    },
    async ['getTechnicianSave'](state, payload) {
      setMutations(state, payload, 'get_technician_save')
    },
    async ['getCustomerlists'](state, payload) {
      setMutations(state, payload, 'get_Customer_lists')
    },
    async ['getCustomerGetRanking'](state, payload) {
      setMutations(state, payload, 'get_CustomerGet_Ranking')
    },
    async ['getCustomerInfo'](state, payload) {
      setMutations(state, payload, 'get_Customer')
    },
    async ['getcustomerData'](state, payload) {
      setMutations(state, payload, 'get_customer_Data')
    },
    async ['getSearch'](state, payload) {
      setMutations(state, payload, 'get_Search')
    },
    async ['getOrder'](state, payload) {
      setMutations(state, payload, 'get_Order')
    },
    async ['getConsume'](state, payload) {
      setMutations(state, payload, 'get_Consume')
    },
    async ['getOrderDetail'](state, payload) {
      setMutations(state, payload, 'get_Order_Detail')
    },
    async ['getListCustomer'](state, payload) {
      setMutations(state, payload, 'get_List_Customer')
    },
    async ['getTag'](state, payload) {
      setMutations(state, payload, 'get_Tag')
    },
    async ['getHistory'](state, payload) {
      setMutations(state, payload, 'get_History')
    },
    async ['getOrderInfo'](state, payload) {
      setMutations(state, payload, 'get_Order_Info')
    }
  },
  actions: {
    //  专题商品列表
    async ['getSpecialItemList']({
      commit,
      state,
      dispatch
    }, {
      id = 0,
      p = 1,
      limit = 10
    }) {
      let type = 'getSpecialItemList',
        data = {
          id,
          p,
          limit
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info,
                key: id,
                page: p
              })
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

    // 更多点评
    async ['getMoreNote']({
      commit,
      state,
      dispatch
    }, {
      item_id = 0,
      shop_id = 0,
      kw
    }) {
      let type = 'getMoreNote',
        data = {
          item_id,
          shop_id,
          kw
        }
      const P = new RequestParams(state, data).get(type)
      try {

        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info,
                key: kw
              })
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
    //  我要合作获取验证码接口
    async ['Register2SendSMS']({
      commit,
      state,
      dispatch
    }, {
      telephone = ''
    }) {
      let type = 'Register2SendSMS',
        data = {
          telephone
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 技师管理技师列表
    async ['getTechnicianList']({
      commit,
      state,
      dispatch
    }, {} = {}) {
      let type = 'getTechnicianList',
        data = {

        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 删除技师
    async ['getTechnicianDel']({
      commit,
      state,
      dispatch
    }, {
      id = '',
      shop_id = ''
    }) {
      let type = 'getTechnicianDel',
        data = {
          id,
          shop_id
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 技师详情
    async ['getTechnicianInfo']({
      commit,
      state,
      dispatch
    }, {
      id = ''

    }) {
      let type = 'getTechnicianInfo',
        data = {
          id
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 技师所属行业
    async ['getTechnicianMajor']({
      commit,
      state,
      dispatch
    }, {


    }) {
      let type = 'getTechnicianMajor',
        data = {

        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 技师职称
    async ['getTechnicianCategory']({
      commit,
      state,
      dispatch
    }, {

    }) {
      let type = 'getTechnicianCategory',
        data = {

        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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


    // 添加技师
    async ['getTechnicianSave']({
      commit,
      state,
      dispatch
    }, {
      username = '',
      type_name = '',
      technician_category = '',
      working_year = '',
      intro = '',
      tags = [],
      sex = '',
      id = '',
      avatar
    }) {
      let type = 'getTechnicianSave',
        data = {
          username,
          type_name,
          technician_category,
          working_year,
          intro,
          tags,
          sex,
          avatar,
          id
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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


    // 客户列表接口
    async ['getCustomerlists']({
      commit,
      state,
      dispatch
    }, {
      page = 0,
      keyword = '',
      birthday = '',
      tag = ''
    }) {
      let type = 'getCustomerlists',
        data = {
          page,
          keyword,
          birthday,
          tag
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 客户消费排名接口
    async ['getCustomerGetRanking']({
      commit,
      state,
      dispatch
    }, {
      page = 0,
      type_name = '',
      date_start = '',
      date_end = '',
      total_start = '',
      total_end = '',
      keyword = ""
    }) {
      let type = 'getCustomerGetRanking',
        data = {
          page,
          type_name,
          date_start,
          date_end,
          total_start,
          total_end,
          keyword
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 查看客户信息接口
    async ['getCustomerInfo']({
      commit,
      state,
      dispatch
    }, {

      id = ''
    }) {
      let type = 'getCustomerInfo',
        data = {
          id
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 获取客户数据接口
    async ['getcustomerData']({
      commit,
      state,
      dispatch
    }, {

      member_id = ''
    }) {
      let type = 'getcustomerData',
        data = {
          member_id
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 获取筛选条件接口
    async ['getSearch']({
      commit,
      state,
      dispatch
    }, {

    }) {
      let type = 'getSearch',
        data = {

        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 最近订单更多接口
    async ['getOrder']({
      commit,
      state,
      dispatch
    }, {
      member_id = '',
      page = 0
    }) {
      let type = 'getOrder',
        data = {
          member_id,
          page
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 最近消耗更多接口
    async ['getConsume']({
      commit,
      state,
      dispatch
    }, {
      member_id = '',
      page = 0
    }) {
      let type = 'getConsume',
        data = {
          member_id,
          page
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 最近消耗详情接口
    async ['getOrderDetail']({
      commit,
      state,
      dispatch
    }, {
      info_id = ''
    }) {
      let type = 'getOrderDetail',
        data = {
          info_id
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 快速导入客户列表接口
    async ['getListCustomer']({
      commit,
      state,
      dispatch
    }, {
      page = 0
    }) {
      let type = 'getListCustomer',
        data = {
          page
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 快速导入客户(可多条)接口
    async ['getSetListCustomer']({
      commit,
      state,
      dispatch
    }, {
      member_id = []
    }) {
      let type = 'getSetListCustomer',
        data = {
          member_id
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 获取标签接口
    async ['getTag']({
      commit,
      state,
      dispatch
    }, {

    }) {
      let type = 'getTag',
        data = {

        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 添加新客户接口
    async ['grtSetCustomer']({
      commit,
      state,
      dispatch
    }, {
      username = '',
      birthday = '',
      company = '',
      position = '',
      special = '',
      telephone = '',
      tag = '',
      sex = '',
      id = '',
      address = ''
    }) {
      let type = 'grtSetCustomer',
        data = {
          username,
          birthday,
          company,
          position,
          special,
          telephone,
          tag,
          sex,
          id,
          address
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
    // 添加标签接口
    async ['getsetTag']({
      commit,
      state,
      dispatch
    }, {
      tag = ''

    }) {
      let type = 'getsetTag',
        data = {
          tag
        }
      const P = new RequestParams(state, data).post(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    // 删除标签
    async ['getDelTag']({
      commit,
      state,
      dispatch
    }, {
      id = 0
    } = {}) {
      let type1 = `getDelTag`,
        data = {
          id
        }
      RequestParams.Api_2[type1] = `/shopapi/Customer/delTag`
      const P = new RequestParams(state, data).get(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {}
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    // 编辑标签
    async ['setEditTag']({
      commit,
      state,
      dispatch
    }, {
      id = 0,
      tag = ""
    } = {}) {
      let type1 = `setEditTag`,
        data = {
          id,
          tag
        }
      RequestParams.Api_2[type1] = `/shopapi/Customer/editTag`
      const P = new RequestParams(state, data).post(type1)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type1 + `_______获取${type1}接口数据__________`)
              // commit({type: `${type1}`, data: res.info, page: p, key: t})
            }
          },
          (rsp) => {}
        )
      } catch (e) {
        console.warn(`调用${type}赋值失败`)
      }
      return P
    },

    //历史消费构成更多接口
    async ['getHistory']({
      commit,
      state,
      dispatch
    }, {
      member_id = ''
    }) {
      let type = 'getHistory',
        data = {
          member_id
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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

    //订单详情
    async ['getOrderInfo']({
      commit,
      state,
      dispatch
    }, {
      id = ''
    }) {
      let type = 'getOrderInfo',
        data = {
          id
        }
      const P = new RequestParams(state, data).get(type)
      try {
        P.then(
          (res) => {
            if (1 === res.status && util.isEmptyValue(res.info)) {
              console.log(data, type + `_______获取${type}接口数据__________`)
              commit({
                type: `${type}`,
                data: res.info
              })
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
