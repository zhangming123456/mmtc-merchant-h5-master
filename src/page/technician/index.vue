<template>
  <div class="t-tcManage">
    <template v-if="Technician.length&&Technician.length>0">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
         <div class="t-container">
        <ul>
          <li class="t-list-item " v-for="(item,index) in Technician" data-type="0" :key="index">
            <div class="t-list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd"
                 @click="technicianDetails(item)">
              <div class="t-list-img">
                <azm-avatar :src="item.avatar" shape="round"></azm-avatar>
              </div>
              <div class="t-list-content">
                <div class="t-name">
                  <span>{{item.username}}</span>
                  <span>{{item.type}}</span>
                </div>
                <p class="t-tips">{{item.shop_name}}</p>
                <azm-rate :rateNum="+item.major_score"></azm-rate>
              </div>
            </div>
            <div class="t-delete" @click="deleteItem(item,index,$event)">删除</div>
            <div class="t-score">{{item.major_score}}分</div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>

    </template>
    <azm-abnor class="azm-abnor" v-else type="EMPTY_ORDERS"></azm-abnor>
    <div class="t-addTechnician" @click="addTechnician">+添加技师</div>
  </div>
</template>

<script>
import { Row, Col, Cell, CellGroup, Icon, PullRefresh } from "vant";
import Abnor from "../../components/abnor/index.vue";
import Rate from "../../components/rate/index.vue";
import Avatar from "../../components/avatar/index.vue";
import { mapState } from "vuex";
export default {
  components: {
    [Abnor.name]: Abnor,
    [Rate.name]: Rate,
    [Avatar.name]: Avatar,
    [PullRefresh.name]: PullRefresh
  },
  computed: {
    ...mapState({
      shoploginData: state => state.merchant.shoploginData,
      merchantData: state => state.merchant.merchantData,
      $location: state => state.ApiService.$location
    })
  },

  data() {
    return {
      startX: 0,
      endX: 0,
      Technician: [],
      count: 0,
      isLoading: false
    };
  },
  watch: {},
  created() {
    this.gatTechnician();
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.count++;
        this.gatTechnician();
      }, 500);
    },
    // 获取店铺技师
    gatTechnician() {
      this.$store.dispatch("ApiService/getTechnicianList", {}).then(res => {
        console.log(res);
        if (1 === res.status) {
          this.Technician = res.info;
        }
      });
    },

    // 跳转添加技师
    addTechnician() {
      this.$router.push({
        path: "/technician_tcDetails"
      });
    },

    //跳转到技师详情
    technicianDetails(e) {
      console.log(e, 522222222222222);
      var id = e.id;
      var shop_id = e.shop_id;
      this.$router.push({
        path: "/technician_tcDetails?id=" + id + "&shop_id=" + shop_id
      });
    },
    //滑动开始
    touchStart(e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX;
    },
    //滑动结束
    touchEnd(e) {
      // 当前滑动的父级元素
      console.log(e, 111111111111111111111111111);

      let parentElement = e.currentTarget.parentElement; // 记录结束位置

      this.endX = e.changedTouches[0].clientX;
      // 左滑
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      // 右滑
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      this.startX = 0;
      this.endX = 0;
    },
    //判断当前是否有滑块处于滑动状态
    checkSlide() {
      let listItems = document.querySelectorAll(".t-list-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    //复位滑动状态
    restSlide() {
      let listItems = document.querySelectorAll(".t-list-item");
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0;
      }
    },
    //删除技师
    deleteItem(item, index, e) {
      // 当前索引
      console.log(e);
      var id = item.id;
      var shop_id = item.shop_id;

      this.$store
        .dispatch("ApiService/getTechnicianDel", { id, shop_id })
        .then(res => {
          console.log(res);
          if (1 === res.status) {
            this.restSlide();
            this.Technician.splice(index, 1);
          }
        });
    }
  }
};
</script>

<style scoped lang='less'>
.t-tcManage {
  .t-container {
    overflow: hidden;
    .t-list-item {
      position: relative;
      height: 184/2px;
      -webkit-transition: all 0.2s;
      transition: all 0.2s;
      box-sizing: border-box;
      background: #fff;

      &:last-child {
        margin-bottom: 100/2px;
      }
      .t-score {
        position: absolute;
        color: #666666;
        top: 118/2px;
        left: 383/2px;
        font-size: 28/2px;
      }
    }
    .t-list-item[data-type="0"] {
      transform: translate3d(0, 0, 0);
    }
    .t-list-item[data-type="1"] {
      transform: translate3d(-116/2px, 0, 0);
    }
    .t-list-item:after {
      content: " ";
      position: absolute;
      left: 4px;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ccc;
      color: #ccc;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .t-list-box {
      padding-left: 30/2px;
      padding-right: 30/2px;
      display: flex;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      font-size: 0;
    }
    .t-list-item .t-list-img {
      width: 112/2px;
      height: 112/2px;
      border-radius: 50%;
      display: block;
      border-radius: 50%;
    }
    .t-list-item .t-list-content {
      position: relative;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      overflow: hidden;
      margin-left: 30/2px;
    }
    .t-list-item .t-name {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .t-name span:first-child {
      font-size: 32/2px;
      color: #282828;
      margin-right: 20/2px;
    }

    .t-name span:last-child {
      font-size: 24/2px;
      color: #666666;
    }

    .t-list-item .t-tips {
      display: block;
      overflow: hidden;
      font-size: 24/2px;
      color: #666666;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .t-list-item .t-delete {
      width: 116/2px;
      height: 100%;
      background-color: #ff4919;
      font-size: 30/2px;
      line-height: 184/2px;
      color: #ffffff;
      text-align: center;
      position: absolute;
      top: 0;
      right: -116/2px;
    }
  }
  .t-addTechnician {
    width: 100%;
    height: 100/2px;
    background-image: linear-gradient(90deg, #35abfe 0%, #3d70f7 100%),
      linear-gradient(#3d70f7, #3d70f7);
    background-blend-mode: normal, normal;
    position: fixed;
    bottom: 0;
    font-size: 36/2px;
    color: #ffffff;
    text-align: center;
    line-height: 100/2px;
  }

  .t-empty-area {
    text-align: center;
    margin-top: 50%;
    > img {
      width: 190/2px;
      height: 190/2px;
    }
    > span {
      display: block;
      color: #999;
      font-size: 28/2px;
      margin-top: 20/2px;
    }
  }
}
</style>
<style lang="less">
.t-tcManage {
  .van-pull-refresh {
    min-height: 200px;
  }
  .azm-abnor {
    .azm-image > img {
      width: 30% !important;
    }
  }
}
</style>
