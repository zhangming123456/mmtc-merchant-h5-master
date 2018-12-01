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

              <div @click.stop="noop" class="t-telephone">
                <a :href="`tel:` + item.phone">
                  <img src="../../assets/client/icon-pgone.png" alt="">
                </a>
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
        <div class="t-title">生日</div>
        <div class="t-clientLabel">
          <checker v-model="birthday" type="radio" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <checker-item value="">全部</checker-item>
            <checker-item :value="item.type" v-for="(item, index) in items.birthday" :key="index">{{item.name}}
            </checker-item>
          </checker>
        </div>
      </div>
      <div class="t-clientTitle">
        <div class="t-title">客户标签</div>
        <div class="t-clientTag">
          <checker v-model="tags" type="radio" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <checker-item value="">全部</checker-item>
            <checker-item :value="item.id" v-for="(item, index) in items.tag" :key="index">{{item.tag}}</checker-item>
          </checker>
        </div>
      </div>

      <!-- <div class="t-consumeTitle">
        <div class="t-title">消费时间</div>
        <div class="fillTime">
          <cell is-link @click.native="beginDateTime(beginTime)">
            <div class="beginTime">
              <span>{{beginTime}}</span>
            </div>
          </cell>
          <div class="cut-off"></div>
          <cell is-link @click.native="overDateTime(overTime)">
            <div class="overTime">
              <span>{{overTime}}</span>
            </div>
          </cell>
        </div>
      </div> -->
      <div class="t-button">
        <span @click="resetLabel">重置</span>
        <span @click="filtrateLabel">确定</span>
      </div>
    </van-popup>

    <van-popup class="show2" v-model="show8" position="bottom">
      <div @click="gotoAddClient">添加新客户</div>
      <div @click="gotoRapid">快速导客</div>
    </van-popup>

 
    <div class="grouping" @click="gotoConsumeRanked">
      <img src="../../assets/grouping.png" alt="">
    </div>
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
      birthday: "",
      items: [],
      num: 10,
      page: 1,
      member_id: 0,
      refreshing: false,
      loading: false,
      loadedAll: false,
      search: "",
      tags: "",
      beginTime: "开始时间",
      overTime: "结束时间",
      currentDate: "",
      selectTime: false
    };
  },
  watch: {},
  created() {
    this.$$$setNarBar({
      rightText: "添加",
      rightBtn: this.AddTo,
      lowerLine: false
    });
    this.getSearch();
    this.$nextTick(function() {
      this.refresh();
    });
  },

  methods: {
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
    gotoConsumeRanked() {
      this.$router.push({
        path: "/client_consumeRanked"
      });
    },
    // 客户生日选择器
    beginDateTime(val) {
      let that = this;
      let toDay = dateFormat(new Date(), "YYYY-MM-DD");
      this.$vux.datetime.show({
        value: val, // 其他参数同 props
        confirmText: "确认",
        cancelText: "取消",
        endDate: toDay,
        minYear: 1700,
        onConfirm(value) {
          that.beginTime = value;
        }
      });
    },
    // 客户生日选择器
    overDateTime(val) {
      let that = this;
      let toDay = dateFormat(new Date(), "YYYY-MM-DD");
      this.$vux.datetime.show({
        value: val, // 其他参数同 props
        confirmText: "确认",
        cancelText: "取消",
        endDate: toDay,
        minYear: 1700,
        onConfirm(value) {
          that.overTime = value;
        }
      });
    },
    //拨打电话
    callphone(item) {
      var telephone = item.Customerlists.telephone;
      window.location.href = "tel:" + telephone;
    },
    // 筛选
    filtrateLabel() {
      let that = this;
      var tag = this.tags;
      var birthday = this.birthday;
      this.getCustomerlists({ tag, birthday });
      that.show9 = !this.show9;
    },

    // 筛选重置
    resetLabel() {
      var that = this;
      that.tags = "";
      that.birthday = "";
    },

    // 搜索
    clickSearch() {
      var keyword = this.search;

      this.getCustomerlists({ keyword });
    },

    refresh() {
      this.refreshing = true;
      try {
        var tag = this.tags;
        var birthday = this.birthday;
        this.getCustomerlists({ tag, birthday }).finally(res => {
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
    getCustomerlists({ page = 1, keyword = "", birthday = "", tag = "" } = {}) {
      let that = this;

      if (this.isGetConsume) return;
      this.$store
        .dispatch("ApiService/getCustomerlists", {
          page,
          keyword,
          birthday,
          tag
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
    // 获取筛选条件
    getSearch() {
      this.$store.dispatch("ApiService/getSearch", {}).then(res => {
        console.log(res);
        if (1 === res.status) {
          this.items = res.info;
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
          justify-content: space-between;
          .t-clientName {
            display: flex;
            align-items: center;
            .azm-username {
              font-size: 36/2px;
              color: #171f24;
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
            font-size: 26/2px;
            color: #aab2b7;
          }
          .t-telephone {
            width: 100/2px;
            height: 100%;
            position: relative;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            > a {
              width: 100%;
              height: 100%;
              display: block;
              img {
                position: absolute;
                right: 0;
                top: 28%;
                width: 50/2px;
                height: 50/2px;
              }
            }
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
      margin-top: 56/2px;
      .t-title {
        font-size: 28/2px;
        color: #2d81e4;
      }
      .fillTime {
        display: flex;
        align-items: center;
        margin-top: 10/2px;
        .beginTime {
          width: 180/2px;
          height: 60/2px;
          border: 1px solid #2d81e4;
          border-radius: 10/2px;
          text-align: center;
          span {
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
            text-align: center;
          }
        }
        .cut-off {
          background-color: #6f7578;
          width: 20/2px;
          height: 3/2px;
          margin-left: 10/2px;
          margin-right: 10/2px;
        }
        .overTime {
          width: 180/2px;
          height: 60/2px;
          border: 1px solid #2d81e4;
          border-radius: 10/2px;
          text-align: center;
          span {
            line-height: 60/2px;
            width: 100%;
            height: 100%;
            color: #2d81e4;
          }
        }
      }
    }
    .t-button {
      position: absolute;
      bottom: 50/2px;
      display: flex;
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
