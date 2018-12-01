/**
 * Created by Aaronzm on 2018/8/29.
 */

// 产品详情
export default {
  namespaced: true,
  state: {
    clProductData: {
      username: '', // 用户名
      telephone: '', //手机号
      sex: ["0"], //性别(0:女 1:男)
      birthday: '', //客户生日
      tag: {}, //客户标签
      company: '', //客户工作所在公司
      position: '', //客户工作职位
      address: '', //客户地址
      special: '' //客户特殊需求
    }
  },
  mutations: {},
  actions: {}
}
