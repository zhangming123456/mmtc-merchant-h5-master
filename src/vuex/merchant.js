/**
 * Created by Aaronzm on 2018/9/27.
 */

export default {
  namespaced: true,
  state: {
    shoploginData: {
      id: '',
      step: 0,
      isPay_azm: 0,
      is_examine: 0
    },
    merchantData: {
      shop_name: '', //店铺名称
      license_img: '', //营业执照附件
      license_name: '', //营业执照名称
      license_code: '', //营业执照注册号
      license_type: ['0'], //营业执照类型(0：企业法人 1：个体工商户)
      legal_username: '', //法人姓名
      legal_identity: '', //法人身份证号码
      front_identity: '', //法人身份证正面
      end_identity: '', //法人身份证反面
    },
    newShopData: {
      pic: '', //店铺封面照片
      major_business: [], //主营业务(传参方式为 1,2,3,)
      lon: '', //经度
      lat: '', //纬度
      city_id: 1, //所在城市ID(1:深圳 2:南昌)
      city_name: '', //所在城市ID(1:深圳 2:南昌)
      address: '', //地址定位(地图定位)
      position: '', //详细地址(手动填写)
      day: [0, 1, 2, 3, 4, 5, 6], //工作日
      open_starttime: '08:00', //营业开始时间
      open_endtime: '20:00', //营业结束时间
      service_phone: '', //服务电话
      bindedphone: '', //绑定手机
      discount_code: '', //优惠码（非必填）
    },
  },
  mutations: {
    /**
     * 更新商家端审核数据
     * @param state
     * @param payload
     */
    updateMerchantData (state, payload) {
      let data = payload.data
      state.shoploginData.id = data.id;
      state.shoploginData.step = +data.step;
      state.shoploginData.auth_status = +data.auth_status
      state.shoploginData.is_examine = +data.is_examine
      state.newShopData.pic = data.pic
      if (data.major_business && data.major_business.length > 0) {
        state.newShopData.major_business = data.major_business
      }
      state.newShopData.shop_name = data.nickname
      state.newShopData.lon = data.lon
      state.newShopData.lat = data.lat
      state.newShopData.city_id = data.city_id
      state.newShopData.address = data.address
      state.newShopData.position = data.position
      if (data.day && typeof data.day === 'string') {
        try {
          state.newShopData.day = data.day.split(',')
        } catch (err) {

        }
      }
      state.newShopData.open_starttime = data.open_starttime
      state.newShopData.open_endtime = data.open_endtime
      state.newShopData.service_phone = data.service_phone
      state.merchantData.license_img = data.license_img
      state.merchantData.license_name = data.license_name
      state.merchantData.license_code = data.license_code
      state.merchantData.license_type = [data.license_type]
      state.merchantData.legal_username = data.legal_username
      state.merchantData.legal_identity = data.legal_identity
      state.merchantData.front_identity = data.front_identity
      state.merchantData.end_identity = data.end_identity
      state.merchantData.discount_code = data.discount_code
      state.merchantData.bindedphone = data.bindedphone
    },
    clearMerchantData (state, payload) {
      state.shoploginData = {
        id: '',
        step: 0,
        isPay_azm: 0,
        is_examine: 0
      }
      state.merchantData = {
        shop_name: '', //店铺名称
        license_img: '', //营业执照附件
        license_name: '', //营业执照名称
        license_code: '', //营业执照注册号
        license_type: ['0'], //营业执照类型(0：企业法人 1：个体工商户)
        legal_username: '', //法人姓名
        legal_identity: '', //法人身份证号码
        front_identity: '', //法人身份证正面
        end_identity: '', //法人身份证反面
      }
      state.newShopData = {
        pic: '', //店铺封面照片
        major_business: [], //主营业务(传参方式为 1,2,3,)
        lon: '', //经度
        lat: '', //纬度
        city_id: 1, //所在城市ID(1:深圳 2:南昌)
        city_name: '', //所在城市ID(1:深圳 2:南昌)
        address: '', //地址定位(地图定位)
        position: '', //详细地址(手动填写)
        day: [0, 1, 2, 3, 4, 5, 6], //工作日
        open_starttime: '08:00', //营业开始时间
        open_endtime: '20:00', //营业结束时间
        service_phone: '', //服务电话
        discount_code: '', //优惠码（非必填）
      }
    }
  },
  actions: {}
}
