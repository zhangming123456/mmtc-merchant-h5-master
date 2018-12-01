/**
 * Created by Aaronzm on 2018/8/24.
 */

import { Line, mixins } from 'vue-chartjs'
const {reactiveProp} = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
}
