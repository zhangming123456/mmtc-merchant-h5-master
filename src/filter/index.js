// 过滤器
import util from "../libs/util";
import { dateFormat } from "vux";
import image2base64 from '../libs/image2base64';

export default {
  install (Vue) {
    Vue.filter('dateFormat', dateFormat)
    Vue.filter('strSplit_filter', (input, str = ',') => {
      return input.split(str)
    })
    Vue.filter('money_filter', (input, decimals, _unit = '') => {
      let unit = null
      if (!util.isNumberOfNaN(decimals) || _unit) {
        unit = decimals || _unit || ''
      }
      if (util.isNumberOfNaN(decimals)) {
        return `${unit} ${util.number_format(input)}`
      } else {
        return `${unit} ${parseFloat(util.number_format(input))}`
      }
    })
    Vue.filter('link_filter', (input = '', route) => {
      return util.link_filter(input, route)
    })
    Vue.filter('distance_filter', (input = '', flag = false) => {
      if (typeof +input === 'number') {
        if (!flag && input > 500000) {
          return 500 + 'km以上'
        } else if (input > 1000) {
          return parseFloat(util.number_format(input / 1000)) + 'km'
        } else {
          return input + 'm'
        }
      } else {
        return 0 + 'm'
      }
    })
// 计算流程总耗时
    Vue.filter('total_time_filter', (input) => {
      let num = 0
      try {
        for (let v of input) {
          num += +v.time
        }
        return num
      } catch (e) {
        return num
      }
    })
    Vue.filter('discount_filter', (input) => {
      let num = util.number_format(input * 10, 1)
      return parseFloat(num)
    })

    Vue.filter('strHide_filter', (input) => {
      let reg = /^(\d{3})(\d+)(\d{4})$/
      if (typeof input === 'string' || typeof input === 'number') {
        let str = '*', num = (input + '').length - 7
        if (num > 0) {
          for (let i = 0; i < num; i++) {
            str += '*'
          }
        }
        return input.replace(reg, `$1${str}$3`)
      } else {
        return input
      }
    })

    Vue.filter('image_download_filter', async input => {
      if (input) {
        let url = image2base64.getContentTxt(input, {isUrl: true});
        return url
      } else {
        return ''
      }
    })
  }
}
