<template>
  <div class="t-operationTiem">
    <div class="t-operationDay">
      <p>添加每周营业日</p>
      <div class="t-label">
        <checker v-model="day" type="checkbox" default-item-class="azm-dateList--btn"
                 selected-item-class="azm-dateList--btn-selected">
          <checker-item :value="index" v-for="(item,index) in dateList" :key="index">
            <div>
              <span>{{item.txt}}</span>
              <van-icon name="checked" class="azm-icon"></van-icon>
            </div>
          </checker-item>
        </checker>
      </div>
    </div>

    <div class="t-addTime">
      <p>添加营业时间</p>
      <picker :data='dateTimeList' v-model='dateTime' @on-change='dateTimeChange'></picker>
    </div>
    <van-button class="t-button" @click.native="bindSubmit">保&nbsp;存</van-button>
  </div>
</template>

<script>
  import { Icon, Button, Row, Col } from "vant";
  import { Picker, Checker, CheckerItem } from 'vux'
  import { mapState } from 'vuex'
  let startHour1 = [],
    startMinute1 = []
  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      startHour1.push(`0${i}时`)
      startMinute1.push(`0${i}分`)
      continue;
    }
    if (i < 24) {
      startHour1.push(`${i}时`)
    }
    startMinute1.push(`${i}分`)
  }

  export default {
    components: {
      Picker, Checker, CheckerItem,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    computed: {
      ...mapState({
        newShopData: state => state.merchant.newShopData,
        $location: state => state.vux.$location,
      })
    },
    data() {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        currentDate: "12:00",
        dateTime: ['08时', '00分', '-', '20时', '00分'],
        dateTimeList: [
          startHour1,
          startMinute1,
          ['-'],
          startHour1,
          startMinute1
        ],
        dateList: [
          {
            txt: '周一'
          },
          {
            txt: '周二',
          },
          {
            txt: '周三',
          },
          {
            txt: '周四',
          },
          {
            txt: '周五',
          },
          {
            txt: '周六',
          },
          {
            txt: '周日'
          },
        ],
        day: [0, 1, 2, 3, 4, 5, 6]
      };
    },
    watch: {
      dateList(c, o){
        console.log(c, o)
      }
    },
    created() {
      let $ = this.$azm.Zepto,
        open_starttime = this.newShopData.open_starttime,
        open_endtime = this.newShopData.open_endtime
      this.day = []
      if ($.isArray(this.newShopData.day)) {
        for (let v of this.newShopData.day) {
          this.day.push(+v)
        }
      }
      if (open_starttime) {
        open_starttime = open_starttime.split(':')
        this.dateTime[0] = `${open_starttime[0]}时`
        this.dateTime[1] = `${open_starttime[1]}分`
      }
      if (open_starttime) {
        open_endtime = open_endtime.split(':')
        this.dateTime[3] = `${open_endtime[0]}时`
        this.dateTime[4] = `${open_endtime[1]}分`
      }
    },
    methods: {
      dateTimeChange(item){
        console.log(item)
      },
      bindSubmit(){
        if (this.day.length <= 1) {
          this.$vux.toast.text('请选择每周运营日~')
          return;
        }
        let $ = this.$azm.Zepto
        this.newShopData.day = []
        this.day = this.$azm.util.quickSort(this.day)
        for (let v of this.day) {
          this.newShopData.day.push(v)
        }
        const dateTime = this.dateTime

        function _replace (v) {
          return v.replace(/[\u4e00-\u9fa5]/gm, '')
        }

        this.newShopData.open_starttime = `${_replace(dateTime[0])}:${_replace(dateTime[1])}`
        this.newShopData.open_endtime = `${_replace(dateTime[3])}:${_replace(dateTime[4])}`
        this.$router.back()
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-operationTiem {
    .t-operationDay {
      background-color: #ffffff;
      padding: 30/2px;
      > p {
        font-size: 32/2px;
        margin-bottom: 30/2px;
      }
      .t-label {
        margin: -7.5px -7.5px;
        .azm-dateList--btn {
          position: relative;
          padding: 7.5px 7.5px;
          box-sizing: border-box;
          width: 25%;
          > div {
            position: relative;
            text-align: center;
            box-sizing: border-box;
            width: 100%;
            height: 30px;
            line-height: 30px;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
            color: #666;
            border: 1px solid transparent;
            .azm-icon {
              position: absolute;
              font-size: 15px;
              color: #ff4919;
              top: 0;
              right: 0;
              transform: translate(50%, -50%);
              display: none;
              background-color: #fff;
            }
          }
          &.azm-dateList--btn-selected {
            > div {
              background-color: rgba(255, 73, 25, 0.06);
              border: 1px solid #ff4919;
              color: #ff4919;
              .azm-icon {
                display: inline;
              }
            }
          }
        }

        .azm-dateList {
          width: 150/2px;
          height: 58/2px;
          background-color: #f5f5f5;
          border-radius: 4/2px;
          line-height: 58/2px;
          text-align: center;
        }
      }
    }
    .t-addTime {
      background-color: #ffffff;
      margin-top: 20/2px;
      > p {
        font-size: 32/2px;
        margin-left: 30/2px;
        padding-top: 30/2px;
      }
    }
    button {
      border: 0;
    }
    .t-button {
      width: 690/2px;
      height: 45px;
      line-height: 43px;
      background-image: linear-gradient(-90deg, #3d70f7 0%, #35abfe 100%);
      border-radius: 45/2px;
      color: #ffffff;
      font-size: 32/2px;
      margin: 50px auto 0;
      display: block;
    }
  }
</style>
