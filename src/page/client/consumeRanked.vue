<template>
  <div class="t-client-index">
    <div class="t-search">
      <van-search style="background: #FFFFFF;" v-model="search" placeholder="请输入客户姓名或手机号码">
      </van-search>
      <span v-if='search.length>=1' @click="clickSearch">确认</span>
      <span v-else @click="showPopup">筛选</span>
    </div>
    <div class="clientList">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loadedAll" @load="load">
        <template v-for="(val, i) in Customerlists">
          <div class="t-clientList vux-1px-b" @click="gotoDetails(item)" v-for="(item,index) in val" data-type="0" :key="item.id">
            <div class="t-clientImg">
              <azm-avatar v-if="item.avatar" :src="item.avatar" shape="round"></azm-avatar>
              <img v-else src="../../assets/client/Bitmap.png">
              <img v-if="item.sex==='0'" class="t-sex" src="../../assets/client/icon-girl.png" alt="">
              <img v-if="item.sex==='1'" class="t-sex" src="../../assets/client/icon-boy.png" alt="">
            </div>
            <div class="t-clientInfo">
              <div class="">
                <div class="t-clientName">
                  <span class="azm-username" v-if="item.username">{{item.username}}</span>
                  <span :style="'background:'+item.color" class="t-new" v-if="item.tag_name">{{item.tag_name}}</span>
                  <div class="t-birthday" v-if="item.is_birthday===1">
                    <img src="../../assets/client/icon-birthday.png" alt="">
                  </div>
                </div>
                <div class="t-phone">{{item.telephone}}</div>
              </div>

              <div class="t-telephone">
                <span>¥{{item.total}}</span>
              </div>
            </div>
          </div>
        </template>

        <template v-if="Customerlists && Customerlists.length<1">
          <div class="description">
            <img src="../../assets/client/Artwork.png" alt="">
            <span>暂无顾客哦~</span>
          </div>
        </template>
      </mu-load-more>

    </div>
    <van-popup v-model="show9" position="right">
      <div class="t-clientBirthday">
        <div class="t-title">消费时间</div>

        <div class="t-clientLabel">
          <checker v-model="type_name" @click.native="selectChecker" type="radio" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <checker-item value="0">全部</checker-item>
            <checker-item value="1">本月</checker-item>
            <checker-item value="2">近三月</checker-item>
            <checker-item value="3">本年</checker-item>
          </checker>
        </div>

      </div>

      <div class="t-consumeTitle">
        <div class="fillTime">
          <cell @click.native="beginDateTime(beginTime)">
            <div :class="isClass===true?'active':'beginTime'">
              <span v-if="beginTime">{{beginTime}}</span>
              <span style="color:#cccccc" v-else>开始时间</span>
            </div>
          </cell>
          <div class="cut-off"></div>
          <cell @click.native="overDateTime(overTime)">
            <div :class="isClass2===true?'active2':'overTime'">
              <span v-if="overTime">{{overTime}}</span>
              <span style="color:#cccccc" v-else>结束时间</span>
            </div>
          </cell>
        </div>
      </div>

      <div class="t-consumeTitle">
        <div class="t-title">消费金额</div>
        <div class="fillTime">
          <div class="beginTime" style=" border: 1px solid #2d81e4;">
            <input type="number" v-model="total_start" placeholder="消费最低金额">
            <!-- <input v-if="total_start">{{total_start}}</input> -->
            <!-- <span v-else>消费最低金额</span> -->
          </div>
          <div class="cut-off"></div>
          <div class="overTime" style=" border: 1px solid #2d81e4;">
            <input type="number" v-model="total_end" v-on:input="inputFunc" placeholder="消费最高金额">
            <!-- <span v-if="total_end">{{total_end}}</span>
            <span v-else>消费最高金额</span> -->
          </div>

        </div>
      </div>
      <div class="t-button">
        <span @click="resetLabel">重置</span>
        <span @click="filtrateLabel">确定</span>
      </div>
    </van-popup>

    <van-popup class="show2" v-model="show8" position="bottom">
      <div @click="gotoAddClient">添加新客户</div>
      <div @click="gotoRapid">快速导客</div>
    </van-popup>

  </div>
</template>

<script>
import { isMerchantH5 } from "../../libs/util";
import { Search, Icon, Popup, DatetimePicker } from "vant";
import { mapState } from "vuex";
import Avatar from "../../components/avatar/index.vue";
import { Checker, CheckerItem, Cell, dateFormat } from "vux";
import { LoadMore, Paper, Badge } from "muse-ui";

export default {
  components: {
    [Avatar.name]: Avatar,
    [Search.name]: Search,
    [Icon.name]: Icon,
    [Avatar.name]: Avatar,
    [Popup.name]: Popup,
    Checker,
    CheckerItem,
    Cell,
    [Badge.name]: Badge,
    [Paper.name]: Paper,
    [LoadMore.name]: LoadMore,
    [DatetimePicker.name]: DatetimePicker
  },
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  inject: ["$$$setNarBar"],
  data() {
    return {
      show9: false,
      show8: false,
      Customerlists: [],
      type_name: "0",
      items: [],
      num: 10,
      page: 1,
      member_id: 0,
      refreshing: false,
      loading: false,
      loadedAll: false,
      search: "",
      tags: "",
      beginTime: "",
      overTime: "",
      currentDate: "",
      selectTime: false,
      total_start: "",
      total_end: "",
      isClass: false,
      isClass2: false
    };
  },
  watch: {},
  created() {
    this.$$$setNarBar({
      rightText: "添加",
      rightBtn: this.AddTo,
      lowerLine: false
    });
    this.$nextTick(function() {
      this.refresh();
    });
  },

  methods: {
    inputFunc() {},
    noop() {},
    getSelectTime() {
      this.selectTime = !this.selectTime;
    },
    confirm() {
      console.log(111111111);
    },
    cancel() {
      this.selectTime = !this.selectTime;
    },
    selectChecker() {
      this.beginTime = "";
      this.overTime = "";
      this.isClass = false;
      this.isClass2 = false;
    },
    // 客户生日选择器
    beginDateTime(val) {
      let that = this;
      let toDay = dateFormat(new Date(), "YYYY-MM-DD");
      this.isClass = true;
      this.$vux.datetime.show({
        value: val, // 其他参数同 props
        confirmText: "确认",
        cancelText: "取消",
        endDate: toDay,
        minYear: 1700,
        onConfirm(value) {
          that.beginTime = value;
          that.type_name = "";
        }
      });
    },
    // 客户生日选择器
    overDateTime(val) {
      let that = this;
      let t = that.beginTime;
      let toDay = dateFormat(new Date(), "YYYY-MM-DD");
      this.isClass2 = true;
      this.$vux.datetime.show({
        value: val, // 其他参数同 props
        confirmText: "确认",
        cancelText: "取消",
        startDate: t,

        minYear: 1700,
        onConfirm(value) {
          that.overTime = value;
        }
      });
    },

    // 筛选
    filtrateLabel() {
      let that = this;
      var type_name = this.type_name;
      var date_start = this.beginTime;
      var date_end = this.overTime;
      var total_start = Number(this.total_start);
      var total_end = Number(this.total_end);
      if (total_start > total_end) {
        var end = this.total_end;
        this.total_end = this.total_start;
        this.total_start = end;
      }

      this.getCustomerlists({
        type_name,
        date_start,
        date_end,
        total_start,
        total_end
      });
      that.show9 = !this.show9;
    },

    // 筛选重置
    resetLabel() {
      var that = this;
      that.type_name = "0";
      that.beginTime = "";
      that.overTime = "";
      that.total_start = "";
      that.total_end = "";
    },

    // 搜索
    clickSearch() {
      var keyword = this.search;
      this.getCustomerlists({ keyword });
    },

    refresh() {
      this.refreshing = true;
      try {
        var keyword = this.search;
        var type_name = this.type_name;
        var date_start = this.beginTime;
        var date_end = this.overTime;
        var total_start = this.total_start;
        var total_end = this.total_end;
        this.getCustomerlists({
          keyword,
          type_name,
          date_start,
          date_end,
          total_start,
          total_end
        }).finally(res => {
          this.refreshing = false;
        });
      } catch (err) {
        this.refreshing = false;
      }
    },
    load() {
      this.loading = true;
      let page = this.page;
      this.getCustomerlists({ page: page });
    },
    // 获取客户数据
    getCustomerlists({
      page = 1,
      type_name = "",
      date_start = "",
      date_end = "",
      total_start = "",
      total_end = "",
      keyword = ""
    } = {}) {
      let that = this;

      if (this.isGetConsume) return;
      this.$store
        .dispatch("ApiService/getCustomerGetRanking", {
          page,
          type_name,
          date_start,
          date_end,
          total_start,
          total_end,
          keyword
        })
        .then(res => {
          this.loading = false;
          this.isGetConsume = false;
          if (1 === res.status) {
            let info = res.info;
            if (info.length > 0) {
              if (page === 1) {
                that.Customerlists = [info];
              } else {
                that.Customerlists[`${page - 1}`] = info;
              }
              that.page = page + 1;
              that.loadedAll = info.length !== 10;
            } else if (info.length === 0) {
              if (page > 1) {
                that.page = pagep - 1;
              } else {
                that.Customerlists = [];
              }
              that.loadedAll = true;
            }
          }
        });
    },

    showPopup() {
      let that = this;
      that.show9 = !this.show9;
    },
    // 添加
    AddTo() {
      let that = this;
      that.show8 = !this.show8;
    },
    // 跳转到快速导客
    gotoRapid() {
      this.$router.push({
        path: "/client_getClient"
      });
    },
    gotoDetails(e) {
      var id = e.id;
      var member_id = e.member_id;
      this.$router.push({
        path: "/client_details?id=" + id + "&member_id=" + member_id
      });
    },
    gotoAddClient() {
      this.$router.push({
        path: "/client_addClient"
      });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-index {
  .t-search {
    background: #ffffff;
    height: 90/2px;
    width: 100%;
    padding-right: 30/2px;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    > span {
      font-size: 28/2px;
      color: #6f7578;
      line-height: 60/2px;
    }
  }
  .clientList {
    .mu-load-more {
      .t-clientList:first-child {
        margin-top: 110/2px;
      }
      .t-clientList {
        position: relative;
        padding: 30/2px;
        background: #ffffff;
        box-sizing: border-box;
        display: flex;
        .t-clientImg {
          width: 90/2px;
          height: 90/2px;
          border-radius: 50%;
          margin-right: 30/2px;
          position: relative;
          .t-sex {
            width: 35/2px;
            height: 35/2px;
            position: absolute;
            bottom: -5px;
            right: 4px;
          }
          img {
            width: 90/2px;
            height: 90/2px;
            border-radius: 50%;
          }
        }
        .t-clientInfo {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .t-clientName {
            display: flex;
            align-items: center;
            .azm-username {
              font-size: 36/2px;
              color: #171f24;
              margin-right: 42/2px;
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
              margin-right: 32/2px;
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
            font-size: 26/2px;
            color: #aab2b7;
          }
          .t-telephone {
            font-size: 26/2px;
          }
        }
        &::after {
          left: 152/2px;
        }
        &:nth-last-child(1) {
          &::after {
            border: none;
          }
        }
      }
    }
    .description {
      text-align: center;
      margin-top: 253/2px;
      img {
        width: 100%;
        height: 274/2px;
      }
      span {
        font-size: 32/2px;
        color: #aab2b7;
      }
    }
  }

  .van-popup {
    height: 100%;
    width: 500/2px;
    padding-left: 30/2px;
    padding-right: 30/2px;
    padding-top: 50/2px;
    box-sizing: border-box;
    .t-clientBirthday {
      .t-title {
        font-size: 28/2px;
        color: #2d81e4;
      }
      .t-clientLabel {
        display: flex;
        margin-top: 25/2px;
        .vux-checker-item {
          border: 1px solid #aab2b7;
          border-radius: 8/2px;
          width: 90/2px;
          height: 60/2px;
          line-height: 60/2px;
          text-align: center;
          font-size: 28/2px;
          color: #333333;
          margin-right: 30/2px;
        }
        .demo1-item-selected {
          border: 1px solid #2d81e4;
          color: #2d81e4;
        }
        span {
          border: 1px solid #aab2b7;
          border-radius: 8/2px;
          width: 90/2px;
          height: 60/2px;
          line-height: 60/2px;
          text-align: center;
          font-size: 28/2px;
          color: #333333;
          margin-right: 30/2px;
        }
      }
    }

    .t-clientTitle {
      margin-top: 56/2px;
      .t-title {
        font-size: 28/2px;
        color: #2d81e4;
      }
      .t-clientTag {
        display: flex;
        margin-top: 25/2px;
        .vux-checker-item {
          box-sizing: border-box;
          border: 1px solid #aab2b7;
          border-radius: 8/2px;
          height: 60/2px;
          line-height: 60/2px;
          padding-left: 15/2px;
          padding-right: 15/2px;
          font-size: 28/2px;
          color: #333333;
          margin-right: 30/2px;
        }
        .demo1-item-selected {
          border: 1px solid #2d81e4;
          color: #2d81e4;
        }
        .t-tag {
          display: flex;
          flex-wrap: wrap;

          span {
            box-sizing: border-box;
            border: 1px solid #aab2b7;
            border-radius: 8/2px;
            height: 60/2px;
            line-height: 60/2px;
            padding-left: 15/2px;
            padding-right: 15/2px;
            font-size: 28/2px;
            color: #333333;
            margin-right: 30/2px;
          }
        }
        .t-all {
          border: 1px solid #aab2b7;
          border-radius: 8/2px;
          width: 90/2px;
          height: 60/2px;
          line-height: 60/2px;
          text-align: center;
          font-size: 28/2px;
          color: #333333;
          margin-right: 30/2px;
        }
      }
    }
    .t-consumeTitle {
      margin-top: 30/2px;
      .t-title {
        font-size: 28/2px;
        color: #2d81e4;
      }
      .fillTime {
        display: flex;
        align-items: center;
        margin-top: 10/2px;

        .active {
          width: 180/2px;
          height: 60/2px;
          border-radius: 10/2px;
          color: #2d81e4;
          border: 1px solid #2d81e4;
          text-align: center;
          span {
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
          }
        }

        .beginTime {
          width: 180/2px;
          height: 60/2px;
          border-radius: 10/2px;
          color: #2d81e4;
          border: 1px solid #cccccc;
          text-align: center;
          input {
            border: 0;
            border-radius: 10/2px;
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
            text-align: center;
          }
          span {
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
          }
        }
        .cut-off {
          background-color: #6f7578;
          width: 20/2px;
          height: 3/2px;
          margin-left: 10/2px;
          margin-right: 10/2px;
        }

        .active2 {
          width: 180/2px;
          height: 60/2px;
          border-radius: 10/2px;
          color: #2d81e4;
          border: 1px solid #2d81e4;
          text-align: center;
          span {
            border-radius: 10/2px;
            display: block;
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
          }
        }

        .overTime {
          border: 1px solid #cccccc;
          width: 180/2px;
          height: 60/2px;
          border-radius: 10/2px;
          color: #2d81e4;
          text-align: center;
          input {
            border: 0;
            border-radius: 10/2px;
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
            text-align: center;
          }
          span {
            border-radius: 10/2px;
            display: block;
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
          }
        }
      }
    }
    .t-button {
      margin-top: 550/2px;
      display: flex;
      // position: fixed;
      // bottom: 30/2px;
      > span:first-child {
        display: block;
        border: 1px solid #2d81e4;
        border-radius: 10/2px;
        width: 211/2px;
        height: 80/2px;
        line-height: 80/2px;
        text-align: center;
        font-size: 32/2px;
        margin-right: 30/2px;
        color: #2d81e4;
      }
      > span:last-child {
        display: block;
        background: #2d81e4;
        border-radius: 10/2px;
        width: 211/2px;
        height: 80/2px;
        line-height: 80/2px;
        text-align: center;
        font-size: 32/2px;
        color: #ffffff;
      }
    }
  }

  .show2 {
    width: 100%;
    height: 240/2px;
    padding-top: 0;
    padding-top: 30/2px;
    div {
      width: 690/2px;
      height: 80/2px;
      border: 1px solid #2d81e4;
      border-radius: 10/2px;
      font-size: 32/2px;
      color: #2d81e4;
      text-align: center;
      line-height: 80/2px;
      margin-bottom: 20/2px;
    }
  }
  .select-Time {
    width: 100%;
    height: 500/2px;
    padding: 0;
  }

  .grouping {
    position: fixed;
    bottom: 50/2px;
    right: 30/2px;
    img {
      width: 140/2px;
      height: 140/2px;
    }
  }
}
</style>
<style lang='less'>
.t-client-index {
  .mu-load-more {
    margin-top: 110/2px;
  }
  .t-search {
    z-index: 100;
    .van-search {
      height: 60/2px;
      width: 86%;
      padding-right: 0;
      margin-right: 35/2px;
      .van-cell {
        background: #fafafa;
        border: 1px solid #f5f5f5;
        border-radius: 8/2px;
        .van-cell__value {
          .van-field__body {
            .van-field__control {
              font-size: 32/2px;
              color: #333333;
            }
          }
        }
      }
      .van-search__action {
        font-size: 28/2px;
        color: #6f7578;
      }
    }
  }
  .van-popup {
    .vux-checker-box {
      .vux-checker-item {
        margin-bottom: 20/2px;
      }
    }
  }
  .weui-cell {
    padding: 0;
  }

  .weui-cell:before {
    border: 0;
  }
}

.dp-container {
  .dp-header {
    font-size: 28/2px;
    color: #2d81e4;
    .dp-item {
      font-size: 28/2px;
      color: #2d81e4;
    }
  }
}

.weui-cell:before {
  border: none;
}
</style>
