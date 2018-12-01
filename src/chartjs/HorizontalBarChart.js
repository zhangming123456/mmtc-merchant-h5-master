/**
 * Created by Aaronzm on 2018/8/24.
 */

/**
 * Created by Aaronzm on 2018/8/24.
 */

import { HorizontalBar, mixins } from 'vue-chartjs'
const {reactiveProp} = mixins

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
}
