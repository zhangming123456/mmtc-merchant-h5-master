<template>
  <div class="azm-product-minutiae">
    <van-popup class="azm-minutiae-label-popup" v-model="labelShow" position="bottom">
      <p>填写领域标签或品牌属性，最多5个字哦~</p>
      <van-field class="azm-popupText" v-model="popupText" placeholder="例：欧莱雅（美发的产品品牌）" maxlength="5" clearable/>
      <mu-button full-width textColor="#fff" @click.native="onPopupConfirm">
        <span>提交</span>
      </mu-button>
    </van-popup>
    <van-cell title="图文详情" is-link to="/product_graphic">
      <span v-if="productData.intro && productData.intro.length>0">已完善</span>
      <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
    </van-cell>
    <div class="azm-minutiae-label">
      <div class="azm-minutiae-label-title">
        <span>产品标签</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;让用户更容易找到你</span>
      </div>
      <div class="azm-minutiae-label-box">
        <mu-button class="azm-mu-btn" small flat textColor="#ff4919" @click.native="opLabelPopup">+</mu-button>
        <template v-for="(item,index) in label">
          <mu-button class="azm-mu-btn" small flat textColor="#ff4919">
            <span>{{item}}</span>
            <van-icon class="azm-clear-icon" color="#999" name="clear" @click.native="clearLabel(index)"/>
          </mu-button>
        </template>
      </div>
    </div>

    <van-cell-group class="marTop12">
      <van-cell title="使用期限" is-link to="/product_deadline"
                :value="productData.start_date | dateRang(productData.end_date)+'天'"></van-cell>
      <van-cell is-link to="/product_itemBrand">
        <span slot="title">使用商品</span>
        <span slot="title" class="van-cell-title2">服务使用的商品品牌、名称等</span>
        <span v-if="productData.item_brand && productData.item_brand.length>0">已添加</span>
        <span class="azm-perfect-active" v-else>添加</span>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="marTop12">
      <van-field v-model="taboo_crowd" label="禁忌人群" placeholder="填写禁忌人群" :max-length="20" clearable/>
      <van-field v-model="other_instructions" label="其它说明" placeholder="填写其它说明" :max-length="20" clearable/>
    </van-cell-group>
    <mu-flex class="azm-append-footer azm-append-footer-fixed">
      <mu-button full-width textColor="#fff" @click.native="onConfirm">
        <span>提交</span>
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>
  import dataRange from '../../tools/date/range'
  import { Field, Cell, CellGroup, Icon, Popup } from 'vant';
  import { mapState } from 'vuex'
  export default {
    components: {
      [Popup.name]: Popup,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell
    },
    data(){
      return {
        message: '',
        labelShow: false,
        popupText: '',
        label: [],
        taboo_crowd: "",
        other_instructions: "",
        item_brand: []
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
      if (this.productData.label) {
        this.label = this.util.unique(this.productData.label)
      }
      this.taboo_crowd = this.productData.taboo_crowd
      this.other_instructions = this.productData.other_instructions
    },
    methods: {
      clearLabel(index){
        if (index > -1) {
          this.label.splice(index, 1)
        }
      },
      onConfirm(){
        this.productData.label = this.label
        this.productData.taboo_crowd = this.taboo_crowd
        this.productData.other_instructions = this.other_instructions
        this.$router.back()
      },
      opLabelPopup(){
        this.labelShow = true
        this.popupText = ''
      },
      onPopupConfirm(){
        let text = this.util.trim(this.popupText)
        if (text) {
          let fIndex = this.label.findIndex(v => {
            return v === text
          })
          if (this.label && this.label.length > 7) {
            this.$toast.warning('最多添加7个标签~');
          } else if (fIndex === -1) {
            this.labelShow = false;
            this.label.push(text);
          } else {
            this.$toast.warning('已有重复标签~');
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-minutiae {
    margin-bottom: 50px;
    .van-cell-title2 {
      margin-left: 12px;
      font-size: 12px;
      color: #999999;
    }
    .azm-perfect-active {
      color: #ff4919;
      font-size: 14px;
      .azm-icon {
        font-size: 14px;
        margin-right: 3px;
      }
    }
    .azm-minutiae-label {
      background-color: #fff;
      .azm-minutiae-label-title {
        font-size: 14px;
        color: #333;
        padding: 12px 15px;
        > span:nth-child(2) {
          font-size: 12px;
          color: #999;
        }
      }
      .azm-minutiae-label-box {
        background-color: #fff;
        padding-left: 15px;
        .azm-mu-btn {
          position: relative;
          overflow: visible;
          min-width: 0;
          border: 1px solid #ff4919;
          margin-right: 15px;
          margin-bottom: 12px;
          height: 22px;
          text-transform: none;
          &:nth-child(1) {
            width: 55px;
          }
          .azm-clear-icon {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            background-color: #fff;
          }
        }
      }
    }
    .azm-append-footer {
      .mu-button {
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
      }
    }
    .azm-minutiae-label-popup {
      p {
        box-sizing: border-box;
        padding: 12px 15px 0;
        color: #282828;
        font-size: 14px;
      }
      .azm-popupText {
        margin-bottom: 20px;
        &:after {
          border: none;
        }
      }
      .mu-button {
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
      }
    }
  }
</style>
<style lang="less">
  .azm-product-minutiae {
    .van-cell__title, .van-cell__value {
      flex: 3 3 auto;
    }
  }
</style>
