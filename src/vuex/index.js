/**
 * Created by Aaronzm on 2017/7/2 0002.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import ApiService from './api/ApiService'
import vux from './vux'
import merchant from './merchant'
import product from './product'
import System from './system'
import Wechat from './Wechat'
import tcProduct from './tcProduct'
import clProduct from './clProduct'

import util from '../libs/util'
// import config from '../libs/config'
// import config from 'js-cookie'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

let store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    ApiService,
    Wechat,
    product,
    tcProduct,
    clProduct,
    System,
    vux,
    merchant
  }
})

export default store
