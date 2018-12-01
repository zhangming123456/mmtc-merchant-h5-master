<template>
  <div class="t-shopAudit">
    <van-cell-group class="azm-header">
      <van-field v-model="newShopData.shop_name" clearable label="店铺名称" placeholder="店铺名称需与门牌一致"></van-field>
      <van-cell class="t-uploadingPicture">
        <van-row>
          <van-col class="t-businessPicture" @click.native="bingPicImg">
            <azm-avatar :src="newShopData.pic" v-if="newShopData.pic"></azm-avatar>
            <azm-avatar is-local img-type="img1" v-else></azm-avatar>
            <p>上传门头照</p>
          </van-col>
          <van-col class="t-explain">
            <p>*不得遮挡门牌，拍摄环境需白天</p>
            <p>*门牌需与店铺名称一致</p>
            <p>*图片清晰且不多于1M</p>
            <router-link :to="{path:'/merchant_mtzsample'}" class="t-lookExample">
              <span>查看示例<van-icon class="azm-icon" name="arrow"/></span>
            </router-link>
          </van-col>
        </van-row>
      </van-cell>
      <van-cell title="主营业务" is-link to="/merchant_classify">
        <template v-if="newShopData.major_business && newShopData.major_business.length>0">
          <span v-for="(item,index) in newShopData.major_business" :key="index"
                v-if="index<3">{{index === 0 ? '' : '、'}}{{item.title}}</span>
          <span>{{3 < newShopData.major_business.length ? '…' : ''}}</span>
        </template>
        <span v-else>选择</span>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-cell class="azm-location" title="地址定位" :value="newShopData.address || '选择'"
                @click.native="openLocation">
        <template slot="right-icon">
          <span class="iconfont icon-address azm-icon"></span>
        </template>
      </van-cell>
      <van-field v-model="newShopData.position" clearable label="详细地址" placeholder="输入详细门牌号地址"></van-field>
    </van-cell-group>
    <van-cell-group>
      <van-cell class="azm-open--time" title="营业时间" is-link to="/merchant_servicetime">
        <span v-if="filter_date(newShopData.day).status">{{filter_date(newShopData.day).txt}}</span>
        <span v-for="(item,index) in newShopData.day" :key="index"
              v-else>{{dateList[item].txt}}{{index !== newShopData.day.length - 1 ? '、' : ''}}</span>
        <span>&nbsp;{{newShopData.open_starttime}}-{{newShopData.open_endtime}}</span>
      </van-cell>
      <van-cell class="azm-server--phone" title="服务电话">
        <div class="azm-telphone">
          <x-input class="azm-telphone--input" type="tel" v-model="newShopData.service_phone"
                   :max="service_obj[service_active].max" :mask="service_obj[service_active].mask"
                   :placeholder="service_obj[service_active].placeholder"></x-input>
        </div>
        <div slot="right-icon" @click="bindServiceClick">
          <span>{{service_obj[service_active].txt}}</span>
          <span class="iconfont icon-qiehuan azm-icon"></span>
        </div>
      </van-cell>
    </van-cell-group>
    <azm-crop-image ref="cropImage" id="imgUploader" :autoUpload="true" :isCrop="true"></azm-crop-image>
    <vue-azm-amap ref="Amap"></vue-azm-amap>
    <van-button class="t-button" @click.native="bindSubmit">
      下&nbsp;一&nbsp;步
    </van-button>
  </div>
</template>

<script>
  import { Cell, CellGroup, Checkbox, CheckboxGroup, Popup, Picker, Field, Row, Col, Icon, Button } from "vant";
  import Avatar from '../../components/avatar/index.vue'
  import { XInput, PopupPicker } from 'vux'
  import { mapState } from 'vuex'

  import cropImage from '../../view-render/crop-image'
  import Amap from '../../view-render/map/amap'

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
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Avatar.name]: Avatar,
      [cropImage.name]: cropImage,
      [Amap.name]: Amap,
    },
    computed: {
      ...mapState({
        merchantData: state => state.merchant.merchantData,
        newShopData: state => state.merchant.newShopData,
        shoploginData: state => state.merchant.shoploginData,
        $location: state => state.vux.$location,
      })
    },
    data () {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        checked: false,
        doInput: true,
        btnText: '换手机',
        service_active: 0,
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
        service_obj: [
          {
            txt: '换座机',
            placeholder: '11位手机号码',
            mask: '999 9999 9999',
            max: 13
          },
          {
            txt: '换手机',
            placeholder: '区号 - 8位号码',
            mask: '9999-99999999',
            max: 12
          }
        ],
        day: []
      };
    },
    created () {
      let id = this.$route.query.id;
      let that = this;
      this.$store.commit("merchant/clearMerchantData");
      if (+id) {
        that.$ajax.getShopVerifyStatus({id})
      }
    },
    watch: {},
    methods: {
      bindServiceClick () {
        this.service_active = this.service_active === 0 ? 1 : 0
        this.newShopData.service_phone = ''
      },
      bingPicImg () {
        let that = this;
        this.$azm.util.Native.chooseImage({zoom: 1, crop: 1, aspectRatio: ''}).then(res => {
          if (res.status === 1) {
            that.newShopData.pic = res.info.img
          } else {
            that.$refs.cropImage.chooseCrop({
              success (data) {
                if (data && data.url) {
                  that.newShopData.pic = data.url
                }
              },
              cancel () {

              }
            })
          }
        })
      },
      //过滤营业时间
      filter_date (value) {
        let dateList = this.dateList, flag = true
        value = this.$azm.util.quickSort(value)
        let findIndex = value.findIndex((v, i) => {
          return /[0-6]/.test(v) && v !== i
        })
        for (let i = 0; i < value.length; i++) {
          if (value[i] + 1 !== value[i + 1] && i !== value.length - 1) {
            flag = false;
          }
        }
        if (findIndex === -1) {
          return {txt: `周一至${dateList[value.length - 1].txt}`, status: 1}
        } else if (5 <= value.length - 1 && findIndex > -1) {
          let index1 = findIndex - 1 === -1 ? 6 : findIndex - 1,
            index2 = findIndex + 1 > 6 ? 1 : findIndex + 1
          return {txt: `${dateList[index2].txt}至${dateList[index1].txt}`, status: 1}
        } else if (flag) {
          let index1 = value[0],
            index2 = value[value.length - 1]
          return {txt: `${dateList[index1].txt}至${dateList[index2].txt}`, status: 1}
        }
        else {
          return {txt: '', status: 0}
        }
      },
      openLocation () {
        let that = this;
        this.$azm.util.Native.openLocation().then(res => {
          if (res.status === 1) {
            let data = res.info
            that.newShopData.lat = data.lat
            that.newShopData.lon = data.lon
            that.newShopData.address = data.address
            that.newShopData.city_id = data.city_id
            that.newShopData.city_name = data.city_name
          } else {
            that.$refs.Amap.show({
              complete (data) {
                console.log(data);
                that.newShopData.lat = data.location.lat;
                that.newShopData.lon = data.location.lng;
                that.newShopData.address = data.district + data.address + data.name;
                that.newShopData.city_name = data.district
              },
              cancel () {

              }
            })
          }
        })
      },
      bindSubmit () {
        let that = this,
          sendData = {},
          newShopData = that.newShopData,
          shoploginData = that.shoploginData,
          util = that.$azm.util;
        sendData.id = shoploginData.id;
        sendData.city_id = newShopData.city_id;
        sendData.city_name = newShopData.city_name;
        if (!util.trim(newShopData.position)) {
          that.$vux.toast.text('详细地址不能为空~')
          return;
        } else {
          sendData.position = newShopData.position
        }
        if (!util.trim(newShopData.address)) {
          that.$vux.toast.text('地址定位不能为空~')
          return;
        } else {
          sendData.address = newShopData.address
        }
        if (!util.trim(newShopData.shop_name)) {
          that.$vux.toast.text('店铺名称不能为空~')
          return;
        } else {
          sendData.shop_name = newShopData.shop_name
        }
        if (!util.trim(newShopData.pic)) {
          that.$vux.toast.text('店铺封面照片不能为空~')
          return;
        } else {
          sendData.pic = newShopData.pic
        }
        if (!newShopData.lon) {
          that.$vux.toast.text('经纬度格式不正确，请重新定位~')
          return;
        } else {
          sendData.lon = newShopData.lon
        }
        if (!newShopData.lat) {
          that.$vux.toast.text('经纬度格式不正确，请重新定位~')
          return;
        } else {
          sendData.lat = newShopData.lat
        }
        if (!util.trim(newShopData.open_starttime)) {
          that.$vux.toast.text('营业开始时间不正确，请重新选择~')
          return;
        } else {
          sendData.open_starttime = newShopData.open_starttime
        }
        if (!util.trim(newShopData.open_endtime)) {
          that.$vux.toast.text('营业开始时间不正确，请重新选择~')
          return;
        } else {
          sendData.open_endtime = newShopData.open_endtime
        }
        if (!util.trim(newShopData.service_phone)) {
          that.$vux.toast.text('服务电话不能为空~')
          return;
        } else {
          sendData.service_phone = newShopData.service_phone.replace(/\s/g, "")
        }
        if (newShopData.major_business && newShopData.major_business.length > 0) {
          let arr = []
          for (let v of newShopData.major_business) {
            arr.push(v.id)
          }
          sendData.major_business = arr.join(',')
        } else {
          that.$vux.toast.text('主营业务不正确，请重新选择~')
          return;
        }
        if (newShopData.day && newShopData.day.length > 0) {
          sendData.day = newShopData.day.join(',')
        } else {
          that.$vux.toast.text('工作日设置不正确，请重新选择~')
          return;
        }
        let query = {isEdit: 1};
        let id = this.$route.query.id;
        if (+id > 0) {
          query.id = id
        }
        that.$router.push({path: '/merchant_attestinfo', query})
      }
    }
  };
</script>


<style scoped lang='less'>
  .t-shopAudit {
    position: relative;
    padding-bottom: 100px;
    .van-cell-group:not(:nth-child(1)) {
      margin-top: 10px;
    }
    input {
      border: 0;
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

    .azm-server--phone {
      .azm-telphone--input {
        padding: 0;
        width: 100%;
      }
      .azm-icon {
        font-size: 14px;
        color: #999;
      }
    }

    .azm-location {
      .azm-icon {
        font-size: 14px;
        padding-left: 5px;
        color: #999;
      }
    }
    .t-fillContent {
      background-color: #ffffff;
      margin-top: 20/2px;

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
        display: flex;
        margin-right: 30/2px;
        margin-left: 30/2px;
        padding-top: 40/2px;
        padding-bottom: 30/2px;
        border-bottom: 1px solid #e5e5e5;
        .t-businessPicture {
          > img {
            width: 150/2px;
            height: 150/2px;
          }
          > p {
            font-size: 24/2px;
            color: #999999;
            margin-left: 12/2px;
          }
        }
        .t-explain {
          margin-left: 40/2px;
          font-size: 28/2px;
          color: #666666;
          .t-lookExample {
            > span {
              color: #ff4919;
              margin-right: 10/2px;
            }
            > img {
              width: 11/2px;
              height: 22/2px;
            }
          }
        }
      }
      .t-location {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        border-bottom: 1px solid #e5e5e5;
        > span {
          font-size: 32/2px;
          color: #333333;
        }
        .t-seat {
          display: flex;
          align-items: center;
          > img {
            width: 26/2px;
            height: 30/2px;
            display: block;
          }
          > span {
            font-size: 28/2px;
            color: #999999;
            margin-right: 14/2px;
          }
        }
      }
      .t-licenseName2 {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        display: flex;
        align-items: center;
        > span {
          margin-right: 64/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
      .t-serviceCall {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 30/2px;
        margin-left: 30/2px;
        height: 90/2px;
        border-top: 1px solid #e5e5e5;
        .t-sitPhone {
          display: flex;
          > span {
            line-height: 50/2px;
            margin-right: 10/2px;
          }
          .t-inputPhone {
            width: 110/2px;
            height: 50/2px;
            background-color: #f4f4f4;
            border-radius: 4/2px;
            text-align: center;
            line-height: 50/2px;
            margin-right: 10/2px;
          }
          .t-inputPhone2 {
            width: 190/2px;
            height: 50/2px;
            background-color: #f4f4f4;
            border-radius: 4/2px;
            text-align: center;
            line-height: 50/2px;
          }
        }
        > span {
          font-size: 32/2px;
          margin-right: 38/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
          height: 100%;
        }
        .t-phone {
          > span {
            font-size: 28/2px;
            color: #999999;
            margin-right: 14/2px;
          }
          > img {
            width: 26/2px;
            height: 26/2px;
          }
        }
      }
      .t-licenseName3 {
        height: 90/2px;
        margin-left: 30/2px;
        margin-right: 30/2px;
        display: flex;
        align-items: center;
        border-top: 1px solid #e5e5e5;
        > span {
          margin-right: 97/2px;
          font-size: 32/2px;
        }
        > input {
          border: 0;
          font-size: 28/2px;
        }
      }
      .t-business {
        .t-van-cell__title {
          font-size: 32/2px;
        }
      }
      .t-h20 {
        height: 20/2px;
        background-color: #f4f4f4;
      }
    }
    button {
      border: 0;
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

    .t-bottom {
      height: 110/2px;
      background-color: #ffffff;
      position: fixed;
      align-items: center;
      display: flex;
      justify-content: space-between;
      bottom: 0;
      width: 100%;
      padding-left: 30/2px;
      padding-right: 30/2px;
      .t-button1 {
        width: 200/2px;
        height: 35px;
        line-height: 33px;
        background-color: #ffffff;
        border-radius: 8/2px;
        border: solid 2/2px #bdbdbd;
        font-size: 32/2px;
        color: #333333;
      }
      .t-button2 {
        width: 200/2px;
        height: 35px;
        line-height: 33px;
        background-image: linear-gradient(90deg, #35abfe 0%, #3d70f7 100%);
        border-radius: 8/2px;
        border: solid 2/2px #bdbdbd;
        font-size: 32/2px;
        color: #fffefe;
        border: none;
      }
    }
  }
</style>


<style lang="less">
  .t-shopAudit {
    .azm-open--time {
      .van-cell__title {
        max-width: 80px;
      }
      .van-cell__value {
        flex: 2;
        font-size: 12px;
      }
    }

    .azm-server--phone {
      .van-cell__title {
        max-width: 90px;
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
  }
</style>






