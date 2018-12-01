<template>
  <div class="t-enter">
    <!-- 已提交待交付 -->
    <div v-if="+shoploginData.step === 3 && +shoploginData.isPay_azm === 0">
      <div class="t-progress">
        <div class="t-title">
          <span class="t-textColor">认领商家</span>
          <span class="t-textColor">提交认证</span>
          <span class="t-textColor">提交认证</span>
          <span>入驻成功</span>
        </div>
        <div class="t-stateForm">
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/14_percess_icon_stay.png" alt="">
          <span class="t-active"></span>
          <img src="../../assets/cooperation-icon/14_process_icon_normal.png" alt="">
        </div>
        <div class="t-state">
          <span class="t-textColor">已认领</span>
          <span class="t-textColor">已提交</span>
          <span>待付费</span>
          <span>待审核</span>
        </div>
      </div>
      <div class="t-pay">
        <span>使用费（1年）</span>
        <div class="t-money">
          <span class="t-price">300元</span>
          <span class="t-original">原价3980元</span>
        </div>
      </div>
      <van-button class="t-button" @click.native="shopToPay(shoploginData.id)">立&nbsp;即&nbsp;支&nbsp;付</van-button>
    </div>
    <!--支付中-->
    <div v-else-if="+shoploginData.step === 4 && +shoploginData.isPay_azm === 10">
      <div class="t-progress">
        <div class="t-title">
          <span class="t-textColor">认领商家</span>
          <span class="t-textColor">提交认证</span>
          <span class="t-textColor">提交认证</span>
          <span>入驻成功</span>
        </div>
        <div class="t-stateForm">
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/14_percess_icon_stay.png" alt="">
          <span class="t-active"></span>
          <img src="../../assets/cooperation-icon/14_process_icon_normal.png" alt="">
        </div>
        <div class="t-state">
          <span class="t-textColor">已认领</span>
          <span class="t-textColor">已提交</span>
          <span>支付中</span>
          <span>待审核</span>
        </div>
      </div>
      <div class="t-pay">
        <span>使用费（1年）</span>
        <div class="t-money">
          <span class="t-price">300元</span>
          <span class="t-original">原价3980元</span>
        </div>
      </div>
      <van-button class="t-button" @click.native="getPaymentsStatus">刷&nbsp;新</van-button>
    </div>
    <!-- 审核通过 -->
    <div v-else-if="+shoploginData.step === 4 && +shoploginData.auth_status === 2">
      <div class="t-progress">
        <div class="t-title">
          <span class="t-textColor">认领商家</span>
          <span class="t-textColor">提交认证</span>
          <span class="t-textColor">支付费用</span>
          <span class="t-textColor">入驻成功</span>
        </div>
        <div class="t-stateForm">
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
        </div>
        <div class="t-state">
          <span class="t-textColor">已认领</span>
          <span class="t-textColor">已提交</span>
          <span class="t-textColor t-mr">已付费</span>
          <span class="">审核通过</span>
        </div>
      </div>
      <div class="t-succeed">
        <img src="../../assets/cooperation-icon/26_success.png" alt="">
        <span class="t-span">恭喜，您已成功入驻美美天成，快快登录商家端完善信息吧！</span>
      </div>
      <van-button class="t-button" @click.native="shopToLogin">立&nbsp;即&nbsp;登&nbsp;录&nbsp;商&nbsp;家&nbsp;端</van-button>
    </div>
    <!-- 审核未通过 -->
    <div v-else-if="+shoploginData.step === 4 && +shoploginData.auth_status === 3">
      <div class="t-progress">
        <div class="t-title">
          <span class="t-textColor">认领商家</span>
          <span class="t-textColor">提交认证</span>
          <span class="t-textColor">支付费用</span>
          <span class="t-textColor">入驻成功</span>
        </div>
        <div class="t-stateForm">
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/14_process_icon_fork.png" alt="">
        </div>
        <div class="t-state">
          <span class="t-textColor">已认领</span>
          <span class="t-textColor">已提交</span>
          <span class="t-textColor t-mr">已付费</span>
          <span class="">审核不通过</span>
        </div>
      </div>
      <div class="t-noPass">
        <p>您好，审核不通过，以下为可能原因，您也可以联系对接商务经理或拨打400-184-8008：</p>
        <div class="t-cause">
          <div class="t-causeContent">
            <span class="t-num">1</span>
            <span>身份证照片不清晰。</span>
          </div>
          <div class="t-causeContent">
            <span class="t-num">2</span>
            <span>营业执照名称与店名不符。</span>
          </div>
        </div>
      </div>
      <van-button class="t-button" @click.native="toAddShop">
        前&nbsp;往&nbsp;修&nbsp;改&nbsp;信&nbsp;息
      </van-button>
    </div>
    <!-- 上传认证资料保存成功 -->
    <div v-else-if="false">
      <div class="t-succeed">
        <img src="../../assets/cooperation-icon/26_success.png" alt="">
        <span class="t-span">保存成功</span>
        <span class="t-span">再提交认证认证资料就完成上线准备啦~</span>
      </div>
      <van-button class="t-button">上&nbsp;传&nbsp;认&nbsp;证&nbsp;资&nbsp;料</van-button>
    </div>
    <!-- 入住成功审核中的状态 -->
    <div v-else>
      <div class="t-progress">
        <div class="t-title">
          <span class="t-textColor">认领商家</span>
          <span class="t-textColor">提交认证</span>
          <span class="t-textColor">支付费用</span>
          <span class="t-textColor">入驻成功</span>
        </div>
        <div class="t-stateForm">
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/icon_1.png" alt="">
          <span></span>
          <img src="../../assets/cooperation-icon/14_percess_icon_stay.png" alt="">
        </div>
        <div class="t-state">
          <span class="t-textColor">已认领</span>
          <span class="t-textColor">已提交</span>
          <span class="t-textColor">已付费</span>
          <span>审核中</span>
        </div>
      </div>
      <div class="t-succeed">
        <img src="../../assets/cooperation-icon/14_audit.png" alt="">
        <span class="t-span">美美天成已收到您的资料啦，预计1-2</span>
        <span class="t-span">个工作日内完成审核~</span>
      </div>

    </div>
  </div>
</template>

<script>
  import { Button } from 'vant'
  import { mapState } from 'vuex'

  export default {
    components: {
      [Button.name]: Button
    },
    data () {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        auth_status: 0
      };
    },
    computed: {
      ...mapState({
        shoploginData: state => state.merchant.shoploginData,
        merchantData: state => state.merchant.merchantData,
        newShopData: state => state.merchant.newShopData,
        $location: state => state.ApiService.$location
      })
    },
    created () {
      this.getShopVerifyStatus();
    },
    methods: {
      getShopVerifyStatus () {
        let that = this;
        let id = this.$route.query.id;
        that.$store.commit("merchant/clearMerchantData");
        if (id) {
          that.$ajax.getShopVerifyStatus({id}).finally(({status, info, msg} = {}) => {
            if (status === 1) {
              if (+info.step === 4) {
                that.getPaymentsStatus()
              }
            } else {
              that.$vux.alert.show({
                title: '温馨提示',
                content: `error: ${msg}`,
                onHide () {

                }
              })
            }
          })
        }
      },
      getPaymentsStatus () {
        let that = this;
        let id = that.$route.query.id;
        if (!id) return;
        that.$vux.loading.show({
          text: "刷新中..."
        });
        that.$store.dispatch('ApiService/payCheckOrder', {id}).finally(res => {
          that.$vux.loading.hide();
          if (10 === +res.status || 11 === +res.status) {
            that.shoploginData.isPay_azm = res.status
          } else {
            that.$toast.error(res.msg)
          }
        })
      },
      shopToPay (id) {
        let that = this;
        if (!id) return;
        let sessionId = `PHPSESSID=${this.$azm.cookie.get('PHPSESSID')}`
        that.$azm.util.Native.shopToPay({id, sessionId}).finally(res => {
          if (res.status === 0) {
            that.$router.push({path: 'https://app.mmtcapp.com'})
          }
        })
      },
      shopToLogin () {
        let that = this;
        this.$azm.util.Native.shopToLogin()
      },
      toAddShop () {
        let id = this.$route.query.id
        this.$router.replace({path: '/merchant_addShop', query: {id}})
      }
    }
  };
</script>


<style scoped lang='less'>
  .t-enter {
    button {
      border: 0;
    }
    .t-progress {
      padding-left: 40/2px;
      padding-top: 30/2px;
      padding-bottom: 30/2px;
      background-color: #ffffff;
      .t-title {
        display: flex;
        font-size: 28/2px;
        > span {
          margin-right: 75/2px;
          &:last-child {
            margin-right: 0;
          }
        }
        .t-textColor {
          color: #ff4919;
        }
      }
      .t-stateForm {
        display: flex;
        align-items: center;
        margin-left: 36/2px;
        margin-top: 30/2px;
        > img {
          width: 30/2px;
          height: 30/2px;
        }
        > span {
          width: 157/2px;
          height: 2px;
          border: solid 2/2px #ff4919;
        }
        .t-active {
          border: solid 2/2px #cccccc;
        }
      }
      .t-state {
        display: flex;
        font-size: 24/2px;
        margin-left: 15/2px;
        margin-top: 20/2px;
        > span {
          margin-right: 117/2px;
          &:last-child {
            margin-right: 0;
          }
        }
        .t-textColor {
          color: #999999;
        }
        .t-mr {
          margin-right: 95/2px;
        }
      }
    }

    // 支付状态
    .t-pay {
      margin-top: 20/2px;
      height: 120/2px;
      background: #ffffff;
      display: flex;
      align-items: center;
      padding-left: 30/2px;
      padding-right: 30/2px;
      justify-content: space-between;
      > span {
        font-size: 32/2px;
      }
      .t-money {
        .t-price {
          font-size: 36/2px;
          color: #ff4919;
          margin-right: 22/2px;
        }
        .t-original {
          text-decoration: line-through;
          font-size: 24/2px;
          color: #999999;
        }
      }
    }

    // 审核不通过状态
    .t-noPass {
      margin-left: 30/2px;
      margin-right: 30/2px;
      margin-top: 40/2px;
      > p {
        font-size: 28/2px;
        color: #666666;
        margin-bottom: 40/2px;
      }
      .t-cause {
        background-color: #ffffff;
        padding: 30/2px;
        .t-causeContent {
          display: flex;
          align-items: center;
          margin-bottom: 20/2px;
          &:last-child {
            margin-bottom: 0;
          }
          .t-num {
            width: 30/2px;
            height: 30/2px;
            background-color: #39adff;
            border-radius: 50%;
            display: block;
            text-align: center;
            line-height: 30/2px;
            color: #ffffff;
            font-size: 24/2px;
            margin-right: 22/2px;
          }
          > span {
            font-size: 28/2px;
            color: #666666;
          }
        }
      }
    }

    // 成功的状态
    .t-succeed {
      text-align: center;
      margin-top: 78/2px;
      > img {
        width: 348/2px;
        height: 305/2px;
        margin-bottom: 70/2px;
      }
      .t-span {
        font-size: 28/2px;
        color: #666666;
        display: block;
      }
    }

    .t-button {
      width: 690/2px;
      height: 90/2px;
      background-image: linear-gradient(270deg, #3d70f7 0%, #35abfe 100%),
      linear-gradient(#008cf0, #008cf0);
      background-blend-mode: normal, normal;
      border-radius: 45/2px;
      color: #ffffff;
      font-size: 32/2px;
      margin-top: 100/2px;
      margin-left: 30/2px;
    }
  }
</style>





