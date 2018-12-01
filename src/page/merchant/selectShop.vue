<template>
  <div class="t-shopAuthentication">
    <!-- 搜索title -->
    <van-row type="flex" class="azm-search">
      <van-col>
        <router-link class="t-site" :to="{path:'/merchant_selectCity'}">
          深圳
          <van-icon class="t-icon-arrow" name="arrow-left"/>
        </router-link>
      </van-col>
      <van-col class="t-searchframe">
        <van-search class="t-searchBox" background="#fff" placeholder="请输入商家名称" v-model="ures.value" show-action
                    @search="onSearch">
          <div slot="action" @click="onSearch(ures.value)">搜索</div>
        </van-search>
      </van-col>
    </van-row>

    <van-cell-group class="azm-search--box" v-if="searchList && searchList.length>0">
      <van-list @load="listLoad" :loading="listLoading" :finished="listFinished">
        <div v-for="(val,i) in searchList" :id="'more_item_page_'+i">
          <van-cell class="t-siteContent" v-for="(item,index) in val" :key="index">
            <van-row type="flex">
              <van-col :span="19">
                <div class="t-shopTitle azm-ellipsis">{{item.title}}</div>
                <div class="t-shopSite azm-ellipsis">
                  <span class="iconfont icon-address azm-icon"></span>
                  <span>{{item.address}}</span>
                </div>
              </van-col>
              <van-col :span="5" class="pr">
                <van-button size="mini" class="t-select" @click.native="bindSelectShop(item)">选择</van-button>
              </van-col>
            </van-row>
          </van-cell>
        </div>
      </van-list>
    </van-cell-group>


    <!-- 没有商家状态 -->
    <div class="t-noShop" v-else>
      <azm-not-more type="notMore3"></azm-not-more>
    </div>

    <!-- 底部按钮 -->
    <van-button class="t-button" @click.native="$routerLink({path:'/merchant_addShop'})">
      添&nbsp;加&nbsp;新&nbsp;商&nbsp;家
    </van-button>

    <!--弹窗选择-->
    <div v-transfer-dom>
      <x-confirm v-model="dialogShopShow" title="确认为以下您的商铺吗？" @on-cancel="dialogShopCancel"
                 @on-confirm="dialogShopConfirm">
        <div class="azm-dialogShop">
          <!--<van-cell>-->
          <!--<div class="azm-dialog&#45;&#45;title">确认为以下您的商铺吗？</div>-->
          <!--</van-cell>-->
          <van-cell>
            <div class="azm-dialog--content">
              <p>商户名称：<span>{{dialogShopData.title}}</span></p>
              <p>服务电话：<a href="tel:0755-15423254">{{dialogShopData.tel}}</a></p>
              <p>地址：<span>{{dialogShopData.address}}</span></p>
              <p>(电话和地址审核通过后可重新编辑)</p>
            </div>
          </van-cell>
        </div>
      </x-confirm>
    </div>
  </div>
</template>

<script>
  import { Search, Row, Col, Icon, Button, List, CellGroup, Cell } from 'vant'
  import { Confirm } from 'vux'
  import NotMore from '../../view-render/not-more.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      [NotMore.name]: NotMore,
      [Search.name]: Search,
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [List.name]: List,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      'x-confirm': Confirm
    },
    computed: {
      ...mapState({
        merchantData: state => state.merchant.merchantData,
        $location: state => state.ApiService.$location
      })
    },
    data () {
      return {
        socketService: null,
        msg: 'Hello World!',
        setData: null,
        listLoading: false,
        listFinished: false,
        searchList: [
          [
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            }
          ],
          [
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            },
            {
              title: '纯美港湾养生会所',
              address: '深圳市福田区福田中心福华路28号'
            }
          ]
        ],
        ures: {
          value: ''
        },
        dialogShopShow: false,
        dialogShopData: {}
      }
    },
    created () {

    },
    methods: {
      onSearch (val) {
        console.log(val)
      },
      listLoad () {

      },
      bindSelectShop (item) {
        this.dialogShopShow = !this.dialogShopShow
        this.dialogShopData = item
      },
      dialogShopConfirm () {
        let $ = this.$azm.Zepto
        $.extend(true, this.merchantData.select_shop, this.dialogShopData)
        this.$routerLink({path: '/merchant_attestinfo'})
        this.dialogShopCancel()
      },
      dialogShopCancel () {
        this.dialogShopData = {}
      }
    }
  }
</script>


<style scoped lang='less'>
  .t-shopAuthentication {
    position: relative;
    .azm-dialogShop {
      width: 560/2px;
      .van-cell {
        padding-left: 20px;
        padding-right: 20px;
        &::after {
          left: 0;

        }
      }
      .azm-dialog--title {
        font-size: 36/2px;
        color: #333;
        font-weight: 500;
        text-align: center;
        height: 30px;
        line-height: 30px;
      }
      .azm-dialog--content {
        p {
          line-height: 1;
          font-size: 32/2px;
          color: #666;
          padding-top: 16px;
          a {
            color: inherit;
            font-size: inherit;
          }
          &:nth-child(1) {
            padding-top: 4px;
          }
          &:nth-last-child(1) {
            font-size: 14px;
            color: #999;
            padding-bottom: 15px;
          }
        }
      }
    }
    .van-cell-group {
      margin-top: 10px;
    }
    .azm-search {
      &.van-row {
        box-sizing: border-box;
        background-color: #ffffff;
        height: 90/2px;
        padding-left: 30/2px;
        padding-right: 30/2px;
        overflow: hidden;
        .van-col {
          min-width: 75px;
        }
        .t-site {
          display: block;
          font-size: 32/2px;
          height: 100%;
          line-height: 90/2px;
          color: #333;
          .t-icon-arrow {
            color: #333;
            font-size: 20/2px;
            transform: rotate(-90deg);
            margin-left: 15/2px;
            line-height: 90/2px;
          }
        }
        .t-searchframe {
          overflow: hidden;
          flex: 2;
          .t-searchBox {
            background-color: #fff;
            height: 100%;
            line-height: 33px;
            margin-left: -15px;
          }
        }
      }
    }
    .azm-search--box {
      margin-bottom: 70px;
    }
    .t-siteContent {
      position: relative;
      &::after {
        left: 0;
      }
      .t-shopTitle {
        font-size: 32/2px;
        margin-bottom: 10/2px;
      }
      .t-shopSite {
        position: relative;
        font-size: 26/2px;
        color: #666666;
        padding-left: 35/2px;
        > span {
          color: #666666;
          font-size: 26/2px;
        }
        .azm-icon {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
        }
      }
      .t-select {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: 110/2px;
        height: 50/2px;
        background-color: #fff1ed;
        border-radius: 25/2px;
        text-align: center;
        font-size: 28/2px;
        color: #ff4919;
        display: inline-block;
        &.van-button--default {
          border-color: #ff4919;
        }
      }
    }

    // 没有商家状态
    .t-noShop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .t-button {
      width: 690/2px;
      height: 45px;
      line-height: 43px;
      font-size: 32/2px;
      background-image: linear-gradient(270deg, #3d70f7 0%, #35abfe 100%);
      color: #ffffff;
      border-radius: 45/2px;
      display: block;
      text-align: center;
      position: fixed;
      bottom: 20/2px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
</style>


<style lang='less'>
  .t-shopAuthentication {
    .t-searchBox {
      margin-left: -8px;
      .van-cell {
        border-radius: 30/2px;
        background-color: #f4f4f4;
        height: 60/2px;
      }
      input {
        background-color: inherit;
      }
      .van-search__action {
        padding-left: 10px;
        color: #666666;
        line-height: inherit;
      }
    }
    .azm-dialogShop {
      width: 560/2px;
      .van-dialog__footer {
        font-size: 14px;
        span {
          color: #ff4919;
        }
      }
    }
  }
</style>
