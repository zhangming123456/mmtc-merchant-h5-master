/**
 * Created by Aaronzm on 2018/8/24.
 */

/**
 * Created by Aaronzm on 2018/8/24.
 */

import { Bar, mixins } from 'vue-chartjs'
const {reactiveProp} = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
}
