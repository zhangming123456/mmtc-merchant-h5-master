<template>
  <div class="azm-product-deadline">
    <mu-list class="azm-product-list-item">
      <mu-list-item class="van-hairline--bottom azm-product-list-header">
        <mu-list-item-title class="azm-product-list-title">设置期限</mu-list-item-title>
        <mu-list-item-action class="azm-product-list-value">
          <mu-switch v-model="isTheTerm"></mu-switch>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
    <mu-expand-transition>
      <div class="azm-deadline-date-box marTop12" v-if="isTheTerm">
        <mu-row class="azm-title">
          <mu-col :span="4">开始日期</mu-col>
          <mu-col :span="4"></mu-col>
          <mu-col :span="4">结束日期</mu-col>
          <mu-col :span="4"></mu-col>
          <mu-col :span="4">{{ start_date | dateRang(end_date) }}天</mu-col>
          <mu-col :span="4"></mu-col>
          <mu-col :span="4" @click="setStartDate" class="azm-date">{{start_date}}</mu-col>
          <mu-col :span="4"></mu-col>
          <mu-col :span="4" @click="setEndDate" class="azm-date">{{end_date}}</mu-col>
        </mu-row>
        <van-field class="van-hairline--top" v-model="note" label="期限说明" placeholder="例如法定节假日不能使用" :max-length="20"
                   clearable/>
      </div>
    </mu-expand-transition>
    <div class="azm-deadline-time-box marTop12">
      <div class="azm-title">使用时间</div>
      <mu-row>
        <mu-col :span="6">
          <div class="azm-time-title">开始时间</div>
          <datetime-view v-model="start_time" ref="datetime1" :format="format"></datetime-view>
        </mu-col>
        <mu-col :span="6">
          <div class="azm-time-title">结束时间</div>
          <datetime-view v-model="end_time" ref="datetime2" :format="format"></datetime-view>
        </mu-col>
      </mu-row>
    </div>

    <mu-row class="azm-append-footer azm-append-footer-fixed">
      <mu-col :span="6">
        <mu-button full-width textColor="#666" @click.native="$router.back">
          <span>取消</span>
        </mu-button>
      </mu-col>
      <mu-col :span="6">
        <mu-button full-width textColor="#fff" @click.native="onConfirm">
          <span>提交</span>
        </mu-button>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
  import dataRange from '../../tools/date/range'
  import { dateFormat, DatetimeView } from 'vux'
  import { Field } from 'vant';
  import{ Switch }from "muse-ui"
  import { mapState } from 'vuex'
  export default {
    components: {
      DatetimeView,
      [Field.name]: Field,
      [Switch.name]: Switch
    },
    data(){
      let now = new Date();
      let toDay = dateFormat(now, 'YYYY-MM-DD')
      now.setFullYear(now.getFullYear() + 1);//设置年数 +1年
      now.setDate(now.getDate() - 1);//设置天数 -1 天
      let twoDay = dateFormat(now, 'YYYY-MM-DD')
      return {
        message: '',
        isTheTerm: false,
        note: "",
        start_date: toDay,
        end_date: twoDay,
        start_time: '8:00',
        end_time: '20:00',
        format: "HH:mm"
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    filters: {
      dateRang(start, end){
        let date = dataRange(start, end)
        if (date && date.length) {
          return date.length
        }
        return 0
      }
    },
    created(){
      this.note = this.productData.note
      this.isTheTerm = this.productData.isTheTerm
      if (this.productData.start_date) {
        this.start_date = this.productData.start_date
      }
      if (this.productData.end_date) {
        this.end_date = this.productData.end_date
      }
      if (this.productData.start_time) {
        this.start_time = this.productData.start_time
      }
      if (this.productData.end_time) {
        this.end_time = this.productData.end_time
      }
    },
    methods: {
      setStartDate(){
        let that = this
        let end_date2 = that.end_date
        let start_date = this.start_date
        this.$vux.datetime.show({
          cancelText: "取消",
          confirmText: "确定",
          value: start_date, // 其他参数同 props
          onConfirm(value){
            if (value) {
              that.start_date = value
              let start_date = +new Date(value)
              let end_date = +new Date(end_date2)
              if (end_date < start_date) {
                that.end_date = value
              }
            }
          }
        })
      },
      setEndDate(value){
        let that = this
        let start_date = this.start_date
        let end_date = this.end_date
        this.$vux.datetime.show({
          cancelText: "取消",
          confirmText: "确定",
          startDate: start_date,
          minYear: '',
          value: end_date, // 其他参数同 props
          onConfirm(value){
            if (value) {
              that.end_date = value
            }
          }
        })
      },
      onConfirm(){
        this.productData.note = this.note
        this.productData.isTheTerm = this.isTheTerm
        if (this.start_date) {
          this.productData.start_date = this.start_date
        }
        if (this.end_date) {
          this.productData.end_date = this.end_date
        }
        if (this.start_time) {
          this.productData.start_time = this.start_time
        }
        if (this.end_time) {
          this.productData.end_time = this.end_time
        }
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-deadline {
    .azm-product-list-item {
      background-color: #fff;
      padding: 0;
    }
    .azm-deadline-date-box {
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 15px;
      .van-cell {
        padding-left: 0;
      }
      .azm-title {
        text-align: center;
        padding: 12px 0;
      }
      .azm-date {
        color: #ff4919;
        font-size: 15px;
      }
    }
    .azm-deadline-time-box {
      background-color: #fff;
      box-sizing: border-box;
      .azm-title {
        padding: 12px 15px;
        color: #333;
        font-size: 14px;
      }
      .azm-time-title {
        text-align: center;
        color: #999999;
      }
    }
    .azm-append-footer {
      .col {
        &:nth-child(1) {
          .mu-button {
            border-radius: 0;
            height: 45px;
            line-height: 45px;
            background-color: #f4f4f4;
          }
        }
        &:nth-child(2) {
          .mu-button {
            border-radius: 0;
            height: 45px;
            line-height: 45px;
            background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
          }
        }
      }

    }
  }
</style>
<style lang="less">
  .azm-product-deadline {
  }
</style>
