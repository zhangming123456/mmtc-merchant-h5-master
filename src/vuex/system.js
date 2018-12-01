/**
 * Created by Aaronzm on 2018/9/20.
 */

// system
export default {
  namespaced: true,
  state: {
    NarBar: v => {
    },
  },
  mutations: {
    ['setNarBarFun'] (state, payload) {
      state.NarBar = payload.callback
    },
    ['NarBarCallback'] (state, payload) {
      state.NarBar && state.NarBar(payload)
    },
  },
  actions: {}
}

