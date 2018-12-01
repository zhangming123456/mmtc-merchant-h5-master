<template>
  <div class="azm-results-index">
    <azm-results-date-filter v-model="resultsDateFilter" :label="label" format="YYYY-MM-DD"
                             @onChange="resultsDateFilterChange"
                             @onCancel="resultsDateFilterCancel"></azm-results-date-filter>
    <section>
      <!--营业额-->
      <mu-paper class="azm-turnover" :z-depth="4">
        <mu-flex class="azm-turnover-top" justify-content="start">
          <mu-flex fill class="azm-turnover-top-left">营业额</mu-flex>
          <template v-if="resultsDateFilter.type===0">
            <mu-flex justify-content="end" class="azm-turnover-top-right"
                     :class="{'azm-turnover-btn-active':!turnoverShow}">
              <mu-flex justify-content="end">
                <mu-button flat :textColor="turnoverShow?'#2D81E4':'#fff'" small
                           @click.native="turnoverShow = false">
                  <span class="iconfont icon-bingtuzhanbi"></span>
                </mu-button>
              </mu-flex>
              <mu-flex justify-content="end">
                <mu-button flat class="azm-btn-bar" :textColor="!turnoverShow?'#2D81E4':'#fff'" small
                           @click.native="turnoverShow = true">
                  <span class="iconfont icon-zhuzhuangtu1"></span>
                </mu-button>
              </mu-flex>
            </mu-flex>
          </template>
        </mu-flex>
        <div class="azm-turnover-title" v-if="!turnoverShow">{{turnoverTotal | money_filter}}元</div>
        <div class="azm-turnover-chart">
          <mu-slide-left-transition>
            <chart class="azm-chart" :options="turnoverBar" :auto-resize="true" v-show="turnoverShow"></chart>
          </mu-slide-left-transition>
          <mu-slide-right-transition>
            <chart class="azm-chart" :options="turnoverPie" :auto-resize="true" v-show="!turnoverShow"></chart>
          </mu-slide-right-transition>
        </div>
        <mu-list class="azm-best-selling">
          <mu-list-item class="azm-best-selling-top van-hairline--top van-hairline--bottom" button :ripple="true"
                        to="/results_ranking/1">
            <mu-list-item-title class="azm-best-selling-title">
              <div>热销品项</div>
            </mu-list-item-title>
            <mu-list-item-action class="azm-best-selling-action">
              <span>更多</span>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item class="azm-best-selling-top" button :ripple="false">
            <mu-list-item-title class="azm-best-selling-title2">
              <span class="iconfont icon-jiangbei azm-icon"></span>
              <span>名称</span>
            </mu-list-item-title>
            <mu-list-item-title class="azm-best-selling-action2">
              <span>销量（单）</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <mu-list class="azm-best-selling" dense>
          <mu-list-item v-for="(item,index) in bestSelles" :key="index" class="azm-best-selling-item" button
                        :ripple="false" v-if="index<3">
            <mu-list-item-title class="azm-best-selling-title">
              <span class="azm-best-selling-icon">{{index + 1}}</span>
              <span>{{item.item_name}}</span>
            </mu-list-item-title>
            <mu-list-item-title class="azm-best-selling-action">
              <span class="van-ellipsis">{{item.num | money_filter}}单</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-paper>
      <mu-paper class="azm-volume marTop12" :z-depth="4">
        <mu-flex class="azm-turnover-top" justify-content="start">
          <mu-flex fill class="azm-turnover-top-left">成交量</mu-flex>
          <template v-if="resultsDateFilter.type===0">
            <mu-flex justify-content="end" class="azm-turnover-top-right"
                     :class="{'azm-turnover-btn-active':!volumeShow}">
              <mu-flex justify-content="end">
                <mu-button flat :textColor="volumeShow?'#2D81E4':'#fff'" small
                           @click.native="volumeShow = false">
                  <span class="iconfont icon-bingtuzhanbi"></span>
                </mu-button>
              </mu-flex>
              <mu-flex justify-content="end">
                <mu-button flat class="azm-btn-bar" :textColor="!volumeShow?'#2D81E4':'#fff'" small
                           @click.native="volumeShow = true">
                  <span class="iconfont icon-zhuzhuangtu1"></span>
                </mu-button>
              </mu-flex>
            </mu-flex>
          </template>
        </mu-flex>
        <div class="azm-turnover-title" v-if="!volumeShow">{{volumeTotal | money_filter}}单</div>
        <div class="azm-turnover-chart">
          <mu-slide-left-transition>
            <chart class="azm-chart" :options="volumeBar" :auto-resize="true" v-show="volumeShow"></chart>
          </mu-slide-left-transition>
          <mu-slide-right-transition>
            <chart class="azm-chart" :options="volumePie" :auto-resize="true" v-show="!volumeShow"></chart>
          </mu-slide-right-transition>
        </div>
        <mu-list class="azm-best-selling">
          <mu-list-item class="azm-best-selling-top van-hairline--top van-hairline--bottom" button :ripple="false">
            <mu-list-item-title class="azm-best-selling-title">
              <div>订单情况</div>
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item class="azm-best-selling-top van-hairline--bottom" button :ripple="false">
            <mu-list-item-action class="azm-best-selling-title2">
              <span>订单量</span>
            </mu-list-item-action>
            <mu-list-item-title class="azm-best-selling-action2">
              <span>{{orderData.count | money_filter}}单</span>
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item class="azm-best-selling-top van-hairline--bottom" button :ripple="false">
            <mu-list-item-action class="azm-best-selling-title2">
              <span>退单量</span>
            </mu-list-item-action>
            <mu-list-item-title class="azm-best-selling-action2">
              <span>{{orderData.refundOrder | money_filter}}单</span>
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item class="azm-best-selling-top" button :ripple="false">
            <mu-list-item-action class="azm-best-selling-title2">
              <span>退单率</span>
            </mu-list-item-action>
            <mu-list-item-title class="azm-best-selling-action2">
              <span>{{orderData.orderRatio}}%</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    </section>
  </div>
</template>

<script>
  // 加载ECharts
  import ECharts from 'vue-echarts/components/ECharts.vue'

  // 手动引入 ECharts 各模块来减小打包体积
  import 'echarts/lib/chart/bar'//柱状图
  import 'echarts/lib/chart/line'//折线图
  import 'echarts/lib/chart/pie'//饼状图

  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/legendScroll'

  import { Paper } from 'muse-ui'
  import Avatar from '../../components/avatar/index.vue'
  import { XInput, PopupPicker, dateFormat } from 'vux'
  import { mapState } from 'vuex'
  import resultsDateFilter from '../../view-render/results-date-filter.vue'

  export default {
    components: {
      [Paper.name]: Paper,
      [resultsDateFilter.name]: resultsDateFilter,
      XInput,
      PopupPicker,
      [Avatar.name]: Avatar,
      chart: ECharts
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        resultsDateFilter: state => state.vux.resultsDateFilter,
      })
    },
    data () {
      let toDay = new Date()
      return {
        toDay,
        turnoverShow: false,
        volumeShow: false,
        azmMenuOpen: false,
        azmActionsheet: false,
        dateType: 0,
        dateTime: [],
        turnoverBar: {},
        volumeBar: {},
        turnoverPie: {},
        volumeTotal: 0,
        turnoverTotal: 0,
        bestSelles: [],
        orderData: {},
        volumePie: {},
        label: '',
        actions: {
          menu1: '按月选择',
          menu2: '按日选择',
          menu3: '本月'
        }
      }
    },
    created () {
      let type = this.$route.query.type
      if (type > 0) {
        this.resultsDateFilter.type = +type
      }
      this.$nextTick(function () {
        this.getAchievementIndex()
      })
    },
    watch: {},
    methods: {
      getAchievementIndex () {
        let that = this
        let resultsDateFilter = that.resultsDateFilter
        let type = resultsDateFilter.type,
          start_time = dateFormat(resultsDateFilter.start_time, 'YYYY-MM-DD'),
          end_time = dateFormat(resultsDateFilter.end_time, 'YYYY-MM-DD')
        if (type !== 0) {
          this.turnoverShow = false
          this.volumeShow = false
        }
        this.$store.dispatch('ApiService/AchievementIndex', {type, start_time, end_time}).finally(res => {
          if (res.status === 1 && res.info) {
            let turnover = res.info.Turnover
            if (turnover) {
              let xAxis = []
              let yAxis = []
              let legend = []
              let data = []
              let color = []
              let turnoverTotal = 0
              if (turnover.list && turnover.list.length > 0) {
                for (let v of turnover.list) {
                  xAxis.push(v.month)
                  yAxis.push(v.total)
                }
              }
              if (turnover.pie && turnover.pie.length > 0) {
                for (let v of turnover.pie) {
                  legend.push(v.name)
                  data.push(v.total)
                  color.push(v.color)
                  turnoverTotal += +v.total
                }
              }
              that.turnoverTotal = turnoverTotal
              that.turnoverBar = this.setBar(xAxis, [yAxis])
              that.turnoverPie = this.setPie(legend, data, '元', color)
              that.bestSelles = turnover.hot
            }
            let volume = res.info.volume
            if (volume) {
              let xAxis2 = []
              let yAxis2 = []
              let legend2 = []
              let data2 = []
              let color2 = []
              let volumeTotal = 0
              if (volume.list && volume.list.length > 0) {
                for (let v of volume.list) {
                  xAxis2.push(v.month)
                  yAxis2.push(v.num)
                }
              }
              if (volume.pie && volume.pie.length > 0) {
                for (let v of volume.pie) {
                  legend2.push(v.name)
                  data2.push(v.total)
                  color2.push(v.color)
                  volumeTotal += +v.total
                }
              }
              that.volumeTotal = that.util.number_format(volumeTotal, 2, undefined, ',')
              that.volumeBar = this.setBar(xAxis2, [yAxis2], '单')
              that.volumePie = this.setPie(legend2, data2, '单', color2)
              that.orderData = {
                count: volume.count,
                orderRatio: volume.orderRatio,
                refundOrder: volume.refundOrder,
              }
            }
          } else {
            that.$vux.toast.text(res.msg, 'top')
          }
        })
      },
      getMyData (data) {
        let that = this
        let yAxis = data.yAxis || []
        let lines = data.lines || []
        let legendBar = data.legendBar || []
        let legendLine = data.legendLine || []
        let symbol = data.symbol || ' '
        let seriesArr = []
        let legendArr = []
        yAxis && yAxis.forEach((item, index) => {
          legendArr.push({
            name: legendBar && legendBar.length > 0 && legendBar[index]
          })
          seriesArr.push({
            name: legendBar && legendBar.length > 0 && legendBar[index],
            type: 'bar',
            barGap: '0.5px',
            data: item,
            barWidth: data.barWidth || 12,
            label: {//头部文字样式
              normal: {
                show: true,
                formatter: function (v) {
                  let money = that.util.money_format(v.data)
                  return money + symbol
                },
                position: 'top',
                textStyle: {
                  color: '#171F24',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                  fontSize: 12,
                },
              },
            },
            itemStyle: { //图形样式
              normal: {
                barBorderRadius: 2,
                color: data.barColor[index]
              },
            }
          })
        })

        lines && lines.forEach((item, index) => {
          legendArr.push({
            name: legendLine && legendLine.length > 0 && legendLine[index]
          })
          seriesArr.push({
            name: legendLine && legendLine.length > 0 && legendLine[index],
            type: 'line',
            data: item,
            itemStyle: {
              normal: {
                color: data.lineColor[index],
                lineStyle: {
                  width: 3,
                  type: 'solid',
                }
              }
            },
            label: {
              normal: {
                show: false, //折线上方label控制显示隐藏
                position: 'top',
              }
            },
            symbol: 'circle',
            symbolSize: 10
          })
        })
        return {seriesArr, legendArr}
      },
      getOptions ({type = 'pie', data = [], legend = [], symbol = '', barColor = []}) {
        let that = this
        let seriesArr = []
        let legendArr = []
        let seriesData = []
        data && data.forEach((item, index) => {
          legendArr.push({
            name: legend && legend.length > 0 && legend[index],
            icon: 'roundRect'
          })
          let obj = {
            name: legend && legend.length > 0 && legend[index],
            value: item,
            itemStyle: {
              color: barColor[index]
            }
          }
          if (barColor && barColor.length > 0) {
            obj.itemStyle = {
              color: barColor[index]
            }
          }
          seriesData.push(obj)
        })
        seriesArr.push({
          name: '成交量',
          type: 'pie',
          radius: '80%',
          center: ['30%', '50%'],
          data: seriesData,
          label: {
            show: false
          },
          labelLine: {
            show: false,
            length: 5,
            length2: 5,
            smooth: true,
          }
        })
        return {seriesArr, legendArr}
      },
      setBar (xAxis = [], yAxis = [], symbol = '') {
        let that = this,
          barLinearColor = new ECharts.graphic.LinearGradient(
            0, 0, 0, 1,
            [{offset: .3, color: '#309BFF'}, {offset: 1, color: '#305BFF'}])
        /**
         * 图标数据
         */
        let data = {
          id: '',
          title: '',
          titleLink: '',
          subTitle: '',
          legendBarShow: false,
          legendRight: '50%',
          legendBar: ['营业额'],//柱状图
          symbol: symbol, //数值是否带百分号--默认为空 ''
          legendLine: [],
          barWidth: 15,
          xAxis: xAxis,
          yAxis: yAxis,
          lines: [],
          barColor: [barLinearColor], //柱子颜色 必填参数
          lineColor: [], // 折线颜色
        }
        let myData = that.getMyData(data)
        let money_format = that.util.money_format
        return {
          backgroundColor: '#fff',
          title: {
            show: false,
            text: data.title,
            subtext: data.subTitle,
            link: data.titleLink
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let time = ''
              let str = ''
              for (let i of params) {
                time = i.name.replace(/\n/g, '') + '<br/>'
                let money = money_format(i.data)
                if (i.data === 'null' || i.data === null) {
                  str += `${i.seriesName}：无数据<br/>`
                } else {
                  str += `${i.seriesName}：${money}${data.symbol}<br/>`
                }
              }
              return time + str
            },
            axisPointer: {type: 'none'},
          },
          legend: {
            show: data.legendBarShow,
            right: data.legendRight || '30%',
            top: 12,
            itemGap: 16,
            itemWidth: 10,
            itemHeight: 10,
            data: myData.legendArr,
            textStyle: {
              color: '#414957',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            }
          },
          grid: {
            x: 15,
            y: 15,
            x2: 20,
            y2: 40,
          },
          xAxis: {
            type: 'category',
            data: data.xAxis,
            axisTick: {
              show: false,
            },

            axisLine: {
              show: true,
              lineStyle: {
                color: '#d8e0e5',
                width: 1,
                type: 'dashed'
              }
            },
            axisLabel: {
              show: true,
              interval: '0',
              textStyle: {
                lineHeight: 16,
                padding: [2, 2, 0, 2],
                height: 50,
                fontSize: 12,
              },
              rich: {
                Sunny: {
                  height: 50,
                  // width: 60,
                  padding: [0, 5, 0, 5],
                  align: 'center',
                },
              },
              formatter: function (params, index) {
                let newParamsName = ''
                let splitNumber = 5
                let paramsNameNumber = params && params.length
                if (paramsNameNumber && paramsNameNumber <= 4) {
                  splitNumber = 4
                } else if (paramsNameNumber >= 5 && paramsNameNumber <= 7) {
                  splitNumber = 4
                } else if (paramsNameNumber >= 8 && paramsNameNumber <= 9) {
                  splitNumber = 5
                } else if (paramsNameNumber >= 10 && paramsNameNumber <= 14) {
                  splitNumber = 5
                } else {
                  params = params && params.slice(0, 15)
                }

                let provideNumber = splitNumber //一行显示几个字
                let rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = ''
                    let start = p * provideNumber
                    let end = start + provideNumber
                    if (p === rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber)
                    } else {
                      tempStr = params.substring(start, end) + '\n'
                    }
                    newParamsName += tempStr
                  }
                } else {
                  newParamsName = params
                }
                params = newParamsName
                return '{Sunny|' + params + '}'
              },
              color: '#AAB2B7',
            },
            max: function (value) {
              return value.max
            }
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {//分隔线
              show: false,
              lineStyle: {
                color: '#F1F3F5',
                type: 'solid'
              },
              interval: 2
            },
            splitNumber: 2,
            max: function (value) {
              return value.max + value.max * 0.1
            }
          },
          series: myData.seriesArr
        }
      },
      setPie (legend = [], _data = [], symbol = '', barColor = []) {
        let that = this
        let data = {
          legend: legend,
          data: _data,
          symbol: symbol,
          barColor: ['#00C394', '#FF942F', '#2D81E4'],
          selected: {}
        }
        if (barColor && barColor.length > 0) {
          data.barColor = barColor
        }
        let myData = this.getOptions(data)
        let number_format = that.util.number_format
        return {
          backgroundColor: '#fff',
          title: {
            show: false,
            text: '同名数量统计',
            subtext: '纯属虚构',
            x: 'left'
          },
          tooltip: {
            show: false,
            trigger: 'item',
            formatter: `{a} <br/>{b} : {c}${data.symbol} ({d}%)`
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 10,
            bottom: 20,
            data: myData.legendArr,
            selected: data.selected,
            formatter: function (name) {
              let fIndex = data.legend.findIndex(v => {
                return v === name
              })
              let num = Number(number_format(data.data[fIndex]))
              return fIndex > -1 ? `${name}  ${num}${data.symbol}` : name
            }
          },
          series: myData.seriesArr
        }
      },
      resultsDateFilterChange (e) {
        this.getAchievementIndex()
      },
      resultsDateFilterCancel (e) {

      }
    }
  }
</script>

<style scoped lang='less'>
  .azm-results-index {
    .azm-top {
      box-sizing: border-box;
      padding: 12px 15px;
      .azm-NoticeBar {
        width: 100%;
        opacity: 0.5;
        font-size: 28/2px;
        color: #171F24;
        background-color: transparent;
        box-sizing: border-box;
        padding: 0;
        padding-left: 10px;
        height: 22.5px;
        line-height: 22.5px;
      }
      .azm-dateTime {
        font-size: 32/2px;
        color: #171F24;
        font-weight: 500;
        line-height: 22.5px;
      }
      .azm-dateTime-btn {
        height: 22.5px;
        line-height: 22.5px;
        padding-left: 10px;
        span {
          text-align: right;
          font-size: 32/2px;
          color: #6F7578;
        }
      }
      .flex-wrapper {
        width: 100%;
      }
      .flex-demo {
        width: 85px;
      }
      .mu-input {
        min-height: 45/2px;
        height: 45/2px;
        padding-bottom: 0;
        padding-top: 0;
        font-size: 32/2px;
      }
    }

    .echarts {
      width: 100%;
      height: 370/2px;
    }

    section {
      box-sizing: border-box;
      padding: 0 15px;
    }
    .azm-turnover, .azm-volume {
      padding-bottom: 12px;
      background-color: #fff;
      overflow: hidden;
      box-sizing: border-box;
      z-index: 100;
      border-radius: 10px;
      .azm-turnover-top {
        box-sizing: border-box;
        padding: 15px;
        .azm-turnover-top-left {
          box-sizing: border-box;
          padding-left: 15px;
          position: relative;
          font-size: 14px;
          color: #171F24;
          font-weight: 500;
          &:before {
            content: ' ';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
            background-image: linear-gradient(-135deg, #309BFF 0%, #305BFF 100%);
          }
        }
        .azm-turnover-top-right {
          border-radius: 1px;
          border: 1px solid #2D81E4;
          .mu-button {
            border-radius: 0;
            overflow: hidden;
            margin: 0;
            width: 30px;
            height: 30px;
            min-width: 30px;
            span {
              font-size: 15px;
            }
            &.azm-btn-bar {
              background-color: #2D81E4;
            }
          }
          &.azm-turnover-btn-active {
            .mu-button {
              background-color: #2D81E4;
              &.azm-btn-bar {
                background-color: #fff;
              }
            }
          }
        }
      }
      .azm-turnover-title {
        padding: 0 15px;
        text-align: right;
        font-weight: 500;
        color: #171f24;
        font-size: 32/2px;
        height: 42.5px;
        line-height: 42.5px;
      }
      .azm-turnover-chart {
        position: relative;
        height: 370/2px;
        width: 100%;
        background-color: #fff;
        .azm-chart {
          position: absolute;
          top: 0;
          left: 0;
          height: 370/2px;
        }
      }
      .azm-best-selling {
        padding: 0;
        .azm-best-selling-top {
          .azm-best-selling-title {
            box-sizing: border-box;
            padding-left: 15px;
            position: relative;
            font-size: 14px;
            color: #171F24;
            font-weight: 500;
            &:before {
              content: ' ';
              position: absolute;
              width: 8px;
              height: 8px;
              border-radius: 100%;
              left: 0;
              top: 50%;
              transform: translate(0, -50%);
              background-image: linear-gradient(-135deg, #309BFF 0%, #305BFF 100%);
            }
          }
          .azm-best-selling-action {
            color: #AAB2B7;
            font-size: 12px;
          }
          .azm-best-selling-title2 {
            box-sizing: border-box;
            position: relative;
            font-size: 14px;
            color: #171F24;
            font-weight: 500;
            .azm-icon {
              font-size: 33/2px;
              margin-right: 14px;
              color: #6F7578;
            }
          }
          .azm-best-selling-action2 {
            text-align: right;
            font-size: 14px;
            color: #171F24;
          }
        }
        .azm-best-selling-item {
          .azm-best-selling-title {
            color: #6F7578;
            font-size: 14px;
          }
          .azm-best-selling-icon {
            display: inline-block;
            width: 18px;
            height: 18px;
            background-color: #9E9E9E;
            text-align: center;
            line-height: 18px;
            font-size: 12px;
            font-weight: 500;
            transform: scale(.8);
            color: #fff;
            border-radius: 100%;
            vertical-align: middle;
            margin-right: 14px;
          }
          .azm-best-selling-action {
            flex: 3 3 auto;
            text-align: right;
            color: #6F7578;
            font-size: 14px;
          }
          &:nth-child(1) {
            .azm-best-selling-icon {
              background-color: #F9B655;
            }
          }
          &:nth-child(2) {
            .azm-best-selling-icon {
              background-color: #FF9330;
            }
          }
          &:nth-child(3) {
            .azm-best-selling-icon {
              background-color: #F4715A;
            }
          }
        }
      }
    }
    .azm-volume {
      padding-bottom: 0;
      margin-bottom: 50px;
      .azm-best-selling-title2 {
        font-size: 14px !important;
        color: #6F7578 !important;
      }
      .azm-best-selling-action2 {
        font-size: 14px !important;
        color: #323232 !important;
      }
    }
  }

</style>


<style lang="less">
  .datepicker {
    z-index: 1000;
  }

  .azm-results-index {
    .mu-input {
      .mu-text-field-input {
        color: #171F24;
        font-weight: 500;
      }
    }
    .flex-demo:nth-child(2) {
      .mu-text-field-input {
        text-align: right;
      }
    }
  }

  .azm-results-menu-box {
    font-size: 12px;
    .mu-item {
      padding: 0 10px;
      height: 30px;
    }
    .mu-item-title {
      font-size: 12px;
      line-height: 1;
      height: auto;
    }
  }
</style>






