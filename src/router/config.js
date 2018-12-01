/**
 * Created by Aaronzm on 2018/8/24.
 */
module.exports = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('../page/Home.vue').then(m => m.default),
    meta: {},
    props: (route) => ({query: route.query})
  },
  {
    path: '/login_index',
    name: 'login_index',
    component: () => import('../page/login/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '新商户登录'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/results_index',
    name: 'results_index',
    component: () => import('../page/results/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '业绩'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/results_ranking/:type',
    name: 'results_ranking',
    component: () => import('../page/results/ranking.vue').then(m => m.default),
    meta: {'keepAlive': false, transition: true, 'title': '品项排名'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_index',
    name: 'product_index',
    component: () => import('../page/product/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '产品管理'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_editAndModify',
    name: 'product_editAndModify',
    component: () => import('../page/product/editAndModify.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '产品管理'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_category',
    name: 'product_category',
    component: () => import('../page/product/category.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '产品类别'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_covers',
    name: 'product_covers',
    component: () => import('../page/product/covers.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '产品图片'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_process',
    name: 'product_process',
    component: () => import('../page/product/process.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '服务流程'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_minutiae',
    name: 'product_minutiae',
    component: () => import('../page/product/minutiae.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '产品管理'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product-activity',
    name: 'product-activity',
    component: () => import('../page/product/activity.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '参加活动'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_graphic',
    name: 'product_graphic',
    component: () => import('../page/product/graphic.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '图文详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_deadline',
    name: 'product_deadline',
    component: () => import('../page/product/deadline.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '使用期限'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/product_itemBrand',
    name: 'product_itemBrand',
    component: () => import('../page/product/itemBrand.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '使用商品'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_oldreview',
    name: 'merchant_oldReview',
    component: () => import('../page/merchant/oldReview.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '认证审核'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_selectshop',
    name: 'merchant_selectShop',
    component: () => import('../page/merchant/selectShop.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '丽人商家认证'},
    props: (route) => ({query: route.query})
  },
  // {
  //   path: '/merchant_register',
  //   name: 'merchant_register',
  //   component: () => import('../page/merchant/register.vue').then(m => m.default),
  //   meta: {'keepAlive': false, 'title': '注册商家'},
  //   props: (route) => ({query: route.query})
  // },
  {path: '/merchant_register', redirect: '/merchant_addshop'},
  // 审核步骤一
  {
    path: '/merchant_addshop',
    name: 'merchant_addshop',
    component: () => import('../page/merchant/addShop.vue').then(m => m.default),
    meta: {keepAlive: true, 'title': '添加商户'},
    props: (route) => ({query: route.query})
  },
  // 审核步骤二
  {
    path: '/merchant_attestinfo',
    name: 'merchant_attestinfo',
    component: () => import('../page/merchant/attestinfo.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '丽人商家认证'},
    props: (route) => ({query: route.query})
  },
  // 审核步骤三
  {
    path: '/merchant_schedule',
    name: 'merchant_schedule',
    component: () => import('../page/merchant/schedule.vue').then(m => m.default),
    meta: {'keepAlive': false, 'backRefresh': true, 'title': '我要入驻'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_classify',
    name: 'merchant_classify',
    component: () => import('../page/merchant/classify.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '主营业务'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_idcardinfo',
    name: 'merchant_idcardinfo',
    component: () => import('../page/merchant/idcardinfo.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '身份证认证'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_servicetime',
    name: 'merchant_servicetime',
    component: () => import('../page/merchant/servicetime.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '营运时间'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_sfzsample',
    name: 'merchant_sfzsample',
    component: () => import('../page/merchant/sfzsample.vue').then(m => m.default),
    meta: {'title': '身份证样例'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_yyzzsample',
    name: 'merchant_yyzzsample',
    component: () => import('../page/merchant/yyzzsample.vue').then(m => m.default),
    meta: {'title': '营业执照证样例', keepAlive: true},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_mtzsample',
    name: 'merchant_mtzsample',
    component: () => import('../page/merchant/mtzsample.vue').then(m => m.default),
    meta: {'title': '门头照样例', keepAlive: true},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_protocol',
    name: 'merchant_protocol',
    component: () => import('../page/merchant/protocol.vue').then(m => m.default),
    meta: {'title': '用户入驻协议', keepAlive: true},
    props: (route) => ({query: route.query})
  },
  {
    path: '/merchant_selectcity',
    name: 'merchant_selectCity',
    component: () => import('../page/merchant/selectCity.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '选择城市'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_index',
    name: 'technician_index',
    component: () => import('../page/technician/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '技师管理'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_tcDetails',
    name: 'technician_tcDetails',
    component: () => import('../page/technician/tcDetails.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '技师详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_tcVocation',
    name: 'technician_tcVocation',
    component: () => import('../page/technician/tcVocation.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '所属行业'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_tcAddlabel',
    name: 'technician_tcAddlabel',
    component: () => import('../page/technician/tcAddlabel.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '添加标签'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_tcSpecialty',
    name: 'technician_tcSpecialty',
    component: () => import('../page/technician/tcSpecialty.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '技师职称'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/technician_demo',
    name: 'technician_demo',
    component: () => import('../page/technician/demo.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': 'demo'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_index',
    name: 'client_index',
    component: () => import('../page/client/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '客户'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_consumeRanked',
    name: 'client_consumeRanked',
    component: () => import('../page/client/consumeRanked.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '消费排名'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_getClient',
    name: 'client_getClient',
    component: () => import('../page/client/getClient.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '快速导客'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_details',
    name: 'client_details',
    component: () => import('../page/client/details.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '客户详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_orderRecord',
    name: 'client_orderRecord',
    component: () => import('../page/client/orderRecord.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '订单记录'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_orderDetails',
    name: 'client_orderDetails',
    component: () => import('../page/client/orderDetails.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '订单详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_expendDetails',
    name: 'client_expendDetails',
    component: () => import('../page/client/expendDetails.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '消耗详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_addClient',
    name: 'client_addClient',
    component: () => import('../page/client/addClient.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '添加新客户'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_clientLabel',
    name: 'client_clientLabel',
    component: () => import('../page/client/clientLabel.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '客户标签'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_payConstitute',
    name: 'client_payConstitute',
    component: () => import('../page/client/payConstitute.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '消费构成'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/client_expendRecord',
    name: 'client_expendRecord',
    component: () => import('../page/client/expendRecord.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '消耗记录'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/package_card_detail',
    name: 'package_card_detail',
    component: () => import('../page/package-card/detail.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '套卡详情'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/package_card_order_detail',
    name: 'package_card_order_detail',
    component: () => import('../page/package-card/orderDetails.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '套卡订单'},
    props: (route) => ({query: route.query})
  },
  {
    path: '/poster_index',
    name: 'poster_index',
    component: () => import('../page/poster/index.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '设计页', backgroundColor: '#424242'},
    props: (route) => ({query: route.query})
  },
  // {
  //   path: '/poster_canvas',
  //   name: 'poster_canvas',
  //   component: () => import('../page/poster/canvas.vue').then(m => m.default),
  //   meta: {'keepAlive': false, 'title': '设计页', backgroundColor: '#424242'},
  //   props: (route) => ({query: route.query})
  // },
  {
    path: '/poster_svg',
    name: 'poster_svg',
    component: () => import('../page/poster/svg.vue').then(m => m.default),
    meta: {'keepAlive': false, 'title': '设计页', backgroundColor: '#424242', navBarHide: false},
    props: (route) => ({query: route.query})
  },
  {
    path: '/debug',
    name: 'debug',
    component: () => import('../page/common/debug.vue').then(m => m.default),
    meta: {'keepAlive': true, 'title': '调试工具'},
    props: (route) => ({query: route.query})
  },
  {
    path: '*',
    component: () => import('../view-render/40x.vue').then(m => m.default)
  }
]
