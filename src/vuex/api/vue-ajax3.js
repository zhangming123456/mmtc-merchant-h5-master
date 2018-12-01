/**
 * Created by Aaronzm on 2018/6/23.
 */
import config from '../../libs/config'
import axios from 'axios'
import util from '../../libs/util'

class RequestParams {
  constructor (state, data = {}) {
    this.params = data
    state.$location = {
      lon: data.lon,
      lat: data.lat
    }
    this.Api = {...RequestParams.Api_1, ...RequestParams.Api_2}
  }

  request () {

  }

  post (type) {
    let that = this
    console.log(that.params)
    const p = new Promise((resolve, reject) => {
      let url = config.host + that.Api[type]
      axios.post(url, util.queryString.stringify(that.params)).then(
        (rsp) => {
          rsp.data.status = +rsp.data.status
          let data = rsp.data.info
          if (util.isJsonString(data)) {
            rsp.data.info = JSON.parse(data)
          }
          resolve(rsp.data)
        },
        (rsp) => {
          reject(rsp)
        }
      )
    })
    return p
  }

  get (type) {
    let that = this
    console.log(that.params)
    const p = new Promise((resolve, reject) => {
      console.log(config.host + that.Api[type])
      let url = config.host + that.Api[type] + '?' + util.queryString.stringify(that.params)
      axios.get(url).then(
        (rsp) => {
          rsp.data.status = +rsp.data.status
          let data = rsp.data.info
          if (util.isJsonString(data)) {
            rsp.data.info = JSON.parse(data)
          }
          resolve(rsp.data)
        },
        (rsp) => {
          reject(rsp)
        }
      )
    })
    return p
  }
}

export default RequestParams
