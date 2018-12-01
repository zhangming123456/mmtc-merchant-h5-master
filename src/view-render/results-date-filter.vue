<template>
  <div class="azm-results-date-filter">
    <actionsheet v-model="azmActionsheet" :menus="actions" @on-click-menu="onActionsheetSelect"
                 show-cancel></actionsheet>
    <div style="display: none;">
      <mu-date-input v-model="startTime" ref="startDateInput" container="bottomSheet" placeholder="起始日期"
                     :max-date="maxTime" display-color="#2d81e4"
                     actions ok-label="下一步" @change="startTimeChange"></mu-date-input>
      <mu-date-input v-model="endTime" ref="endDateInput" container="bottomSheet"
                     :min-date="startTime" :max-date="maxTime" display-color="#2d81e4" actions
                     @change="endTimeChange"></mu-date-input>
      <mu-date-input type="month" v-model="monthTime" ref="monthDateInput" container="bottomSheet" :max-date="maxTime"
                     display-color="#2d81e4"
                     actions @change="monthTimeChange"></mu-date-input>
    </div>
    <van-popup class="azm-date-popup" v-model="popupShow" position="bottom" @click-overlay="clickOverlay">
      <mu-flex class="flex-wrapper popup-header van-hairline--bottom" justify-content="start">
        <mu-flex fill justify-content="start" class="azm-cancel" @click="clickOverlay">
          <span>取消</span>
        </mu-flex>
        <mu-flex fill justify-content="end" class="azm-confirm" @click="datePopupConfirm">
          <span>完成</span>
        </mu-flex>
      </mu-flex>
      <mu-button flat color="primary" @click="popupType=!popupType">
        <span>{{!popupType ? '按日切换' : "按月切换"}}&nbsp;</span>
        <span class="iconfont icon-left" style="font-size: 12px"></span>
      </mu-button>
      <template v-if="popupType">
        <mu-flex class="flex-wrapper popup-dateTime" justify-content="start">
          <mu-flex fill justify-content="center" @click="dateTimeStatus = true">
            <span>{{startTime | dateFormat('YYYY-MM-DD')}}</span>
          </mu-flex>
          <mu-flex justify-content="center">
            <span>至</span>
          </mu-flex>
          <mu-flex fill justify-content="center" @click="dateTimeStatus = false">
            <span v-if="endTime">{{endTime | dateFormat('YYYY-MM-DD')}}</span>
            <span v-else>结束时间</span>
          </mu-flex>
        </mu-flex>
        <div class="azm-date-select">
          <mu-slide-left-transition>
            <van-datetime-picker v-show="dateTimeStatus" v-model="startTime" type="date" :max-date="maxTime"/>
          </mu-slide-left-transition>
          <mu-slide-right-transition>
            <van-datetime-picker v-show="!dateTimeStatus" v-model="endTime" type="date" :min-date="startTime"
                                 :max-date="maxTime"/>
          </mu-slide-right-transition>
        </div>
      </template>
      <template v-else>
        <van-datetime-picker v-model="monthTime" type="year-month" :max-date="maxTime"/>
      </template>
    </van-popup>
    <div class="azm-top">
      <mu-flex class="flex-wrapper" justify-content="start">
        <mu-flex justify-content="start" class="azm-dateTime">
          <template v-if="dateType === 1">
            <template v-if="dateTime[0].toDateString() === new Date().toDateString()">
              <span>今日</span>
            </template>
            <template v-else-if="+dateTime[0] === +dateTime[1]">
              <span>{{dateTime[0] | dateFormat('YYYY.MM.DD')}}</span>
            </template>
            <span v-else>{{dateTime[0] | dateFormat('YYYY.MM.DD')}} - {{dateTime[1] | dateFormat('YYYY.MM.DD')}}</span>
          </template>
          <template v-else-if="dateType === 2">
            <span>{{dateTime[0] | dateFormat('YYYY-MM')}}</span>
          </template>
          <template v-else-if="dateType === 3">
            <span>本周</span>
          </template>
          <template v-else>
            <span>本月</span>
          </template>
        </mu-flex>
        <mu-flex fill class="azm-NoticeBar-box">
          <van-notice-bar class="azm-NoticeBar" :text="label"/>
        </mu-flex>
        <mu-flex justify-content="end" class="azm-dateTime-btn" @click="popupShow = true">
          <span class="iconfont icon-icon-test4"></span>
        </mu-flex>
        <!--<mu-flex justify-content="end" class="azm-dateTime-btn">-->
        <!--<mu-menu cover placement="top-start" popover-class="azm-results-menu-box" :open.sync="azmMenuOpen">-->
        <!--<span class="iconfont icon-icon-test4"></span>-->
        <!--<mu-list slot="content">-->
        <!--<mu-list-item button @click.natice="bindMenuBtn(2)">-->
        <!--<mu-list-item-title>按月选择</mu-list-item-title>-->
        <!--</mu-list-item>-->
        <!--<mu-list-item button @click.natice="bindMenuBtn(1)">-->
        <!--<mu-list-item-title>按日选择</mu-list-item-title>-->
        <!--</mu-list-item>-->
        <!--<mu-list-item button @click.natice="bindMenuBtn">-->
        <!--<mu-list-item-title>本月</mu-list-item-title>-->
        <!--</mu-list-item>-->
        <!--</mu-list>-->
        <!--</mu-menu>-->
        <!--</mu-flex>-->
      </mu-flex>
    </div>
  </div>
</template>

<script>
  import{ NoticeBar, Popup, DatetimePicker }from"vant"
  import { DateInput, Menu } from 'muse-ui'
  import { Actionsheet, dateFormat } from 'vux'
  import { mapState } from 'vuex'
  export default {
    name: "azm-results-date-filter",
    components: {
      [NoticeBar.name]: NoticeBar,
      [Popup.name]: Popup,
      [DatetimePicker.name]: DatetimePicker,
      [DateInput.name]: DateInput,
      [Menu.name]: Menu,
      Actionsheet
    },
    updated() {

    },
    props: {
      value: Object,
      label: {
        type: String,
        default: ""
      },
      format: [Boolean, String]
    },
    data() {
      let toDay = new Date()
      return {
        toDay,
        toDayStr: dateFormat(toDay, "YYYY-MM-DD"),
        maxTime: toDay,
        azmMenuOpen: false,
        azmActionsheet: false,
        startTime: toDay,
        endTime: toDay,
        monthTime: toDay,
        dateType: 0,
        dateTime: [],
        actions: {
          menu1: '按月选择',
          menu2: '按日选择',
          menu3: '本月'
        },
        popupShow: false,
        popupType: false,
        dateTimeStatus: true
      }
    },
    computed: {
      ...mapState({})
    },
    created() {
      this.$nextTick(function () {
        let val = this.value;
        this.startTime = val.start_time;
        this.endTime = val.start_time || val.end_time;
        this.monthTime = val.start_time;
        this.dateType = val.type;
        this.dateTime = [this.startTime, this.endTime];
        this.$refs.endDateInput.closePicker = this.endClosePicker;
        this.$refs.monthDateInput.closePicker = this.closePicker;
        this.$refs.startDateInput.closePicker = this.closePicker;
      })
    },
    watch: {
      value: {
        handler: function (val) {
          if (val) {
            this.startTime = val.start_time;
            this.endTime = val.end_time || val.start_time;
            this.monthTime = val.start_time;
            this.dateType = val.type;
            if (val.type === 1) {
              this.popupType = true
            }
            this.dateTime = [this.startTime, this.endTime];
          }
        },
        deep: true
      }
    },

    methods: {
      /**
       * 取消
       */
      closePicker(){
        this.$refs.startDateInput.open = false
        this.$refs.endDateInput.open = false
        this.$refs.monthDateInput.open = false
        this.$emit('onCancel')
      },
      endClosePicker(e){
        this.$refs.endDateInput.open = false
        this.$refs.monthDateInput.open = false
        this.$emit('onCancel')
      },
      startTimeChange (e) {
        this.$refs.endDateInput.open = true
        this.endTime = this.startTime
      },
      endTimeChange () {
        let startTime = this.startTime
        let endTime = this.endTime
        this.dateTime = [startTime, endTime]
        this.dateType = 1
        this.dateChang()
      },
      monthTimeChange () {
        let monthTime = this.monthTime
        this.dateTime = [monthTime]
        this.dateType = 2
        this.dateChang()
      },
      bindMenuBtn (index) {
        if (index === 2) {
          this.$refs.monthDateInput.open = true
        } else if (index === 1) {
          this.$refs.startDateInput.open = true
        } else {
          let toDay = new Date()
          this.monthTime = toDay
          this.startTime = toDay
          this.endTime = toDay
          this.dateType = 0
          this.azmMenuOpen = false
        }
      },
      onActionsheetSelect(index){
        if (index === 'menu1') {
          this.$refs.monthDateInput.open = true
        } else if (index === 'menu2') {
          this.$refs.startDateInput.open = true
        } else if (index === 'menu3') {
          let toDay = new Date()
          this.monthTime = toDay
          this.startTime = toDay
          this.endTime = toDay
          this.dateType = 0
          this.azmMenuOpen = false
          this.dateChang()
        } else {
          this.$emit('onCancel')
        }
      },
      onActionsheetCancel(e){
        console.log(e)
        this.$emit('onCancel')
      },
      dateChang(){
        let dateType = this.dateType;
        let dateTime = this.dateTime;
        let format = this.format;
        if (dateType === 2 && dateTime.length > 0) {
          let month = dateFormat(dateTime[0], 'YYYY-MM')
          if (this.toDayStr.indexOf(month) > -1) {
            dateType = this.dateType = 0
          } else {
            dateType = this.dateType = 2
          }
        }
        this.value.type = dateType
        this.value.start_time = dateTime[0]
        this.value.end_time = dateTime[1]
        if (format && typeof format === 'boolean') {
          let start = dateFormat(dateTime[0], 'YYYY-MM-DD');
          let end = dateFormat(dateTime[1], 'YYYY-MM-DD');
          this.$emit('onChange', {type: dateType, start_time: start, end_time: end})
        } else if (format && typeof format === 'string') {
          let start = dateFormat(dateTime[0], format);
          let end = dateFormat(dateTime[1], format);
          this.$emit('onChange', {type: dateType, start_time: start, end_time: end})
        } else {
          this.$emit('onChange', this.value)
        }
      },
      clickOverlay(e){
        let val = this.value;
        this.popupShow = false
        this.startTime = val.start_time;
        this.endTime = val.end_time || val.start_time;
        this.monthTime = val.start_time;
        this.dateType = val.type;
        if (val.type === 1) {
          this.popupType = true
        }
        this.dateTimeStatus = true
        this.dateTime = [this.startTime, this.endTime];
        this.$emit('onCancel', e)
      },
      datePopupConfirm(){
        let popupType = this.popupType
        let monthTime = this.monthTime
        let startTime = this.startTime
        let endTime = this.endTime
        if (popupType) {
          this.dateType = 1
          let start = +new Date(startTime)
          let end = +new Date(endTime)
          if (start > end) {
            this.endTime = endTime = startTime
          }
          this.dateTime = [startTime, endTime]
        } else {
          this.dateType = 2
          this.dateTime = [monthTime]
        }
        this.dateTimeStatus = true
        this.popupShow = false;
        this.dateChang()
      }
    }
  };
</script>

<style scoped lang="less">
  .azm-results-date-filter {
    width: 100%;
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
    .azm-date-popup {
      .flex-wrapper {
        padding: 0 15px;
        box-sizing: border-box;
        text-align: center;
        height: 45px;
        line-height: 45px;
      }
      .azm-date-select {
        position: relative;
        min-height: 200px;
        .van-picker {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
    }
  }
</style>

<style lang="less">
  .azm-results-date-filter {
    .azm-date-popup {
      .van-hairline--top-bottom {
        display: none;
      }
    }
  }

</style>
