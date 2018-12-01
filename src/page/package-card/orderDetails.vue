<template>
  <div class="azm-package-card-order-details">
    <header>
      <van-cell class="azm-shop-info marTop12" center>
        <div class="azm-shop-cover" slot="icon">
          <azm-avatar :aspectRatio="1" mode="aspectFill" shape="round" :src="info.user_avatar"></azm-avatar>
        </div>
        <div class="azm-shop-value">
          <p class="azm-name azm-ellipsis">{{info.nickname}}</p>
          <p class="azm-business azm-ellipsis">{{info.intro}}</p>
        </div>
        <div class="azm-right-icon" slot="right-icon">
          <mu-badge content="私信TA" color="#F25643"></mu-badge>
        </div>
      </van-cell>
      <van-cell class="azm-card-info marTop12">
        <div class="azm-card-cover" slot="icon">
          <azm-avatar mode="aspectFill" :height="47" :src="info.cover"></azm-avatar>
        </div>
        <div class="azm-card-value">
          <p class="azm-name azm-ellipsis">{{info.card_name}}</p>
          <p class="azm-num azm-ellipsis">消耗：{{info.use_count}}/{{info.count}}</p>
          <p class="azm-nickname azm-ellipsis">下单时间：{{info.create_time}}</p>
        </div>
        <div class="azm-right-icon" slot="right-icon">
          <mu-badge content="套卡" color="#F25643"></mu-badge>
        </div>
      </van-cell>
    </header>

    <!--项目清单-->
    <section>
      <!--可用项目-->
      <van-cell-group class="azm-available marTop12" v-if="availableItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>可用项目</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in availableItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.use_count}}/{{item.num}}</p>
              <p class="azm-money azm-ellipsis" v-if="false">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
          </van-cell>
        </template>
      </van-cell-group>
      <!--可选项目-->
      <van-cell-group class="azm-optional marTop12" v-if="optionalItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>可选项目（{{optionalItem.length}}选1）</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in optionalItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.use_count}}/{{item.num}}</p>
              <p class="azm-money azm-ellipsis" v-if="false">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
            <!--<div class="azm-mask">-->
            <!--<span>已删除</span>-->
            <!--</div>-->
          </van-cell>
        </template>
      </van-cell-group>
      <!--赠送项目-->
      <van-cell-group class="azm-optional marTop12" v-if="giftItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>赠送项目</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in giftItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.use_count}}/{{item.num}}</p>
              <p class="azm-money azm-ellipsis" v-if="false">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
          </van-cell>
        </template>
      </van-cell-group>
    </section>

    <footer class="marTop12">
      <van-cell-group class="" :border="false">
        <van-cell title="套卡ID" :border="false" :value="info.card_id"></van-cell>
        <van-cell title="套卡总价" :border="false" :value="info.origin_total | money_filter('￥ ')"></van-cell>
        <van-cell title="店铺优惠" :border="false" :value="info.shop_discount_money | money_filter('￥ ')"></van-cell>
        <van-cell title="平台优惠" :border="false" :value="info.discount_money | money_filter('￥ ')"></van-cell>
        <van-cell title="实付款" class="azm-actually-paid" :border="false"
                  :value="info.total | money_filter('￥ ')"></van-cell>
      </van-cell-group>
      <van-cell-group class="vux-1px-t" :border="false">
        <van-cell title="订单号：" :border="false" :value="info.order_no"></van-cell>
        <van-cell title="购卡时间：" :border="false" :value="info.create_time"></van-cell>
        <van-cell title="有效期至：" :border="false" :value="info.status_use"></van-cell>
        <van-cell title="购卡状态：" :border="false" :value="info.status_c"></van-cell>
      </van-cell-group>
    </footer>
  </div>
</template>

<script>
  import Avatar from "../../components/avatar/index.vue"
  import { Badge } from "muse-ui"
  import { CellGroup, Cell } from "vant"
  import { mapState } from 'vuex'

  export default {
    components: {
      [Avatar.name]: Avatar,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [Badge.name]: Badge,
    },
    data () {
      return {
        message: '',
        info: {},
        availableItem: [],
        optionalItem: [],
        giftItem: [],
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", 'isMerchantH5'],
    created () {
      let that = this;
      let bill_id = that.$route.query.bill_id
      if (!bill_id) {
        that.$toast.error('无可用订单~')
        return;
      }
      this.$ajax.getOrderCardInfo({bill_id}).finally(res => {
        if (res.status === 1) {
          let data = res.info
          that.info = data.info
          if (data.item0) {
            that.availableItem = data.item0
          }
          if (data.item1) {
            that.optionalItem = data.item1
          }
//            赠送
          if (data.item2) {
            that.giftItem = data.item2
          }
        } else if (res.status === 0) {
          that.$toast.error(res.msg)
        }
      })
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .azm-package-card-order-details {
    header {
      .azm-shop-info {
        .azm-shop-cover {
          width: 60px;
          height: 60px;
        }
        .azm-shop-value {
          position: relative;
          box-sizing: border-box;
          padding-left: 15px;
          .azm-name {
            font-size: 17px;
            color: #171F24;
            line-height: 24px;
          }
          .azm-business {
            margin-top: 12px;
            font-size: 14px;
            line-height: 24px;
            color: #171F24;
          }
        }
      }
      .azm-card-info {
        .azm-card-cover {
          width: 75px;
          height: 47px;
        }
        .azm-card-value {
          position: relative;
          box-sizing: border-box;
          padding-left: 15px;
          .azm-name {
            font-size: 17px;
            color: #323232;
            line-height: 22.5px;
          }
          .azm-num {
            margin-top: 10px;
            font-size: 14px;
            color: #323232;
          }
          .azm-nickname {
            font-size: 14px;
            color: #AAB2B7;
          }
        }
      }
    }
    section {
      .azm-description, .azm-available, .azm-optional, .azm-intro {
        .azm-title {
          position: relative;
          .azm-best-selling-title {
            position: relative;
            padding-left: 15px;
            &:after {
              position: absolute;
              top: 50%;
              left: 0;
              content: ' ';
              width: 3px;
              height: 14px;
              background: #2D81E4;
              border-radius: 4px;
              transform: translate(0, -50%);
            }
          }
        }
      }
      .azm-available, .azm-optional {
        .azm-cell-item {
          position: relative;
          .azm-img {
            width: 83px;
          }
          .azm-mask {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .1);
            width: 100%;
            height: 100%;
            z-index: 10;
            span {
              position: absolute;
              bottom: 15px;
              right: 15px;
              color: #F25643;
            }
          }
        }
        .azm-available-value {
          box-sizing: border-box;
          padding-left: 15px;
          .azm-title {
            line-height: 45/2px;
            font-size: 32/2px;
            color: #333;
          }
          .azm-num {
            margin-top: 4px;
            line-height: 33/2px;
            font-size: 12px;
            color: #666;
          }
          .azm-money {
            margin-top: 12px;
            line-height: 53/2px;
            font-size: 12px;
            color: #999;
            .azm-unit {
              color: #FF7A00;
            }
            .azm-price {
              font-size: 14px;
              color: #FF7A00;
            }
            .azm-market-price {
              font-size: 12px;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
        > li {
          background-color: #fff;
        }
      }
      .azm-description {
        .azm-description-box {
          font-size: 13px;
          color: #666666;
          line-height: 25px;
        }
      }
    }
  }
</style>
<style lang="less">
  .azm-package-card-order-details {
    footer {
      .van-cell-group {
        box-sizing: border-box;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .van-cell {
        padding: 3px 15px;
        font-size: 14px;
        color: #6F7578;
        &.azm-actually-paid {
          .van-cell__title {
            font-size: 14px;
            color: #000000;
          }
          .van-cell__value {
            font-size: 19px;
            color: #FF7A00;
          }
        }
      }
      .vux-1px-t:before {
        left: 15px;
        right: 15px;
      }
    }
  }
</style>
