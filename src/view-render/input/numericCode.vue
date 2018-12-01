<template>
  <mu-dialog class="azm-numericCode maxWidth500" transition="slide-bottom" fullscreen
             :open.sync="showKeyboard" :overlayClos="false">
    <div class="password-input" v-if="type === 'countdown'">
      <van-icon class="azm-password-input-clear" name="clear" @click="destroy"/>
      <p class="password-input-title">进入支付前请验证手机号</p>
      <ul class="clearfix password-input-telephone">
        <li class="input-left">{{countdown.telephone}}</li>
        <li class="input-right" :class="{'active':countdown.start}">
          <template v-if="countdown.start">
            <span>重发</span>
            <v-countdown v-model="countdown.time" :start="countdown.start" @on-finish="countdown.finish"></v-countdown>
            <span>s</span>
          </template>
          <span v-else @click="onResend">获取验证码</span>
        </li>
      </ul>

      <div class="van-password-input">
        <ul class="van-hairline--surround van-password-input__security">
          <li class="van-hairline" v-for="(item,index) in numberLength">
            <i :style="{visibility:value.split('')[index]>-1?'visible':'hidden'}" v-if="!show"></i>
            <span v-else
                  :style="{visibility:value.split('')[index]>-1?'visible':'hidden'}">{{value.split('')[index]}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 数字键盘 -->
    <van-number-keyboard class="maxWidth500" style="margin: 0 auto;left: auto;" :show="showKeyboard" @input="onInput"
                         @delete="onDelete"/>
  </mu-dialog>
</template>

<script>
  import { Countdown } from 'vux'
  import { PasswordInput, NumberKeyboard, Icon } from 'vant'
  import { mapState } from 'vuex'

  const COUNTDOWN = {
    telephone: '',
    time: 60,
    start: false,
    finish: function () {
      this.start = false;
      this.time = 60
    },
    keyMethodEnd: null,
    requestMethod: null
  }

  const Data = {
    value: '',
    showKeyboard: false,
    numberLength: 4,
    isSubmit: false
  }

  export default {
    name: "numeric-code",
    components: {
      'v-countdown': Countdown,
      [NumberKeyboard.name]: NumberKeyboard,
      [PasswordInput.name]: PasswordInput,
      [Icon.name]: Icon,
    },
    props: {
      show: {
        type: Boolean,
        default: function () {
          return true;
        }
      },
      type: {
        type: String,
        default: 'countdown'
      },
    },
    data () {
      return {
        ...Data,
        countdown: {...COUNTDOWN}
      }
    },
    watch: {
      showKeyboard (n) {
        if (!n) {
          this.value = ''
        }
      }
    },
    computed: {
      ...mapState({})
    },
    inject: [],
    created () {
    },
    methods: {
      countdownStartUp ({val, finish, requestMethod, keyMethodEnd}, time = 60) {
        let that = this;
        that.countdown.telephone = val;
        that.countdown.requestMethod = requestMethod;
        if (that.util.isFunction(requestMethod) && !that.countdown.start) {
          const P = requestMethod();
          P.finally && P.finally(({status, info, msg} = {}) => {
            that.$vux.loading.hide();
            if (status === 1 || status === 2000) {
              if (typeof info === 'string') {
                time = parseInt(info);
                that.$toast.message(`请${time}后重试~`);
              }
              that.showKeyboard = true;
              that.countdown.time = time;
              that.countdown.start = true;
            }
          })
        } else {
          that.showKeyboard = true;
        }
        that.countdown.finish = function () {
          that.countdown.start = false;
          that.countdown.time = time;
          finish && finish();
        };
        that.countdown.keyMethodEnd = keyMethodEnd
      },
      onResend () {
        let countdown = this.countdown;
        let that = this;
        this.value = '';
        if (countdown.requestMethod) {
          const P = countdown.requestMethod();
          P.finally && P.finally(({status} = {}) => {
            that.$vux.loading.hide();
            if (status === 1) {
              countdown.time = 60;
              countdown.start = true;
            }
          })
        }
        this.$emit('Resend')
      },
      onInput (key) {
        let that = this
        let len = that.numberLength
        this.value = (that.value + key).slice(0, len);
        if (that.value.length === len && that.showKeyboard && !that.isSubmit) {
          that.isSubmit = true;
          switch (true) {
            case that.type === 'countdown':
              let P = that.countdown.keyMethodEnd && that.countdown.keyMethodEnd(that.value);
              if (typeof P === 'boolean' && P === true) {
                that.destroy();
              } else if (P && P.finally) {
                P.finally(({status} = {}) => {
                  if (status === 1) {
                    that.destroy();
                  }
                })
              }
          }
        }
      },
      onDelete () {
        if (this.numberLength === this.value.length) {
          this.value = '';
          this.isSubmit = false;
        } else {
          this.value = this.value.slice(0, this.value.length - 1);
        }
      },
      destroy () {
        this.countdown = {...COUNTDOWN}
        for (let k in Data) {
          this[k] = Data[k]
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-numericCode {
    width: 100%;
    margin: 0 auto;
    .password-input {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 20px;
      width: 84%;
      height: 37%;
      background-color: #fff;
      z-index: 1000;
      padding: 20px 20px;
      box-sizing: border-box;
      .azm-password-input-clear {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #fff;
        border-radius: 100%;
        font-size: 30px;
        padding: 0;
        margin: 0;
        transform: translate(50%, -50%);
        line-height: 1;
        color: #2d81e4;
      }
      .password-input-title {
        font-family: PingFangSC-Medium;
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 17px;
        color: #171F24;
        font-weight: 500;
        line-height: 24px;
      }
      .van-password-input {
        margin: 0;
      }
      .password-input-telephone {
        display: flex;
        margin-bottom: 8px;
        li {
          flex: 1;
        }
        .input-left {
          font-size: 14px;
          color: #333333;
        }
        .input-right {
          text-align: right;
          font-size: 14px;
          color: #2D81E4;
          &.active {
            color: #999999;
          }
        }
      }
      .van-password-input__security {
        text-align: center;
        line-height: 50px;
        border-color: #DDDDDD;
        border-radius: 10px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.6);
        span {
          vertical-align: middle;
        }
      }
    }
  }
</style>
<style lang="less">
  .azm-numericCode {
    .mu-dialog-body {
      height: 100%;
      width: 100%;
    }
    .mu-dialog {
      background-color: transparent;
    }
  }
</style>
