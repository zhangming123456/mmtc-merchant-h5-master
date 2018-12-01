/**
 * Created by Aaronzm on 2018/6/23.
 */

import https from '../../https/https'

class RequestParams extends https {
  constructor (state, data = {}, isVerify = false) {
    super({state, data, isVerify}, {...RequestParams.Api_1, ...RequestParams.Api_2})
  }
}

export default RequestParams
