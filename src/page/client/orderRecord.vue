<template>
  <div class="t-client-orderRecord azm-load-more-wrap">
    <div class="azm-load-more-item">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loadedAll" @load="load">
        <template v-for="(val, i) in orderlList">
          <div class="t-shopInfo" v-for="(item, index) in val" :key="item.info_id" @click="gotoOrderDetails(item)">
            <div class="t-shopImg">
              <!-- <img src="http://pic1.win4000.com/pic/b/30/5d2185025d.jpg" alt=""> -->
              <azm-avatar :src="item.cover"></azm-avatar>
            </div>
            <div class="t-shopContent">
              <div class="t-shopTitle">
                <span>{{item.title}}</span>
                <span class="t-shopLabel">{{item.order_status}}</span>

              </div>
              <!-- <div class="t-shopNum">单数：12</div> -->
              <div class="t-price">
                <div class="t-flex">
                  <div class="t-newPrice">
                    <span>￥</span>
                    <span>{{item.price}}</span>
                  </div>
                  <!-- <span class="t-oldPrice">￥432</span> -->
                </div>
                <div class="t-time">{{item.pay_time}}</div>
              </div>
              <!-- <div class="t-tiem">1/2</div> -->
            </div>
          </div>
        </template>
      </mu-load-more>
    </div>
  </div>
</template>

<script>
import Avatar from "../../components/avatar/index.vue";
import { mapState } from "vuex";
import { LoadMore, Paper, Badge } from "muse-ui";

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
      orderlList: [],
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
        this.getOrder().finally(res => {
          this.refreshing = false;
        });
      } catch (err) {
        this.refreshing = false;
      }
    },
    load() {
      this.loading = true;
      let page = this.page;
      this.getOrder({ page: page });
    },
    getOrder({ page = 1 } = {}) {
      let that = this;
      let member_id = this.member_id;
      if (this.isGetConsume) return;
      this.isGetConsume = true;
      return this.$store
        .dispatch("ApiService/getOrder", { page, member_id })
        .finally(res => {
          this.loading = false;
          this.isGetConsume = false;
          if (1 === res.status) {
            let info = res.info;
            if (info.length > 0) {
              if (page === 1) {
                that.orderlList = [info];
              } else {
                that.orderlList[`${page - 1}`] = info;
              }
              that.page = page + 1;
              that.loadedAll = info.length !== 10;
            } else if (info.length === 0) {
              if (page > 1) {
                that.page = page - 1;
              } else {
                that.orderlList = [];
              }
              that.loadedAll = true;
            }
            that.$forceUpdate();
          }
        });
    },
    // 调转到订单详情
    gotoOrderDetails(item) {
      console.log(item, 4444444444);
      var id = item.id;
      this.$router.push({
        path: "/client_orderDetails?id=" + id
      });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-orderRecord {
  .mu-load-more {
    width: 100%;
    min-height: 100%;
  }
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
        margin-top: 20/2px;
      }
      .t-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50/2px;
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

