<template>
  <div class="t-client-details">

    <div @click="gotoClientDetails" v-if="!isMerchantH5">编辑</div>

    <div class="t-clientList">
      <div class="t-clientImg">
        <azm-avatar v-if="CustomerInfo.avatar" :src="CustomerInfo.avatar" shape="round"></azm-avatar>
        <img v-else src="../../assets/client/Bitmap.png">
        <img v-if="CustomerInfo.sex==='0'" class="t-sex" src="../../assets/client/icon-girl.png" alt="">
        <img v-if="CustomerInfo.sex==='1'" class="t-sex" src="../../assets/client/icon-boy.png" alt="">
      </div>
      <div class="t-clientInfo">
        <div class="">
          <div class="t-clientName">
            <span>{{CustomerInfo.username}}</span>
            <div v-if="CustomerInfo.tag" :style="{background:CustomerInfo.tag.color}" class="t-new">{{CustomerInfo.tag.tag}}</div>
            <div class="t-birthday" v-if="CustomerInfo.is_birthday===1">
              <img src="../../assets/client/icon-birthday.png" alt="">
            </div>
          </div>
          <div class="t-phone">{{CustomerInfo.telephone}}</div>
        </div>
        <a class="t-telephone" :href="'tel:'+CustomerInfo.telephone">
          <img src="../../assets/client/icon-pgone.png" alt="">
        </a>
      </div>
    </div>
    <van-tabs v-model="active">
      <van-tab title="基本信息">

        <van-cell v-if="CustomerInfo.nickname" title="微信昵称" v-model="CustomerInfo.nickname" />
        <van-cell v-if="CustomerInfo.birthday" title="生日" v-model="CustomerInfo.birthday" />
        <van-cell v-if="CustomerInfo.source" title="客户来源" v-model="CustomerInfo.source" />
        <van-cell v-if="CustomerInfo.referee" title="推荐人" v-model="CustomerInfo.referee" />
        <van-cell v-if="CustomerInfo.company" title="工作单位" v-model="CustomerInfo.company" />
        <van-cell v-if="CustomerInfo.position" title="职位" v-model="CustomerInfo.position" />
        <van-cell v-if="CustomerInfo.address" title="联系地址" v-model="CustomerInfo.address" />
        <van-cell v-if="CustomerInfo.special" title="特殊需求" v-model="CustomerInfo.special" />
      </van-tab>
      <van-tab title="客户数据">

        <div class="t-history" v-if="customerData.history && customerData.history.length>=1">
          <div class="t-more">
            <span>历史消费构成</span>
            <span @click=" gotoPayConstitute">更多</span>
          </div>
          <div class="t-shopInfo" v-if="index < 3" v-for="(item, index) in customerData.history" :key="index">
            <div class="t-shopImg">
              <!-- <img src="http://pic1.win4000.com/pic/b/30/5d2185025d.jpg" alt=""> -->
              <azm-avatar :src="item.cover"></azm-avatar>

            </div>
            <div class="t-shopContent">
              <div class="t-shopTitle">
                <span>{{item.item_name}}</span>
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
              </div>
            </div>
          </div>
        </div>
        <div class="t-history" v-if="customerData.order && customerData.order.length>=1">
          <div class="t-more">
            <span>最近订单记录</span>
            <span @click="gotoOrderRecord">更多</span>
          </div>
          <div class="t-shopInfo" @click="getOrderInfo(item)" v-if="index < 1" v-for="(item, index) in customerData.order" :key="index">
            <div class="t-shopImg">
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
                  <span class="t-oldPrice">￥{{item.origin_total}}</span>
                </div>
                <div class="t-time">{{item.pay_time}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="t-history" v-if="customerData.consume && customerData.consume.length>=1">
          <div class="t-more">
            <span>最近消耗记录</span>
            <span @click=" gotoExpendRecord">更多</span>
          </div>
          <div class="t-shopInfo" @click="gotoExpendDetails(item)" v-if="index < 1" v-for="(item, index) in customerData.consume" :key="index">
            <div class="t-shopImg">
              <!-- <img src="http://pic1.win4000.com/pic/b/30/5d2185025d.jpg" alt=""> -->
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
        </div>

        <template v-if=" customerData.history && customerData.history.length<1  && customerData.order && customerData.order.length<1 && customerData.consume && customerData.consume.length<1">
          <div class="description">
            该用户在本店无任何消费数据！
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { isMerchantH5 } from "../../libs/util";
import Avatar from "../../components/avatar/index.vue";
import { mapState } from "vuex";
import { Tab, Tabs, Cell, CellGroup } from "vant";

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cell.name]: Cell,
    [Avatar.name]: Avatar,
    [CellGroup.name]: CellGroup
  },
  computed: {
    ...mapState({})
  },
  data() {
    return {
      isMerchantH5,
      active: 0,
      CustomerInfo: {},
      customerData: [],
      showAll: false
    };
  },
  watch: {},
  created() {
    this.getCustomerInfo();
    this.getcustomerData();
  },

  methods: {
    // 获取客户信息
    getCustomerInfo() {
      var id = this.$route.query.id;
      this.$store.dispatch("ApiService/getCustomerInfo", { id }).then(res => {
        console.log(res);
        if (1 === res.status) {
          this.CustomerInfo = res.info;
        }
      });
    },

    // 获取客户数据
    getcustomerData(e) {
      let that = this;
      var member_id = this.$route.query.member_id;
      this.$store
        .dispatch("ApiService/getcustomerData", { member_id })
        .then(res => {
          console.log(res);
          if (1 === res.status) {
            this.customerData = res.info;
          }
        });
    },

    gotoPayConstitute() {
      var member_id = this.$route.query.member_id;
      this.$router.push({
        path: "/client_payConstitute",
        query: { member_id }
      });
    },

    // 跳转到更多历史消费构成列表
    gotoOrderRecord() {
      var member_id = this.$route.query.member_id;
      this.$router.push({
        path: "/client_orderRecord?member_id=" + member_id
      });
    },

    // 跳转到更多最近订单记录列表
    gotoExpendRecord() {
      var member_id = this.$route.query.member_id;
      this.$router.push({
        path: "/client_expendRecord?member_id=" + member_id
      });
    },
    // 调转到订单详情
    getOrderInfo(item) {
      var id = item.id;
      this.$router.push({
        path: "/client_orderDetails?id=" + id
      });
    },

    // 跳转到消耗详情
    gotoExpendDetails(item) {
      var info_id = item.info_id;
      this.$router.push({
        path: "/client_expendDetails?info_id=" + info_id
      });
    },

    // 跳转到编辑客户信息
    gotoClientDetails() {
      var id = this.$route.query.id;
      this.$router.push({
        path: "/client_addClient?id=" + id
      });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-details {
  .t-clientList {
    width: 690/2px;
    background-color: #ffffff;
    padding: 34/2px 30/2px;
    display: flex;
    box-sizing: border-box;
    margin: auto;
    margin-top: 35/2px;
    box-shadow: 0 8/2px 10/2px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4/2px;
    .t-clientImg {
      width: 120/2px;
      height: 120/2px;
      border-radius: 50%;
      margin-right: 30/2px;
      position: relative;
      .t-sex {
        width: 35/2px;
        height: 35/2px;
        position: absolute;
        bottom: -2px;
        right: 5px;
      }
      img {
        width: 120/2px;
        height: 120/2px;
        border-radius: 50%;
      }
    }
    .t-clientInfo {
      flex: 1;
      display: flex;
      justify-content: space-between;

      .t-clientName {
        display: flex;
        align-items: center;
        margin-bottom: 20/2px;
        > span:first-child {
          font-size: 36/2px;
          color: #171f24;
          font-weight: 500;
          margin-right: 42/2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .t-new {
          line-height: 30/2px;
          text-align: center;
          border-radius: 4/2px;
          background: #95de64;
          padding-left: 5/2px;
          padding-right: 5/2px;
          height: 30/2px;
          font-size: 24/2px;
          color: #ffffff;
        }
        .t-birthday {
          display: flex;
          img {
            width: 30/2px;
            height: 30/2px;
          }
          > span {
            display: block;
            margin-left: 2px;
            margin-top: -2px;
            font-size: 16/2px;
            color: #fadb14;
          }
        }
      }
      .t-phone {
        font-size: 28/2px;
        color: #323232;
      }
      .t-telephone {
        width: 50/2px;
        height: 50/2px;
        line-height: 80px;
        img {
          width: 50/2px;
          height: 50/2px;
        }
      }
    }
  }
  .van-tabs {
    margin-top: 30/2px;
    .description {
      font-size: 28/2px;
      color: #aab2b7;
      text-align: center;
      margin-top: 162/2px;
    }

    .t-history {
      .t-more {
        display: flex;
        align-items: center;
        height: 60/2px;
        justify-content: space-between;
        padding-left: 30/2px;
        padding-right: 30/2px;
        font-size: 26/2px;
        > span:first-child {
          color: #6f7578;
        }
        > span:last-child {
          color: #2d81e4;
        }
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

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

          .t-price:nth-child(2) {
            margin-top: 55/2px;
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
  }
}
</style>

<style lang='less'>
.t-client-details {
  .van-tabs {
    .van-tabs__wrap {
      .van-tabs__nav {
        .van-tabs__line {
          opacity: 0;
        }
        .van-tab--active {
          color: #2d81e4;
        }
        .van-tab {
          border: 1px solid #f5f5f5;
          border-left: 0;
        }
        .van-tab:last-child {
          border-right: 0;
        }
      }
    }
  }
  .van-hairline:after {
    border: 0;
  }
  .van-cell {
    border-bottom: 1px solid #f5f5f5;
    .van-cell__title {
      font-size: 28/2px;
      color: #6f7578;
    }
    .van-cell__value {
      font-size: 28/2px;
      color: #323232;
    }
  }
}
</style>

