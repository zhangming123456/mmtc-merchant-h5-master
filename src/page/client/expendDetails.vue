<template>
  <div class="t-client-orderDetails">
    <div class="t-shopInfo">
      <div class="t-shopImg">
        <!-- <img src="http://pic1.win4000.com/pic/b/30/5d2185025d.jpg" alt=""> -->
        <azm-avatar :src="items.cover"></azm-avatar>

      </div>
      <div class="t-shopContent">
        <div class="t-shopTitle">
          <span>{{items.card_name}}</span>
          <span class="t-shopLabel">{{items.order_status}}</span>

        </div>
        <div class="t-shopNum">数量：{{items.num}}</div>
        <div class="t-price">
          <div class="t-flex">
            <div class="t-newPrice">
              <span>￥</span>
              <span>{{items.price}}</span>
            </div>
            <span class="t-oldPrice">￥{{items.market_price}}</span>
          </div>
          <div class="t-time">{{items.pay_time}}</div>
        </div>
        <div class="t-tiem">{{items.used}}/{{items.num}}</div>
      </div>
    </div>
    <div class="t-orderList">
      <van-cell title="产品ID" :value="items.item_id" />
      <van-cell title="商品总价" :value=" '¥'+items.origin_total" />
      <van-cell title="店铺优惠" :value=" '-¥'+items.discount_money" />
      <van-cell title="尾款单位" value="无" />
      <van-cell class="t-pay" title="实付款" :value=" '¥'+items.origin_total" />
      <van-cell title="订单ID：" :value="items.order_no" />
      <van-cell title="下单时间：" :value="items.create_time" />
      <van-cell title="付款时间：" :value="items.pay_time" />
      <van-cell class="t-deal" title="交易状态：" :value="items.order_status" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Cell, CellGroup } from "vant";
import Avatar from "../../components/avatar/index.vue";

export default {
  components: {
    [Avatar.name]: Avatar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  data() {
    return {
      items: {}
    };
  },
  watch: {},
  created() {
    this.getOrderDetail();
  },

  methods: {
    // 获取客户信息
    getOrderDetail() {
      var info_id = this.$route.query.info_id;

      this.$store
        .dispatch("ApiService/getOrderDetail", { info_id })
        .finally(res => {
          console.log(res);
          if (1 === res.status) {
            this.items = res.info;
          }
        });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-orderDetails {
  .t-shopInfo {
    padding: 30/2px;
    background-color: #ffffff;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    margin-top: 20/2px;
    .t-shopImg {
      margin-right: 30/2px;
      width: 150/2px;
      height: 150/2px;
      img {
        width: 150/2px;
        height: 150/2px;
        border-radius: 4/2px;
      }
    }
    .t-shopContent {
      flex: 1;
      position: relative;

      .t-shopTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span:first-child {
          font-size: 32/2px;
          color: #171f24;
          font-weight: 500;
        }
        .t-shopLabel {
          border: 1px solid #f25643;
          border-radius: 4/2px;
          font-size: 22/2px;
          color: #f25643;
          height: 30/2px;
          line-height: 30/2px;
          padding-left: 5/2px;
          padding-right: 5/2px;
        }
      }
      .t-shopNum {
        font-size: 24/2px;
        color: #6f7578;
        margin-top: 20/2px;
      }
      .t-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin-top: 50/2px;
        .t-flex {
          display: flex;
          align-items: center;
          .t-newPrice {
            color: #ff6182;
            margin-right: 10/2px;
            > span:first-child {
              font-size: 16/2px;
            }
            > span:last-child {
              font-size: 32/2px;
            }
          }
          .t-oldPrice {
            text-decoration: line-through;
            font-size: 24/2px;
            color: #aab2b7;
            margin-top: 5/2px;
          }
        }

        .t-time {
          font-size: 24/2px;
          color: #aab2b7;
          margin-top: 5/2px;
        }
      }
      .t-tiem {
        font-size: 28/2px;
        color: #6f7578;
        position: absolute;
        right: 0;
        bottom: 50/2px;
      }
    }
  }
  .t-orderList {
    margin-top: 60/2px;
  }
}
</style>

<style lang='less'>
.t-client-orderDetails {
  .t-orderList {
    .t-pay {
      .van-cell__value {
        color: #ff7a00;
      }
    }
    .t-deal {
      .van-cell__value {
        span {
          color: #ff7a00;
          border: 1px solid #f25643;
          border-radius: 4/2px;
          font-size: 22/2px;
          padding-left: 10/2px;
          padding-right: 10/2px;
          height: 30/2px;
          line-height: 30/2px;
        }
      }
    }
    .van-cell {
      .van-cell__title {
        font-size: 28/2px;
        color: #6f7578;
      }
    }
  }
}
</style>
