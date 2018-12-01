<template>
  <div class="t-shopAudit">
    <!-- 填写的内容 -->
    <van-cell-group class="t-fillContent">
      <van-field v-model="merchantData.license_name" clearable label="执照名称" placeholder="营业执照店铺名称"></van-field>
      <van-cell class="t-uploadingPicture">
        <van-row>
          <van-col class="t-businessPicture" @click.native="bingLicenseImg">
            <azm-avatar :src="merchantData.license_img" v-if="merchantData.license_img"></azm-avatar>
            <azm-avatar is-local img-type="img1" v-else></azm-avatar>
            <p>营业执照附件</p>
          </van-col>
          <van-col class="t-explain">
            <p>*注册名称与执照名称一致</p>
            <p>*证件需在有效期内</p>
            <p>*图片清晰且不多于1M</p>
            <router-link :to="{path:'/merchant_yyzzsample'}" class="t-lookExample">
              <span>查看示例<van-icon class="azm-icon" name="arrow"/></span>
            </router-link>
          </van-col>
        </van-row>
      </van-cell>
      <van-field v-model="merchantData.license_code" clearable label="注册号" placeholder="营业执照注册号"></van-field>
    </van-cell-group>

    <van-cell-group>
      <van-cell class="t-business" title="营业执照类型" is-link>
        <popup-picker class="azm-business--picker" :data="columns" placeholder="选择" :columns="2"
                      v-model="merchantData.license_type"
                      show-name></popup-picker>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="merchantData.legal_username" clearable label="负责人姓名" placeholder="填写负责人信息"></van-field>
      <x-input class="vux-1px-b azm-field" title="手机号码" mask="999 9999 9999" type="tel"
               v-model="merchantData.bindedphone"
               is-type="china-mobile" :min="11" :max="13" placeholder="手机账号（登录使用）"></x-input>
      <van-cell class="t-shopTime" title="负责人证件" is-link to="/merchant_idcardinfo">
        <span v-if="merchantData.legal_identity">{{merchantData.legal_identity | strHide_filter}}</span>
        <span v-else>选填</span>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="merchantData.discount_code" type="tel" maxlength="11" clearable label="推荐码"
                 placeholder="如替换则需填写"></van-field>
    </van-cell-group>

    <!-- 用户协议 -->
    <div class="t-agreement">
      <van-checkbox class="t-checked" v-model="checked">
        <span>我已阅读并同意</span>
        <router-link :to="{path:'/merchant_protocol'}">《美美天成入驻协议》</router-link>
      </van-checkbox>
    </div>

    <!--营业执照注册号选项弹窗-->
    <van-popup v-model="shopPopupBusiness_1" position="bottom">
      <van-picker :columns="columns" @change="onChange"/>
    </van-popup>

    <numeric-code ref="numericCode"></numeric-code>

    <azm-crop-image ref="cropImage" id="imgUploader" :autoUpload="true" :isCrop="true"></azm-crop-image>
    <!-- button -->
    <van-button class="t-button" :disabled="!checked" @click.native="bindSubmit">提&nbsp;交&nbsp;审&nbsp;核</van-button>
  </div>
</template>

<script>
  import {
    Cell,
    CellGroup,
    Checkbox,
    CheckboxGroup,
    Popup,
    Picker,
    Field,
    Row,
    Col,
    Icon,
    Button
  } from 'vant'
  import { XInput, PopupPicker } from 'vux'
  import Avatar from '../../components/avatar/index.vue'
  import { mapState } from 'vuex'
  import cropImage from '../../view-render/crop-image';
  import numericCode from '../../view-render/input/numericCode';

  export default {
    components: {
      XInput,
      PopupPicker,
      [Field.name]: Field,
      [Row.name]: Row,
      [Col.name]: Col,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [Avatar.name]: Avatar,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [cropImage.name]: cropImage,
      [numericCode.name]: numericCode,
    },
    computed: {
      ...mapState({
        shoploginData: state => state.merchant.shoploginData,
        merchantData: state => state.merchant.merchantData,
        newShopData: state => state.merchant.newShopData,
        $location: state => state.ApiService.$location
      })
    },
    data () {
      return {
        socketService: null,
        msg: 'Hello World!',
        setData: null,
        checked: false,
        show: true,
        shopPopupBusiness_1: false,
        columns: [
          {
            name: '企业法人',
            value: '0'
          },
          {
            name: '个体工商户',
            value: '1'
          }
        ],
        columnsSelect: [0],
        openFullscreen: true,
        code: ''
      }
    },
    watch: {},
    created () {
      let that = this;
      let id = this.$route.query.id
      let isEdit = this.$route.query.isEdit
      if (+id && !isEdit) {
        that.$ajax.getShopVerifyStatus({id})
      }
    },
    methods: {
      onChange () {
      },
      getMobilePhoneCode (val) {
        let that = this;
        let id = that.shoploginData.id;
        let telephone = val.replace(/[^0-9]{0,13}/ig, '');
        if (!telephone) {
          that.$toast.error('手机号码不能为空~')
          return;
        } else if (!that.util.regExp.isPhone(telephone)) {
          that.$toast.error('手机号码格式不正确~');
          return;
        }
        that.$vux.loading.show({text: "请求中..."});
        return that.$ajax.register2sendSMS({telephone, id}).finally(({status, info, msg}) => {
          that.$vux.loading.hide();
          if (status === 1) {

          } else {
            that.$toast.error(msg || '发送失败')
          }
        })
      },
      /**
       * 营业执照上传
       */
      bingLicenseImg () {
        let that = this;
        that.$azm.util.Native.chooseImage({zoom: 0, crop: 1, aspectRatio: '9:12'}).finally(res => {
          if (res.status === 1) {
            that.merchantData.license_img = res.info.img
          } else {
            that.$refs.cropImage.chooseCrop({
              aspectRatio: 9 / 12,
              success (data) {
                if (data && data.url) {
                  that.merchantData.license_img = data.url
                }
              },
              cancel () {

              }
            })
          }
        })
      },
      // 确认提交
      confirmSubmit () {
        let that = this;

      },
      bindSubmit () {
        let that = this;
        let code = this.code;
        let telephone = '';
        if (this.merchantData.bindedphone) {
          telephone = this.merchantData.bindedphone.replace(/[^0-9]{0,13}/ig, '');
        }
        let id = that.$route.query.id;
        let set = {},
          newShopData = that.newShopData,
          util = that.$azm.util;
        set.city_id = newShopData.city_id;
        set.city_name = newShopData.city_name;
        if (!util.trim(newShopData.position)) {
          that.$vux.toast.text('详细地址不能为空~')
          return;
        } else {
          set.position = newShopData.position
        }
        if (!util.trim(newShopData.address)) {
          that.$vux.toast.text('地址定位不能为空~')
          return;
        } else {
          set.address = newShopData.address
        }
        if (!util.trim(newShopData.shop_name)) {
          that.$vux.toast.text('店铺名称不能为空~')
          return;
        } else {
          set.shop_name = newShopData.shop_name
        }
        if (!util.trim(newShopData.pic)) {
          that.$vux.toast.text('店铺封面照片不能为空~')
          return;
        } else {
          set.pic = newShopData.pic
        }
        if (!newShopData.lon) {
          that.$vux.toast.text('经纬度格式不正确，请重新定位~')
          return;
        } else {
          set.lon = newShopData.lon
        }
        if (!newShopData.lat) {
          that.$vux.toast.text('经纬度格式不正确，请重新定位~')
          return;
        } else {
          set.lat = newShopData.lat
        }
        if (!util.trim(newShopData.open_starttime)) {
          that.$vux.toast.text('营业开始时间不正确，请重新选择~')
          return;
        } else {
          set.open_starttime = newShopData.open_starttime
        }
        if (!util.trim(newShopData.open_endtime)) {
          that.$vux.toast.text('营业开始时间不正确，请重新选择~')
          return;
        } else {
          set.open_endtime = newShopData.open_endtime
        }
        if (!util.trim(newShopData.service_phone)) {
          that.$vux.toast.text('服务电话不能为空~')
          return;
        } else {
          set.service_phone = newShopData.service_phone.replace(/\s/g, "")
        }
        if (newShopData.major_business && newShopData.major_business.length > 0) {
          let arr = []
          for (let v of newShopData.major_business) {
            arr.push(v.id)
          }
          set.major_business = arr.join(',')
        } else {
          that.$vux.toast.text('主营业务不正确，请重新选择~')
          return;
        }
        if (newShopData.day && newShopData.day.length > 0) {
          set.day = newShopData.day.join(',')
        } else {
          that.$vux.toast.text('工作日设置不正确，请重新选择~')
          return;
        }

        let edit = {},
          merchantData = that.merchantData,
          shoploginData = that.shoploginData,
          IsIDcard = util.regExp.IsIDcard;


        if (!!util.trim(merchantData.discount_code)) {
          edit.discount_code = merchantData.discount_code
        }
        edit.front_identity = merchantData.front_identity;
        edit.end_identity = merchantData.end_identity;
        if (merchantData.legal_identity && !IsIDcard.test(merchantData.legal_identity)) {
          that.$vux.toast.text('法人身份证号码格式不正确~')
          return
        } else {
          edit.legal_identity = merchantData.legal_identity
        }
        if (!util.trim(merchantData.license_img)) {
          that.$vux.toast.text('营业执照附件不能为空~')
          return
        } else {
          edit.license_img = merchantData.license_img
        }
        if (!util.trim(merchantData.license_name)) {
          that.$vux.toast.text('营业执照名称不能为空')
          return
        } else {
          edit.license_name = merchantData.license_name
        }
        if (!util.trim(merchantData.license_code)) {
          that.$vux.toast.text('营业执照注册号不能为空~')
          return
        } else {
          edit.license_code = merchantData.license_code
        }
        if (!util.trim(merchantData.legal_username)) {
          that.$vux.toast.text('法人姓名不能为空~')
          return
        } else {
          edit.legal_username = merchantData.legal_username
        }
        if (merchantData.license_type && merchantData.license_type.length > 0) {
          edit.license_type = merchantData.license_type[0]
        } else {
          that.$vux.toast.text('请选择营业执照类型~')
          return
        }
        // y 9:12   门 1:1   身份证16:10
        this.$refs.numericCode.countdownStartUp({
          val: telephone,
          keyMethodEnd (code) {
            let data = {
              "set": set,
              "edit": edit,
              "telephone": telephone,
              "code": code,
              id
            };
            if (!code || code.length !== 4) {
              that.$toast.error('验证码格式错误~');
              return;
            }
            that.$vux.loading.show({
              text: "发送中..."
            });
            return that.$ajax.setRegisterNewAdmission(data).finally(({status, info, msg} = {}) => {
              that.$vux.loading.hide();
              if (status === 1) {
                that.$router.push({path: '/merchant_schedule', query: {id: info.id}})
              } else {
                that.$toast.error(msg)
              }
            });
          },
          requestMethod () {
            return that.getMobilePhoneCode(telephone);
          }
        })
      }
    }
  }
</script>


<style scoped lang='less'>
  .t-shopAudit {
    padding-bottom: 100px;
    .van-cell-group:not(:nth-child(1)) {
      margin-top: 10px;
    }

    .azm-field {
      font-size: 14px;
      &:before {
        border-width: 0;
      }
      &:after {
        left: 15px;
      }
    }
    .t-shopTitle {
      display: flex;
      height: 90/2px;
      background-color: #ffffff;
      justify-content: space-between;
      align-items: center;
      padding-left: 30/2px;
      padding-right: 30/2px;
      .t-shopName, .t-shopTitle--icon {
        font-size: 14px;
        color: #333333;
        padding-right: 10px;
      }
      .t-reelect {
        > span {
          font-size: 28/2px;
          color: #999999;
          margin-right: 20/2px;
        }
        > img {
          width: 11/2px;
          height: 22/2px;
        }
      }
    }
    .t-fillContent {
      background-color: #ffffff;
      margin-top: 0;
      .t-licenseName {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        > span {
          margin-right: 65/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
      .t-uploadingPicture {
        .t-businessPicture {
          width: 72px;
          > p {
            font-size: 24/2px;
            color: #999999;
          }
        }
        .t-explain {
          box-sizing: border-box;
          flex: 2;
          padding-left: 40/2px;
          font-size: 28/2px;
          color: #666666;
          .t-lookExample {
            display: block;
            line-height: 1;
            padding-top: 5px;
            > span {
              color: #ff4919;
              font-size: 14px;
              .azm-icon {
                margin-left: 5px;
                font-size: 12px;
              }
            }
          }
        }
      }
      .t-licenseName2 {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        margin-top: 30/2px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        > span {
          margin-right: 97/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
      .t-h20 {
        height: 20/2px;
        background-color: #f4f4f4;
      }
      .t-licenseName3 {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        display: flex;
        align-items: center;
        border-bottom: solid 1px #e5e5e5;
        > span {
          margin-right: 35/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
      .t-van-hairline {
        border: 0;
      }
      .t-licenseName4 {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        display: flex;
        align-items: center;
        > span {
          margin-right: 97/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
    }
    .t-agreement {
      margin-top: 50/2px;
      text-align: center;
      .t-checked {
        /*font-size: 12px;*/
        color: #666;

      }
    }

    button {
      border: 0;
    }

    .t-button {
      width: 690/2px;
      height: 45px;
      line-height: 43px;
      background-image: linear-gradient(270deg, #3d70f7 0%, #35abfe 100%),
      linear-gradient(#008cf0, #008cf0);
      background-blend-mode: normal, normal;
      border-radius: 45/2px;
      color: #ffffff;
      font-size: 32/2px;
      position: fixed;
      bottom: 20/2px;
      left: 50%;
      transform: translate(-50%, 0);
      &.van-button--disabled {
        background-image: none;
        background-color: #ccc;
      }
    }
    .azm-protocol-dialog {
      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

<style lang="less">
  .t-shopAudit {
    .azm-business--picker {
      > .weui-cell {
        padding: 0;
      }
      .vux-popup-picker-value {
        color: #333;
      }
      .weui-cell__ft {
        display: none;
      }
    }
    .van-cell-group {
      .van-cell__value {
        font-size: 14px;
        color: #999;
      }
      .van-cell__title {
        color: #333;
      }
    }
    .t-fillContent {
      .t-business {
        .van-cell__title {
          font-size: 32/2px;
        }
      }
      .van-hairline--top-bottom::after {
        border: 0;
      }

      .t-shopTime {
        .van-cell__title {
          font-size: 32/2px;
        }
      }
    }

    .t-agreement {
      .van-checkbox {
        .van-checkbox__icon {
        }
        .van-checkbox--checked {
          background-color: #008cf0;
          color: #fff;
          border-color: #008cf0;
          text-align: center;
          line-height: 28/2px;
        }
      }
    }
  }
</style>



