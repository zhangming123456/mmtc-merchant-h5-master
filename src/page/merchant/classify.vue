<template>
  <van-row type="flex" class="t-mainBusiness">
    <van-col class="left">
      <view-box ref="viewBox">
        <van-cell-group>
          <van-cell class="t-mainBusiness-item t-mainBusiness-item--active" v-for="(item,index) in dataList"
                    :key="index">
            <div class="azm-ellipsis">{{item.title}}</div>
          </van-cell>
        </van-cell-group>
      </view-box>
    </van-col>
    <van-col class="right">
      <view-box ref="viewBox">
        <van-cell-group v-if="dataList[active]">
          <van-cell v-for="(item,index) in dataList[active].child" :key="index" @click.native="selectedClassify(item)">
            <div class="t-mainBusiness-item" :class="{'t-mainBusiness-item--active':filterActive(item)}">
              <span>{{item.title}}</span>
              <van-icon name="checked" class="azm-icon"></van-icon>
            </div>
          </van-cell>
        </van-cell-group>
      </view-box>
    </van-col>
  </van-row>
</template>

<script>
  import { Row, Col, Cell, CellGroup, Icon } from "vant"
  import { ViewBox } from 'vux'
  import { mapState } from 'vuex'
  export default {
    components: {
      ViewBox,
      [Row.name]: Row,
      [Col.name]: Col,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Icon.name]: Icon,
    },
    computed: {
      ...mapState({
        newShopData: state => state.merchant.newShopData,
        dataList: state => state.ApiService.shop2category_parent,
        $location: state => state.vux.$location,
      })
    },
    data() {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null,
        active: 0
      };
    },
    created() {
      this.$store.dispatch("ApiService/shop2category_parent", {}).finally(
        res => {
          if (1 === res.status) {
            console.log(res)
          }
        });
    },
    methods: {
      selectedClassify(item){
        let findindex = this.newShopData.major_business.findIndex(function (v, i) {
          if (item.id === v.id && item.id !== undefined) {
            return true
          }
        })
        if (findindex === -1) {
          this.newShopData.major_business.push(item)
        } else {
          this.newShopData.major_business.splice(findindex, 1)
        }
      },
      filterActive(item){

        let findindex = this.newShopData.major_business.findIndex(function (v, i) {
          if (item.id === v.id && item.id !== undefined) {
            return true
          }
        })
        if (findindex === -1) {
          return false
        } else {
          return true
        }
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-mainBusiness {
    position: fixed;
    margin: 0 auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    .van-cell {
      &:after {
        left: 0;
      }
    }
    .left {
      width: 100px;
      height: 100%;
      .van-cell {
        padding-right: 10px;
        padding-left: 10px;
      }
      .t-mainBusiness-item {
        position: relative;
        box-sizing: border-box;
        font-size: 14px;
        color: #eee;
        &.t-mainBusiness-item--active {
          color: #3d70f7;
          &:before {
            content: ' ';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
            height: 90%;
            width: 2px;
            background-color: #3d70f7;
          }
        }
      }
    }
    .right {
      flex: 2;
      height: 100%;
      background-color: #fff;
      .t-mainBusiness-item {
        position: relative;
        box-sizing: border-box;
        font-size: 14px;
        color: #282828;
        .azm-icon {
          display: none;
        }
        &.t-mainBusiness-item--active {
          .azm-icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(0, -50%);
            font-size: 15px;
            color: #3d70f7;
            display: inline;
          }
        }
      }
    }
    .t-label {
      width: 30%;
      > span {
        height: 80/2px;
        line-height: 80/2px;
        text-align: center;
        display: block;
        border-bottom: solid 1px #eeeeee;
        background-color: #ffffff;
      }
      .t-active {
        height: 80/2px;
        line-height: 80/2px;
        text-align: center;
        display: block;
        border-bottom: solid 1px #eeeeee;
        background-color: #ffffff;
        color: #3d70f7;
        border-left: 2px solid #3d70f7;
      }
    }
    .t-labelClassify {
      width: 70%;
      > span {
        height: 80/2px;
        font-size: 28/2px;
        line-height: 80/2px;
        display: block;
        padding-left: 50/2px;
        border-bottom: solid 1px #eeeeee;
        border-left: solid 1px #eeeeee;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 30/2px;
        > img {
          width: 30/2px;
          height: 30/2px;
        }
      }
    }
  }
</style>
