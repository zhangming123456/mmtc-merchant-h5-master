<template>
  <div class="azm-product-activity">
    <van-cell-group class="marTop12">
      <van-cell title="拼团人数">
        <template v-for="(item,index) in radios">
          <mu-radio :value="item" v-model="group_num" :label="item + '人团'"></mu-radio>
        </template>
      </van-cell>
      <van-field label="拼团价格" type="text" v-model="group_price" placeholder="请填写拼团价格"
                 @blur="groupPriceField(group_price)" @input="groupPriceInput" pattern="\d*"></van-field>
      <van-cell title="是否有效">
        <mu-switch v-model="is_valid"></mu-switch>
      </van-cell>
    </van-cell-group>
    <div class="azm-activity-text">
      <mu-row>
        <mu-col :span="3">
          *拼团价格：
        </mu-col>
        <mu-col :span="9">
          <p>优惠力度不得少于日均价格的10%</p>
        </mu-col>
        <mu-col :span="3">
          *日均价格：
        </mu-col>
        <mu-col :span="9">
          <p>产品近一个月的交易原价（交易原价=交易最终价格+包括优惠卷，买单等各种优惠折扣金额）的日平均数。</p>
        </mu-col>
      </mu-row>
    </div>

    <mu-flex class="azm-append-footer azm-append-footer-fixed">
      <mu-button full-width textColor="#fff" @click.native="onConfirm">
        <span>确定</span>
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>
  import { Radio, Switch } from "muse-ui"
  import { Field, Cell, CellGroup } from 'vant';
  import { mapState } from 'vuex'
  export default {
    components: {
      [Radio.name]: Radio,
      [Switch.name]: Switch,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell
    },
    data(){
      return {
        message: '',
        group_num: 2,
        group_price: null,
        is_valid: false,
        radios: [2, 3, 5]
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    created(){
      this.group_num = +this.productData.group_num
      this.group_price = this.productData.group_price
      this.is_valid = +this.productData.is_valid
    },
    methods: {
      groupPriceField(val){
        if (this.util.isNumberOfNaN(val)) {
          this.group_price = Number(this.util.number_format(val))
        }
      },
      groupPriceInput(e){
        this.group_price = this.util.number_filter(e)
      },
      onConfirm(){
        let that = this;
        let price = that.productData.price
        let fIndex = this.radios.findIndex(v => {
          return v == that.group_num
        })
        if (fIndex === -1) {
          that.$toast.error('请选择拼团人数~')
          return;
        }
        if (!price) {
          that.$toast.error('请先去设置门市价格~')
          return;
        }
        if (!that.group_price) {
          that.$toast.error('请设置拼团价格~')
          return;
        }
        if (+price < +that.group_price) {
          that.$toast.error('拼团不得大于门市价~')
          return;
        }
        that.productData.group_price = that.group_price
        that.productData.group_num = that.group_num
        that.productData.is_valid = !!that.is_valid
        that.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-activity {
    .azm-activity-text {
      padding: 12px 15px;
      box-sizing: border-box;
      line-height: 20px;
      font-size: 14px;
      color: #999999;

    }
    .azm-append-footer {
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
  .azm-product-activity {
    .van-cell {
      .mu-radio {
        margin-right: 5px;
      }
      .van-cell__value {
        flex: 3;
        text-align: left;
      }
    }
  }
</style>
