<template>
  <div class="azm-product-index-list">
    <template v-if="value && value.length>0  && value[0].length>0">
      <template v-for="(items,i) in value">
        <mu-list :data-page="i" class="azm-product-list-item  marTop12 needsclick" v-for="(item,index) in items"
                 :key="index">
          <mu-list-item class="van-hairline--bottom azm-product-list-header">
            <mu-list-item-title class="azm-product-list-title">产品ID：{{item.item_no}}</mu-list-item-title>
            <mu-list-item-title class="azm-product-list-value">
              <template v-if="tabsActive === 2">
                <mu-badge content="审核未通过" color="#fff" style="color: #000" v-if="item.auth_status == 1"></mu-badge>
                <mu-badge content="审核通过" color="#fff" style="color: #000"
                          v-else-if="item.auth_status == 2"></mu-badge>
                <mu-badge content="待提交" color="#fff" style="color: #000" v-else-if="item.auth_status == 3"></mu-badge>
                <mu-badge content="审核中" color="#fff" style="color: #000" v-else-if="item.auth_status == 0"></mu-badge>
              </template>
              <mu-badge content="拼团" color="#fff" style="color: #000" v-if="item.group_num>0"></mu-badge>
            </mu-list-item-title>
          </mu-list-item>
          <mu-flex justify-content="start" class="flex-wrapper van-hairline--bottom azm-product-list-section">
            <mu-flex justify-content="start" class="azm-product-list-image">
              <div class="azm-product-group-icon" v-if="item.group_num>0">
                <span>{{item.group_num}}人团</span>
              </div>
              <azm-avatar :src="item.cover"></azm-avatar>
            </mu-flex>
            <mu-flex fill justify-content="start" class="azm-product-list-value van-ellipsis">
              <div class="padLeft15 w100">
                <p class="azm-title van-ellipsis">{{item.title}}</p>
                <p class="azm-money">
                  <span v-if="item.group_num>0" class="azm-money-group-txt">拼团价</span>
                  <span class="azm-money-group-unit">￥</span>
                  <span v-if="item.group_num>0"
                        class="azm-money-group-price">{{item.group_price | money_filter}}</span>
                  <span v-else class="azm-money-price">{{item.price | money_filter}}</span>
                  <span class="azm-money-decoration"
                        style="text-decoration:line-through;">门店价￥{{item.group_num > 0 ? item.price : item.market_price}}</span>
                </p>
                <p class="azm-time">
                  <span v-if="tabsActive === 2">申请时间</span>
                  <span v-else-if="tabsActive === 1">下架时间</span>
                  <span v-else>上架时间</span>
                  <span>：{{item.create_time}}</span>
                </p>
                <p class="azm-detail" v-if="item.auth_status == 1 && tabsActive === 2">
                  <mu-button flat color="rgb(45, 129, 228)">
                    <span>查看详情</span>
                    <van-icon name="arrow"/>
                  </mu-button>
                </p>
              </div>
            </mu-flex>
          </mu-flex>
          <mu-list-item class="azm-product-list-footer" v-if="item.auth_status != 1">
            <mu-list-item-action class="azm-product-list-title" v-if="tabsActive>0 && item.auth_status != 0"
                                 @click="bindDelete(item)">
              <span>删除</span>
            </mu-list-item-action>
            <mu-list-item-title class="azm-product-list-title"></mu-list-item-title>
            <mu-list-item-action class="azm-product-list-value azm-btn-small">
              <mu-flex justify-content="end" align-items="center">
                <mu-button class="azm-disabled-btn" small flat textColor="#6F7578" v-if="tabsActive===0"
                           @click.native="bindSoldOut(item)">
                  下架
                </mu-button>
                <mu-button class="azm-review-btn" small flat textColor="#2D81E4" v-if="tabsActive===1"
                           @click.native="bindReview(item)">
                  上架
                </mu-button>
                <mu-button class="azm-edit-btn" small flat textColor="#fff" @click.native="bindEdit(item)">
                  编辑
                </mu-button>
                <template v-if="tabsActive===2">
                  <mu-button class="azm-shelf-btn" small flat textColor="#2D81E4" v-if="item.auth_status == 0"
                             @click.native="bindRevoke(item)">
                    撤销审核
                  </mu-button>
                  <mu-button class="azm-shelf-btn" small flat textColor="#2D81E4" v-else
                             @click.native="bindShelf(item)">
                    提交审核
                  </mu-button>
                </template>
              </mu-flex>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </template>
    </template>
    <azm-abnor v-else type="ORDER" title="还没有相关产品哦~"></azm-abnor>
  </div>
</template>

<script>
  import Avatar from '../components/avatar/index.vue'
  import Abnor from "../components/abnor/index.vue"
  import { Badge } from "muse-ui"
  import { Icon } from "vant"

  export default {
    name: 'azm-product-index-list',
    components: {
      [Abnor.name]: Abnor,
      [Avatar.name]: Avatar,
      [Badge.name]: Badge,
      [Icon.name]: Icon,
    },
    props: {
      value: {
        type: Array,
        required: true,
      },
      active: {
        type: [String, Number],
        required: true,
        default: function () {
          let val = this.active
          if (val && this.util.isNumberOfNaN(val)) {
            return Number(v)
          } else {
            return 0
          }
        }
      },
    },
    data () {
      return {
        message: '',
        dataList: [],
        tabsActive: this.active
      }
    },
    watch: {
      value: {
        handler: function (val) {
          if (val && this.util.isArray(val)) {
            this.dataList = val
          }
        },
        deep: true
      },
      active: {
        handler: function (val) {
          if (val && this.util.isNumberOfNaN(val)) {
            this.tabsActive = Number(v)
          } else {
            this.tabsActive = 0
          }
        },
        deep: true
      },
    },
    created () {
    },
    methods: {
      refresh (e) {
        this.$emit('refresh', e)
      },
      /**
       * 下架
       * @param item
       */
      bindSoldOut (item) {
        let that = this, id = item.id;
        if (!id) return;
        that.$confirm('确定要下架？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.$store.dispatch("ApiService/iteminfoDownOn", {id}).finally(res => {
              if (res.status === 1) {
                that.refresh()
              }
              that.$toast.message(res.msg);
            });
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
      /**
       * 编辑
       * @param item
       */
      bindEdit (item) {
        if (item && item.id) {
          this.$router.push({path: '/product_editAndModify', query: {id: item.id, isEdit: 1}})
        }
      },
      /**
       * 上架
       * @param item
       */
      bindReview (item) {
        let that = this, id = item.id;
        if (!id) return;
        that.$confirm('确定要上架？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.$store.dispatch("ApiService/iteminfoUpOn", {id}).finally(res => {
              if (res.status === 1) {
                that.refresh()
              }
              that.$toast.message(res.msg);
            });
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
      /**
       * 撤销
       * @param item
       */
      bindRevoke (item) {
        let that = this, id = item.id;
        if (!id) return;
        that.$confirm('确定要撤销？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.$store.dispatch("ApiService/iteminfoRevokeAuth", {id}).finally(res => {
              if (res.status === 1) {
                that.refresh()
              }
              that.$toast.message(res.msg);
            });
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
      /**
       * 删除
       * @param item
       */
      bindDelete (item) {
        let that = this, id = item.id;
        if (!id) return;
        that.$confirm('确定要删除？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.$store.dispatch("ApiService/iteminfoDel", {id}).finally(res => {
              if (res.status === 1) {
                that.refresh()
              }
              that.$toast.message(res.msg);
            });
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
      /**
       * 提交审核
       * @param item
       */
      bindShelf (item) {
        let that = this, id = item.id;
        if (!id) return;
        that.$confirm('确定要审核？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.$store.dispatch("ApiService/iteminfoToExamine", {id}).finally(res => {
              if (res.status === 1) {
                that.refresh()
              } else if (res.status === 0 && res.code === 1) {
                that.$toast.warning("内容未填写完成，请编辑在提交~");
              } else {
                that.$toast.message(res.msg);
              }
            });
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .flex-wrapper {
    box-sizing: border-box;
    padding: .16rem .2rem;
  }

  .azm-product-index-list {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    .mu-load-more {
      min-height: 200px;
    }
    .azm-product-list-item {
      padding: 0;
      background-color: #fff;
      .azm-product-list-header {
        .azm-product-list-title {
          font-size: 14px;
          color: #999999;
        }
        .azm-product-list-value {
          text-align: right;
        }
      }
      .azm-product-list-section {
        .azm-product-list-value {
          .azm-title {
            font-size: 18px;
            color: #282828;
          }
          .azm-time {
            font-size: 13px;
            color: #666;
          }
          .azm-detail {
            text-align: right;
            .mu-button {
              height: 30px;
              line-height: 30px;
              font-size: 12px;
            }
            .van-icon {
              font-size: 12px;
            }
          }
        }
      }
      .azm-product-list-image {
        width: 94px;
        min-width: 94px;
        position: relative;
        overflow: hidden;
        .azm-product-group-icon {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          color: #fff;
          text-align: center;
          padding-left: 5px;
          padding-right: 5px;
          height: 16px;
          line-height: 16px;
          background-image: linear-gradient(90deg, #ff5ea2 0, #ed3980 70%, #db135e 83%, #e82b8d 100%), linear-gradient(#fd0f5d, #fd0f5d);
          background-blend-mode: normal, normal;
          border-radius: 0 0 2.5px 0;
          span {
            display: inline-block;
            font-size: 12px;
            transform: scale(0.8);
            line-height: 1;
          }
        }
      }
      .azm-product-list-footer {
        .azm-product-list-value {
          text-align: right;
        }
      }
    }
  }
</style>
<style lang="less">
  .azm-product-index-list {
  }
</style>
