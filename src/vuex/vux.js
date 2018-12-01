/**
 * Created by Aaronzm on 2018/9/27.
 */
import util, { config } from '../libs/util'
import Vue from "vue";

const toDay = new Date()

var NAR_BAR = {
  leftText: '返回',
  rightText: '',
  clickLeft: null,
  clickRight: null,
}
const SHARECONTENT = {
  title: '美美天成 - 商家端',
  link: 'https://app.mmtcapp.com',
  imgUrl: '',
  describe: ''
}

let Vux = {
  namespaced: true,
  state: {
    systemInfo: {
      _f: 0
    },
    demoScrollTop: 0,
    isLoading: false,
    direction: 'forward',
    title: '首页',
    navBarBtn: {
      leftText: '返回',
      rightText: '',
      clickLeft: null,
      clickRight: null
    },
    isWxRegister: false,
    viewBox: null,
    listData: {
      name: ''
    },
    resultsDateFilter: {
      type: 0,
      start_time: toDay,
      end_time: toDay
    }
  },
  mutations: {
    /**
     * 更新设备数据
     * @param state
     * @param payload
     */
    updateSystemInfo (state, payload) {
      state.systemInfo = {
        _f: payload._f
      }
    },
    /**
     * 更新页面位置top
     * @param state
     * @param payload
     */
    updateDemoPosition (state, payload) {
      state.demoScrollTop = payload.top
    },
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    /**
     * 设置标题
     * @param state
     * @param payload
     */
    setNavigationBarTitle (state, payload) {
      state.title = payload.title;
      let isNative = util.Native.isNative();
      if (isNative.status === 1 || !config.navBarHide) {
        document.querySelector('title').innerHTML = payload.title || SHARECONTENT.title
      } else {
        document.querySelector('title').innerHTML = SHARECONTENT.title
      }
    },
    initNavBar (state, payload) {
      state.navBarBtn = util.deepClone(NAR_BAR)
    },
    setNavBar (state, payload) {
      state.navBarBtn = Object.assign({}, NAR_BAR, payload)
    },
    setViewBox (state, payload) {
      state.viewBox = payload
    }
  },
  actions: {
    updateDemoPosition ({commit, state, dispatch, rootState}, top) {
      commit({type: 'updateDemoPosition', top: top})
    },
    logOut ({commit, state, dispatch, rootState}, payload) {

    }
  }
}

export default Vux
