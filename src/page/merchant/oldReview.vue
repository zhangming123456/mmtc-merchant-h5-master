<template>
  <div class="azm-old-review">
    <van-cell-group class="azm-steps">
      <van-cell>
        <van-row type="flex">
          <van-col :span="8" class="azm-step azm-step--active">
            <p class="azm-step--icon">
              <img class="icon-active" src="../../assets/oldReview/icon_confirm@3x.png" alt="">
            </p>
            <p class="azm-step--text"><span>确认信息</span></p>
          </van-col>
          <van-col :span="8" class="azm-step" :class="{'azm-step--active':step>0}">
            <p class="azm-step--icon">
              <img src="../../assets/oldReview/icon_authentication_gray@3x.png" alt="">
              <img class="icon-active" src="../../assets/oldReview/icon_payment@3x.png" alt="">
            </p>
            <p class="azm-step--text"><span>审核支付</span></p>
          </van-col>
          <van-col :span="8" class="azm-step" :class="{'azm-step--active':step>1}">
            <p class="azm-step--icon">
              <img src="../../assets/oldReview/icon_authentication_gray@3x_26.png" alt="">
              <img class="icon-active" src="../../assets/oldReview/icon_authentication@3x.png" alt="">
            </p>
            <p class="azm-step--text"><span>认证成功</span></p>
          </van-col>
        </van-row>
      </van-cell>
    </van-cell-group>

    <template v-if="step === 0">
      <van-cell-group>
        <van-cell class="azm-setp--1">
          <div class="top">
            <p>店铺信息</p>
            <p>店铺名称：{{newShopData.shop_name}}</p>
            <p>主营业务：
              <span v-for="(item,index) in newShopData.major_business"
                    :key="index">{{index > 0 ? "、" : ''}}{{item.title}}</span>
            </p>
            <p>所在地址：{{newShopData.address}}{{newShopData.position}}</p>
            <p>营业执照注册号：{{merchantData.license_code}}</p>
          </div>
          <div class="footer">
            <p>负责人信息</p>
            <p>姓名：{{merchantData.legal_username}}</p>
            <p>电话：{{newShopData.service_phone | strHide_filter}}</p>
            <p>身份证号：{{merchantData.legal_identity | strHide_filter}}</p>
          </div>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="azm-mar--bottom">
        <van-field label="推荐码" v-model="merchantData.discount_code" maxlength="11" type="tel"
                   placeholder="有则填写"></van-field>
      </van-cell-group>
      <div class="azm-footer">
        <van-button class="azm-btn" @click.native="bindSubmit">确&nbsp;定</van-button>
        <p>若内容有变请致电<a href="tel:400-184-8008">400-184-8008</a>修改</p>
      </div>
    </template>

    <template v-else-if="step === 1">
      <van-cell-group>
        <van-cell title="使用费（1年）">
          <span class="azm-money">300元</span>
          <span class="azm-line--money">原价3980元</span>
        </van-cell>
      </van-cell-group>
      <van-button class="azm-btn" @click.native="shopToPay(shoploginData.id)">立&nbsp;即&nbsp;支&nbsp;付</van-button>
      <div class="azm-footer" @click="show = !show">支付表示您同意<span>《美美天成商户补充细则V0.1》</span></div>
    </template>
    <template v-else>
      <azm-not-more type="notMore4" class="azm-not-more"></azm-not-more>
    </template>

    <van-popup v-model="show" class="azm-popup">
      <van-cell-group>
        <van-cell class="azm-title">
          <p>美美天成平台年度审核通知细则</p>
        </van-cell>
        <van-cell>
          <view-box>
            <p> 1、平台5%交易佣金不再收取，只会扣取0.6%的第三方支付平台微信支付、支付宝支付的手续费，平台不收取任何费用</p>
            <p>2、为了给您和消费者提供更佳的服务，平台每年会进行例行认证</p>
            <p>3、支付审核费用后，以支付时间为起始时间，一年为一次审核周期。同时此前商户与平台所签协议时间自动默认更改为支付时间</p>
            <p>4、完成流程后，您将获得美美天成商家端所有功能的使用权</p>
            <p>5、此细则将作为《美美天成商户合作协议》的补充协议附则</p>
            <p>大标题：美美天成平台美业商户 第三方认证审核通知</p>
            <p>小描述：为了更好的为您和消费者服务，平台现进行第三方机构</p>
            <p>认证及平台升级，感谢您的积极配合!</p>
          </view-box>
        </van-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
  import { Cell, CellGroup, Row, Col, Field, Button, Popup } from 'vant'
  import { ViewBox } from 'vux'
  import NotMore from '../../view-render/not-more.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      ViewBox,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Row.name]: Row,
      [Col.name]: Col,
      [Field.name]: Field,
      [Button.name]: Button,
      [NotMore.name]: NotMore,
      [Popup.name]: Popup,
    },
    computed: {
      ...mapState({
        shoploginData: state => state.merchant.shoploginData,
        newShopData: state => state.merchant.newShopData,
        merchantData: state => state.merchant.merchantData,
        $location: state => state.ApiService.$location
      })
    },
    data () {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        step: 0,
        discount_code: '',
        show: false,
      };
    },
    watch: {
      [`shoploginData.id`] (n, o) {
        this.setStep()
      }
    },
    created () {
      let id = this.$route.query.id;
      let that = this;
      that.$ajax.getShopVerifyStatus({id}).finally(res => {
        if (res.status !== 1) {
          that.$vux.alert.show({
            title: '温馨提示',
            content: `error: ${res.msg}`,
            onHide () {
              that.$router.replace('/merchant_register');
            }
          })
        } else if (res.status === 1) {
          that.setStep();
        }
      })
    },
    methods: {
      setStep () {
        let step = 0,
          shoploginData = this.shoploginData;
        if (!shoploginData.id) return;
        this.step = (+shoploginData.step === 0 && +shoploginData.auth_status === 2 && +shoploginData.is_examine === 1) ? 2 : 0;
      },
      bindSubmit () {
        let that = this, id = that.shoploginData.id, discount_code = that.merchantData.discount_code;
        if (!id && !discount_code) return;
        that.$store.dispatch("ApiService/shop2edit_discount_code", {id, discount_code}).finally(
          res => {
            if (1 === res.status) {
              that.step++
            } else {
              that.$vux.toast.text(res.msg || '保存失败')
            }
          });
      },
      shopToPay (id) {
        if (!id) return
        let sessionId = `PHPSESSID=${this.$azm.cookie.get('PHPSESSID')}`
        this.$azm.util.Native.shopToPay({id, sessionId})
      }
    }
  };
</script>


<style scoped lang='less'>
  .azm-old-review {
    .van-cell-group:not(:nth-child(1)) {
      margin-top: 10px;
    }
    .azm-steps {
      .azm-step {
        p {
          position: relative;
          text-align: center;
          &.azm-step--icon {
            height: 45px;
            img {
              position: absolute;
              width: 45px;
              height: auto;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
              background-color: #fff;
            }
          }
        }
        p.azm-step--text {
          font-size: 13px;
          margin-top: 5px;
          color: #d4d4d4;
        }
        &:not(:nth-child(1)) {
          p.azm-step--icon {
            &::after {
              position: absolute;
              content: " ";
              width: 100%;
              height: 1.2px;
              left: -50%;
              top: 50%;
              background-color: #d4d4d4;
              transform: translate(0, -50%);
              z-index: 0;
            }
            img.icon-active {
              display: none;
            }
          }
        }
        &.azm-step--active {
          &:not(:nth-child(1)) {
            p.azm-step--icon {
              &::after {
                background-color: #449fff;
              }
              img {
                display: none;
                &.icon-active {
                  display: inline-block;
                }
              }
            }
          }

          p.azm-step--text {
            color: #449fff;
          }
        }
      }

    }
    .azm-setp--1 {
      .van-cell__value > div {
        > p {
          font-size: 15px;
          color: #282828;
          padding-bottom: 5px;
          &:not(:nth-child(1)) {
            font-size: 13px;
            color: #999999;
          }
        }
        &:not(:nth-child(1)) {
          margin-top: 15px;

        }
      }
    }
    .azm-not-more {
      margin-top: 40px;
    }
    .azm-btn {
      display: block;
      width: 690/2px;
      height: 90/2px;
      background-image: linear-gradient(-90deg, #3d70f7 0%, #35abfe 100%);
      background-blend-mode: normal, normal;
      border-radius: 45/2px;
      color: #ffffff;
      font-size: 32/2px;
      margin: 100/2px auto;
    }
    .azm-money {
      font-size: 18px;
      color: #ff4919;
    }
    .azm-line--money {
      font-size: 12px;
      color: #999999;
      text-decoration: line-through;
    }
    div.azm-footer {
      position: fixed;
      width: 100%;
      bottom: 20px;
      text-align: center;
      color: rgba(102, 102, 102, 0.6);
      a {
        color: rgba(0, 140, 240, 0.6);
      }
      span {
        color: #008cf0;
      }
      .azm-btn {
        margin: 0 auto 30px;
      }
    }
    .azm-mar--bottom {
      margin-bottom: 114px;
    }
    .azm-popup {
      position: relative;
      width: 280px;
      border-radius: 10px;
      .van-cell {
        max-height: 320px;
        p {
          font-size: 12px;
          color: #999999;
        }
        &:after {
          left: 0;
        }
      }
      .azm-title p {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: #282828;
      }

    }
  }
</style>





