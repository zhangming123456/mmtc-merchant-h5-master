<template>
  <div class="t-client-payConstitute azm-load-more-wrap">
    <section class="t-payChart marTop12">
      <mu-paper class="azm-total-spending" :z-depth="4">
        <mu-flex class="azm-chart-top" justify-content="start">
          <mu-flex fill class="azm-chart-top-left">消费总额</mu-flex>
        </mu-flex>
        <div class="azm-chart">
          <chart class="azm-chart-box" :options="totalSpendingPie" :auto-resize="true"></chart>
        </div>
        <div class="azm-total-spending-footer">{{totalPrice | money_filter}}元</div>
      </mu-paper>
    </section>

    <div class="azm-load-more-item marTop12">
      <mu-load-more class="needsclick" @refresh="refresh" :refreshing="refreshing" :loading="loading"
                    :loaded-all="loadedAll" @load="load">
        <div class="t-shopList">
          <div class="t-shopInfo" v-for="(item,index) in expendList" :key="index">
            <div class="t-shopImg">
              <azm-avatar :src="item.cover"></azm-avatar>
            </div>
            <div class="t-shopContent">
              <div class="t-shopTitle">
                <div :style="{backgroundColor:item.color}"></div>
                <span>{{item.item_name}}</span>
              </div>
              <div class="t-shopNum">单数：{{item.num}}</div>
              <div class="t-price">
                <div class="t-flex">
                  <div class="t-newPrice">
                    <span>￥</span>
                    <span>{{item.price}}</span>
                  </div>
                  <span class="t-oldPrice">￥{{item.market_price}}</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </mu-load-more>
    </div>
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
  import { mapState } from "vuex";
  import { LoadMore, Paper } from "muse-ui";
  import Avatar from "../../components/avatar/index.vue";

  export default {
    components: {
      [LoadMore.name]: LoadMore,
      [Paper.name]: Paper,
      [Avatar.name]: Avatar,
      chart: ECharts
    },
    computed: {
      ...mapState({
        tcProductData: state => state.tcProduct.tcProductData
      })
    },
    data () {
      return {
        refreshing: false,
        loading: false,
        loadedAll: false,
        totalSpendingPie: {},
        expendList: [],
        totalPrice: 0
      };
    },
    watch: {},
    created () {
      this.$nextTick(function () {
        this.refresh();
      });
    },
    methods: {
      refresh (e) {
        this.refreshing = true;
        try {
          this.getHistory().finally(res => {
            this.refreshing = false;
          });
        } catch (err) {
          this.refreshing = false;
        }
      },

      getHistory () {
        let that = this;
        var member_id = this.$route.query.member_id;
        this.$store.dispatch("ApiService/getHistory", {member_id}).then(res => {
          console.log(res);
          if (1 === res.status) {
            that.expendList = res.info;

            let x = [];
            let y = [];
            let z = [];
            let totalPrice = 0;

            for (let v of that.expendList) {
              let price = v.price || 0;
              let _p = price * v.num;
              x.push(v.item_name);
              y.push(that.util.number_format(_p));

              z.push(v.color);
              totalPrice += _p;
            }
            that.totalPrice = totalPrice;

            this.totalSpendingPie = this.setPie(x, y, "元", z);
          }
        });
      },
      load (e) {
        //        this.loading = true;
        //        let tabsActive = this.tabsActive;
        //        let P = null
        //        if (tabsActive === 2) {
        //          P = this.getItemlistSite(this.auditPage, tabsActive)
        //        } else if (tabsActive === 1) {
        //          P = this.getItemlistSite(this.soldOutPage, tabsActive)
        //        } else {
        //          P = this.getItemlistSite(this.shelvesPage, tabsActive)
        //        }
        //        if (P) {
        //          P.finally(res => {
        //            this.loading = false;
        //          })
        //        } else {
        //          this.loading = false;
        //        }
      },
      getOptions ({
                    type = "pie",
                    data = [],
                    legend = [],
                    symbol = "",
                    barColor = []
                  }) {
        let that = this;
        let seriesArr = [];
        let legendArr = [];
        let seriesData = [];
        data &&
        data.forEach((item, index) => {
          legendArr.push({
            name: legend && legend.length > 0 && legend[index],
            icon: "roundRect"
          });
          let obj = {
            name: legend && legend.length > 0 && legend[index],
            value: item,
            itemStyle: {
              color: barColor[index]
            }
          };
          if (barColor && barColor.length > 0) {
            obj.itemStyle = {
              color: barColor[index]
            };
          }
          seriesData.push(obj);
        });
        seriesArr.push({
          name: "成交量",
          type: "pie",
          radius: "80%",
          center: ["50%", "50%"],
          data: seriesData,
          label: {
            show: false
          },
          labelLine: {
            show: false,
            length: 5,
            length2: 5,
            smooth: true
          }
        });
        return {seriesArr, legendArr};
      },
      setPie (legend = [], _data = [], symbol = "", barColor = []) {
        let that = this;
        let data = {
          legend: legend,
          data: _data,
          symbol: symbol,
          barColor: ["#00C394", "#FF942F", "#2D81E4"],
          selected: {}
        };
        if (barColor && barColor.length > 0) {
          data.barColor = barColor;
        }
        let myData = this.getOptions(data);
        let number_format = that.util.number_format;
        return {
          backgroundColor: "#fff",
          title: {
            show: false,
            text: "同名数量统计",
            subtext: "纯属虚构",
            x: "left"
          },
          tooltip: {
            show: true,
            trigger: "item",
            formatter: `{a} <br/>{b} : {c}${data.symbol} ({d}%)`
          },
          legend: {
            show: false,
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 10,
            bottom: 20,
            data: myData.legendArr,
            selected: data.selected,
            formatter: function (name) {
              let fIndex = data.legend.findIndex(v => {
                return v === name;
              });
              let num = Number(number_format(data.data[fIndex]));
              return fIndex > -1 ? `${name}  ${num}${data.symbol}` : name;
            }
          },
          series: myData.seriesArr
        };
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-client-payConstitute {
    .t-payChart {
      box-sizing: border-box;
      padding: 0 15px;
      .azm-total-spending {
        padding-bottom: 12px;
        background-color: #fff;
        overflow: hidden;
        box-sizing: border-box;
        z-index: 100;
        border-radius: 10px 10px 0 0;
        .azm-chart {
          background-color: #fff;
          height: 370/2px;
          position: relative;
          width: 100%;
          .azm-chart-box {
            position: absolute;
            height: 370/2px;
            left: 0;
            top: 0;
          }
        }
        .azm-total-spending-footer {
          padding: 0 15px;
          text-align: center;
          font-size: 16px;
          color: #171f24;
          font-weight: 500;
        }
      }
    }
    .t-shopList {
      .t-shopInfo {
        box-sizing: border-box;
        padding: 30/2px;
        background-color: #ffffff;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .t-shopImg {
          margin-right: 30/2px;
          width: 150/2px;
          height: 150/2px;
          img {
            width: 150/2px;
            height: 150/2px;
            border-radius: 4/2px;
          }
        }
        .t-shopContent {
          flex: 1;
          position: relative;

          .t-shopTitle {
            display: flex;
            align-items: center;
            div {
              background: #2d81e4;
              width: 20/2px;
              height: 20/2px;
              margin-right: 18/2px;
            }
            > span {
              font-size: 32/2px;
              color: #171f24;
              font-weight: 500;
            }
            .t-shopLabel {
              border: 1px solid #f25643;
              border-radius: 4/2px;
              font-size: 22/2px;
              color: #f25643;
              height: 30/2px;
              line-height: 30/2px;
              padding-left: 5/2px;
              padding-right: 5/2px;
            }
          }
          .t-shopNum {
            font-size: 24/2px;
            color: #6f7578;
            margin-top: 20/2px;
          }
          .t-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-top: 20/2px;
            .t-flex {
              display: flex;
              align-items: center;
              .t-newPrice {
                color: #ff6182;
                margin-right: 10/2px;
                > span:first-child {
                  font-size: 16/2px;
                }
                > span:last-child {
                  font-size: 32/2px;
                }
              }
              .t-oldPrice {
                text-decoration: line-through;
                font-size: 24/2px;
                color: #aab2b7;
                margin-top: 5/2px;
              }
            }

            .t-time {
              font-size: 24/2px;
              color: #aab2b7;
              margin-top: 5/2px;
            }
          }
          .t-tiem {
            font-size: 28/2px;
            color: #6f7578;
            position: absolute;
            right: 0;
            bottom: 50/2px;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .t-client-payConstitute {
    .echarts {
      width: 100%;
    }
  }
</style>

