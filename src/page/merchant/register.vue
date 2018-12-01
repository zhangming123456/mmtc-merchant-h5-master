<template>
  <div class="t-login">
    <div class="t-login_list">
      <x-input class="t-auth_input" type="tel" v-model="telephone" :max="11" is-type="china-mobile" required
               placeholder="请输入绑定手机号"></x-input>
      <div :class="countdown.show?'t-auth_text_gray':'t-auth_text'" @click="getAuthCode">
        <span v-if="countdown.show">
          重新获取<countdown v-model="countdown.time" @on-finish="finish"></countdown>s
        </span>
        <span v-else>获取验证码</span>
      </div>
    </div>
    <div class="">
      <x-input class="t-importCode" :min="4" :max="4" v-model="code" type="tel" placeholder="输入验证码" required></x-input>
    </div>
    <div class="t-passwordInput">
      <x-input ref="pwdInput" v-model="pwd" :type="ifDisplay?'email':'password'" placeholder="请输入8-16位密码"
               class="t-Password" :is-type="bindIsPwd" required autocomplete="off" autocapitalize="on" maxlength="16"
               maxLength="16"></x-input>
      <img src="../../assets/cooperation-icon/1_icon_close.png" v-show="!ifDisplay" @click="setDisplay">
      <img src="../../assets/cooperation-icon/1_icon_open.png" v-show="ifDisplay" @click="setDisplay">
    </div>
    <button class="t-button" @click="getTOLogin">确认</button>
  </div>
</template>

<script>
  import { XInput, Countdown } from 'vux'
  import config from "../../libs/config";
  import { regExp } from "../../libs/util";
  import { mapState } from 'vuex'

  export default {
    components: {
      XInput,
      Countdown
    },
    computed: {
      ...mapState({
        loginData: state => state.merchant.shoploginData,
        $location: state => state.vux.$location,
      })
    },
    data () {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        sendAuthCode: true,
        countdown: {
          show: false,
          time: 60,
        },
        auth_time: 0,
        username: "",
        pwd: "",
        ifDisplay: false,
        telephone: "",
        code: ""
      };
    },
    created () {
      let $ = this.$azm.Zepto
      this.$nextTick(function () {

      })
    },
    methods: {
      finish (index) {
        this.countdown.show = false
        this.countdown.time = 60
      },
      /**
       * 获取验证码
       **/
      getAuthCode () {
        let that = this;
        if (that.countdown.show && that.isGetAuthCode) return;
        that.isGetAuthCode = true;
        let telephone = that.telephone;
        if (!regExp.isPhone(telephone)) {
          that.$vux.toast.text("手机号码格式不正确~");
          return;
        }

        this.$store.dispatch("ApiService/register2SendSMS", {telephone}).finally(res => {
          that.isGetAuthCode = false;
          if (res.status === 0) {
            that.$vux.toast.text(res.msg);
          } else if (res.status === 1) {
            that.countdown.show = true;
          }
        });
      },
      setDisplay () {
        let $ = this.$azm.Zepto
        let that = this
        that.ifDisplay = !this.ifDisplay
      },
      /**
       * 确认按钮
       */
      getTOLogin () {
        let that = this,
          util = that.$azm.util,
          telephone = that.telephone,
          pwd = that.pwd,
          code = that.code;
        if (!regExp.isPhone(telephone)) {
          that.$vux.toast.text("手机号码格式不正确~");
          return;
        }

        if (!util.isNumberOfNaN(code) && code.length !== 4) {
          that.$vux.toast.text("验证格式不正确~");
          return;
        }

        if (!that.bindIsPwd(pwd).valid) {
          that.$vux.toast.text(that.bindIsPwd(pwd).msg);
          return;
        }

        this.$store.dispatch("ApiService/register2register", {telephone, code, pwd}).finally(res => {
          if (res.status === 1) {
            that.$vux.toast.text(res.msg || '注册成功')
            that.loginData.id = res.info.id
            that.loginData.step = res.info.step
            that.$router.push({path: "/merchant_addShop", query: {id: res.info.id, isRegister: 1}});
          } else {
            that.$vux.toast.text(res.msg);
          }
        });
      },
      clearPassword () {
        this.psd = "";
      },
      bindIsPwd (value) {
        let len = value.length
        if (len < 8 || len > 16) {
          return {valid: false, msg: '请输入8-16位密码~'}
        }
        let pwdReg = regExp.isPwd(value)
        if (pwdReg > 0) {
          return {valid: true}
        } else {
          return {valid: false, msg: '密码格式不正确~'}
        }
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-login {
    padding-left: 40/2px;
    padding-right: 40/2px;
    button {
      border: 0;
    }
    .t-login_list {
      width: 670/2px;
      height: 90/2px;
      border-radius: 5/2px;
      border: solid 1px #e5e5e5;
      display: flex;
      margin-top: 50/2px;
      background-color: #ffffff;
      align-items: center;
      margin-bottom: 30/2px;
      .t-auth_input {
        width: 470/2px;
        height: 100%;
        border: 0;
        font-size: 30/2px;
        padding-left: 30/2px;
        line-height: 90/2px;
      }
      .t-auth_text {
        width: 184/2px;
        height: 60/2px;
        border-radius: 5/2px;
        border: solid 1px #ff4919;
        text-align: center;
        line-height: 60/2px;
        display: block;
        color: #ff4919;
        font-size: 28/2px;
      }
      .t-auth_text_gray {
        width: 184/2px;
        height: 60/2px;
        border-radius: 5/2px;
        border: solid 1px #999999;
        text-align: center;
        line-height: 60/2px;
        display: block;
        color: #999999;
        font-size: 28/2px;
      }
    }
    .t-importCode {
      width: 670/2px;
      height: 90/2px;
      border-radius: 5/2px;
      border: solid 1px #e5e5e5;
      background-color: #ffffff;
      font-size: 30/2px;
      padding-left: 30/2px;
      margin-bottom: 20/2px;
    }

    .t-passwordInput {
      width: 670/2px;
      height: 90/2px;
      border-radius: 5/2px;
      border: solid 1px #e5e5e5;
      background-color: #ffffff;
      font-size: 28/2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .t-Password {
        height: 100%;
        border: 0;
        width: 100%;
        padding-left: 30/2px;
      }
      > img {
        width: 37/2px;
        height: 23/2px;
        margin-right: 41/2px;
      }
    }
    .t-button {
      width: 690/2px;
      height: 90/2px;
      font-size: 32/2px;
      background-image: linear-gradient(270deg, #3d70f7 0%, #35abfe 100%);
      color: #ffffff;
      border-radius: 45/2px;
      display: block;
      line-height: 90/2px;
      margin-top: 100/2px;
    }
  }
</style>
<style lang="less">
  .t-login {
    input {
      ime-mode: disabled;
    }
  }
</style>
