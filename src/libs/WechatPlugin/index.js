/**
 * Created by Aaronzm on 2018/8/24.
 */
// const wx = require('./1.4.0')
import { wx } from './jweixin-1.4.0.js'
const plugin = {
  install (Vue) {
    Vue.prototype.$wechat = wx
    Vue.wechat = wx
  },
  $wechat: wx
}

export default plugin
export const install = plugin.install
