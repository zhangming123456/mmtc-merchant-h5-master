<template>
  <div class="t-identityCard">
    <van-cell-group class="t-fillContent ">
      <van-cell class="t-example" title="身份证件" is-link value="查看示例" to="/merchant_sfzsample"></van-cell>
      <van-cell class="t-addPicture">
        <van-row type="flex">
          <van-col :span="12" @click.native="bingImg(1)">
            <div class="t-just" v-if="front_identity">
              <azm-avatar :src="front_identity" height="103"></azm-avatar>
            </div>
            <div class="t-just" v-else>
              <img src="../../assets/cooperation-icon/11_icon_just.png" alt="">
              <img class="t-icon_add" src="../../assets/cooperation-icon/11_icon_add.png" alt="">
            </div>
            <p class="t-just--text">正面</p>
          </van-col>
          <van-col :span="12" @click.native="bingImg(2)">
            <div class="t-just" v-if="end_identity">
              <azm-avatar :src="end_identity" height="103"></azm-avatar>
            </div>
            <div class="t-just" v-else>
              <img src="../../assets/cooperation-icon/11_icon_back.png" alt="">
              <img class="t-icon_add" src="../../assets/cooperation-icon/11_icon_add.png" alt="">
            </div>
            <p class="t-just--text">反面</p>
          </van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
    <group class="azm-idcard">
      <x-input class="t-importNumber" v-model="legal_identity" :is-type="isIDCard" :min="18" :max="18"
               placeholder="身份证号码"></x-input>
    </group>
    <azm-crop-image ref="cropImage" id="imgUploader" :autoUpload="true" :isCrop="true"></azm-crop-image>
    <!-- button -->
    <van-button class="t-button" @click.native="bindSubmit">确&nbsp;定</van-button>
  </div>
</template>

<script>
  import { Cell, CellGroup, Button, Row, Col } from "vant";
  import { XInput, Group } from 'vux'
  import { mapState } from 'vuex'
  import Avatar from '../../components/avatar/index.vue'
  import cropImage from '../../view-render/crop-image';

  export default {
    components: {
      XInput,
      Group,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
      [Avatar.name]: Avatar,
      [cropImage.name]: cropImage,
    },
    computed: {
      ...mapState({
        merchantData: state => state.merchant.merchantData,
        $location: state => state.ApiService.$location
      })
    },
    data () {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        front_identity: '',
        end_identity: '',
        legal_identity: ''
      };
    },
    created () {
      this.legal_identity = this.merchantData.legal_identity
      this.front_identity = this.merchantData.front_identity
      this.end_identity = this.merchantData.end_identity
    },
    methods: {
      bingImg (index) {
        let that = this;
        this.$azm.util.Native.chooseImage({zoom: 1, crop: 1, aspectRatio: '16:10'}).finally(res => {
          if (res.status === 1 && index === 1) {
            that.front_identity = res.info.img
          } else if (res.status === 1 && index === 2) {
            that.end_identity = res.info.img
          } else {
            that.$refs.cropImage.chooseCrop({
              aspectRatio: 16 / 10,
              success (data) {
                if (data && data.url) {
                  if (index === 1) {
                    that.front_identity = data.url
                  } else {
                    that.end_identity = data.url
                  }
                }
              },
              cancel () {

              }
            })
          }
        })
      },
      isIDCard (value) {
        let that = this, IsIDcard = that.$azm.util.regExp.IsIDcard
        if (IsIDcard.test(value)) {
          return {valid: true}
        } else {
          return {valid: false, msg: '身份证号码格式不正确'}
        }
      },
      bindSubmit () {
        let regExp = this.$azm.util.regExp;
        if (!this.legal_identity) {
          this.$toast.error('身份证号码格式不能为空~')
          return;
        }
        if (this.legal_identity && !regExp.IsIDcard.test(this.legal_identity)) {
          this.$toast.error('身份证号码格式不正确~')
          return;
        }
        if (!this.front_identity || !this.end_identity) {
          this.$toast.error('身份证照不能为空~')
          return;
        }
        this.merchantData.legal_identity = this.legal_identity
        this.merchantData.front_identity = this.front_identity
        this.merchantData.end_identity = this.end_identity
        this.$router.back()
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-identityCard {
    input {
      border: 0;
    }

    button {
      border: 0;
    }
    .t-fillContent {
      background-color: #ffffff;
      margin-top: 20/2px;
      .t-addPicture {
        display: flex;
        padding: 30/2px;
        background-color: #ffffff;
        &:after {
          left: 15px;
          right: 15px;
        }
        .van-col {
          box-sizing: border-box;
          &:nth-child(1) {
            padding-right: 10px;
          }
          &:nth-child(2) {
            padding-left: 10px;
          }
        }
        .t-just {
          position: relative;
          box-sizing: border-box;
          > img {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 10/2px;
            &.t-icon_add {
              position: absolute;
              width: 50/2px;
              height: auto;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .t-just--text {
          font-size: 14px;
          color: #ff4919;
          text-align: center;
          padding-top: 10px;
        }
      }

      .t-importNumber {
        width: 100%;
        &:before {
          border-width: 0;
        }
      }
    }

    .t-button {
      position: fixed;
      width: 690/2px;
      height: 45px;
      line-height: 43px;
      background-image: linear-gradient(270deg, #3d70f7 0%, #35abfe 100%),
      linear-gradient(#008cf0, #008cf0);
      background-blend-mode: normal, normal;
      border-radius: 45/2px;
      color: #ffffff;
      font-size: 32/2px;
      bottom: 20/2px;
      left: 50%;
      transform: translate(-50%, 0);
      &.van-button--disabled {
        background-image: none;
        background-color: #ccc;
      }
    }
  }
</style>


<style lang='less'>
  .t-identityCard {
    .t-fillContent {
      .van-hairline--top-bottom::after {
        border: 0;
      }
      .t-example {
        padding-bottom: 0;
        &:after {
          border-width: 0;
        }
        .van-cell__title {
          font-size: 32/2px;
        }
        .van-cell__right-icon {
          color: #ff4919;
        }
        .van-cell__value {
          color: #ff4919;
        }
      }
    }
    .azm-idcard {
      .weui-cells {
        margin-top: 0;
        &::before {
          height: 0;
          border-width: 0;
        }
        .t-importNumber {
          font-size: 12px;
        }
      }
    }
  }
</style>
