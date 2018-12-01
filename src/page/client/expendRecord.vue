<template>
  <div class="t-client-orderRecord">
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loadedAll" @load="load">
      <template v-for="(val, i) in consumeList">
        <div class="t-shopInfo" v-for="(item, index) in val" @click="gotoOrderDetails(item)" :key="index">
          <div class="t-shopImg">
            <azm-avatar :src="item.cover"></azm-avatar>
          </div>
          <div class="t-shopContent">
            <div class="t-shopTitle">
              <span>{{item.card_name}}</span>
              <span v-if="item.status==0" class="t-shopLabel">消耗中</span>
              <span v-if="item.status==1" class="t-shopLabel">消耗完</span>
            </div>
            <div class="t-shopNum">单数：{{item.num}}</div>
            <div class="t-price">
              <div class="t-flex">
                <div class="t-newPrice">
                  <span>￥</span>
                  <span>{{item.price}}</span>
                </div>
                <span class="t-oldPrice">￥{{item.market_price}}</span>
              </div>
              <div class="t-time">{{item.used_date_time}}</div>
            </div>
            <div class="t-tiem">{{item.used}}/{{item.num}}</div>
          </div>
        </div>
      </template>
    </mu-load-more>
  </div>
</template>

<script>
import Avatar from "../../components/avatar/index.vue";
import { LoadMore, Paper, Badge } from "muse-ui";

import { mapState } from "vuex";
export default {
  components: {
    [Avatar.name]: Avatar,
    [Badge.name]: Badge,
    [Paper.name]: Paper,
    [LoadMore.name]: LoadMore
  },
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  data() {
    return {
      consumeList: [],
      num: 10,
      page: 1,
      member_id: 0,
      refreshing: false,
      loading: false,
      loadedAll: false
    };
  },
  watch: {},
  created() {
    this.member_id = this.$route.query.member_id;
    this.$nextTick(function() {
      this.refresh();
    });
  },

  methods: {
    refresh() {
      this.refreshing = true;
      try {
        this.getConsume().finally(res => {
          this.refreshing = false;
        });
      } catch (err) {
        this.refreshing = false;
      }
    },
    load() {
      this.loading = true;
      let page = this.page;
      this.getConsume({ page: page });
    },

    // 获取最近订单记录
    getConsume({ page = 1 } = {}) {
      let that = this;
      let member_id = this.member_id;
      if (this.isGetConsume) return;
      this.isGetConsume = true;
      return this.$store
        .dispatch("ApiService/getConsume", { page, member_id })
        .finally(res => {
          this.loading = false;
          this.isGetConsume = false;
          if (1 === res.status) {
            let info = res.info;
            if (info.length > 0) {
              if (page === 1) {
                that.consumeList = [info];
              } else {
                that.consumeList[`${page - 1}`] = info;
              }
              that.page = page + 1;
              that.loadedAll = info.length !== 10;
            } else if (info.length === 0) {
              if (page > 1) {
                that.page = pagep - 1;
              } else {
                that.consumeList = [];
              }
              that.loadedAll = true;
            }
          }
        });
    },

    // 调转到订单详情
    gotoOrderDetails(item) {
      var info_id = item.info_id;
      this.$router.push({
        path: "/client_expendDetails",
        query: { info_id }
      });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-orderRecord {
  .t-shopInfo:first-child {
    margin-top: 20/2px;
  }
  .t-shopInfo {
    padding: 30/2px;
    background-color: #ffffff;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

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
        margin-top: 25/2px;
      }
      .t-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
}
</style>

