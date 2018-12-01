'use strict'
import Vue from 'vue'
import util, { queryString, cookie } from '../../libs/util'

import ApiService_json from './ApiService_json'
import ApiService_json2 from './ApiService_json2'

// 技师详情
let ApiService = {
  namespaced: true,
  state: util.deepClone({...ApiService_json.state, ...ApiService_json2.state}),
  mutations: {...ApiService_json.mutations, ...ApiService_json2.mutations},
  actions: {...ApiService_json.actions, ...ApiService_json2.actions}
}
export default ApiService
