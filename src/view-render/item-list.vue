<template>
  <div class="items-list azm-items-list--box" :class="{'marginTop0':true,'azm-hairline--top-bottom':bw}">
    <template v-if="lists.length>0">
      <van-cell class="azm-item--list-2-box" v-for="(item,index) in listLen" :key="index">
        <van-row class="h100" :gutter="9" type="flex">
          <van-col :span="12" class="pr h100" v-bind="$attrs" v-bind:value="lists[2 * index]"
                   v-on:click.native="go(lists[2 * index].id)">
            <div class="azm-item--box pr h100">
              <div class="azm-img">
                <azm-avatar :src="lists[2 * index].cover"></azm-avatar>
              </div>
              <div class="azm-title azm-ellipsis">{{lists[2 * index].title}}</div>
              <div class="azm-txt__footer">
                <p class="azm-txt3">
                  <span class="azm-price__unit">￥</span>
                  <span class="azm-price">{{lists[2 * index].price | money_filter}}</span>
                  <span class="azm-dash__price">￥{{lists[2 * index].market_price | money_filter}}</span>
                  <span class="azm-likes--num">{{lists[2 * index].sell_count}}人喜欢</span>
                </p>
                <p class="azm-txt4 azm-ellipsis" v-if="!isShopCover">
                  <span class="azm-txt--shop">{{lists[2 * index].shop_name}}</span>
                  <span class="azm-txt--distance">{{lists[2 * index].distance}}</span>
                </p>
                <p class="azm-txt5 azm-ellipsis" v-else>
                <span class="azm-txt--shop-avatar">
                  <azm-avatar :src="lists[2 * index].shop_logo"></azm-avatar>
                </span>
                  <span class="azm-txt--shop">{{lists[2 * index].shop_name}}</span>
                  <span class="azm-txt--distance">{{lists[2 * index].distance | distance_filter}}</span>
                </p>
              </div>
            </div>
          </van-col>
          <van-col :span="12" class="pr h100" v-if="lists[2 * index + 1]" v-bind="$attrs"
                   v-bind:value="lists[2 * index + 1]" v-on:click.native="go(lists[2 * index + 1].id)">
            <div class="azm-item--box pr h100">
              <div class="azm-img">
                <azm-avatar :src="lists[2 * index + 1].cover"></azm-avatar>
              </div>
              <div class="azm-title azm-ellipsis">{{lists[2 * index + 1].title}}</div>
              <div class="azm-txt__footer">
                <p class="azm-txt3">
                  <span class="azm-price__unit">￥</span>
                  <span class="azm-price">{{lists[2 * index + 1].price | money_filter}}</span>
                  <span class="azm-dash__price">￥{{lists[2 * index + 1].market_price | money_filter}}</span>
                  <span class="azm-likes--num">{{lists[2 * index + 1].sell_count}}人喜欢</span>
                </p>
                <p class="azm-txt4 azm-ellipsis" v-if="!isShopCover">
                  <span class="azm-txt--shop">{{lists[2 * index + 1].shop_name}}</span>
                  <span class="azm-txt--distance">{{lists[2 * index + 1].distance}}</span>
                </p>
                <p class="azm-txt5 azm-ellipsis" v-else>
                <span class="azm-txt--shop-avatar">
                  <azm-avatar :src="lists[2 * index + 1].shop_logo"></azm-avatar>
                </span>
                  <span class="azm-txt--shop">{{lists[2 * index + 1].shop_name}}</span>
                  <span class="azm-txt--distance">{{lists[2 * index + 1].distance | distance_filter}}</span>
                </p>
              </div>
            </div>
          </van-col>
        </van-row>
      </van-cell>
    </template>
    <template v-else>
      <azm-not-more v-if="isNotMore" message="没有项目"></azm-not-more>
    </template>
    <!--<van-cell-group class="azm-items-list&#45;&#45;box" :class="{'marginTop0':true,'azm-hairline&#45;&#45;top-bottom':bw}">-->

    <!--</van-cell-group>-->
  </div>
</template>

<script>
import Avatar from "../components/avatar/index.vue";
import NotMore from "../view-render/not-more.vue";
import { Row, Col, CellGroup, Cell } from "vant";
export default {
  name: "azm-item-list",
  components: {
    [Avatar.name]: Avatar,
    [Row.name]: Row,
    [Col.name]: Col,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [NotMore.name]: NotMore
  },
  updated() {
    console.log(this.maxLen);
    //      if (!this.maxLen) {
    //        this.max = Math.ceil(this.lists.length / 2)
    //      } else {
    //        this.max = this.maxLen
    //      }
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    maxLen: {
      type: Number,
      default: 0
    },
    bw: {
      type: Boolean,
      default: false
    },
    isNotMore: {
      type: Boolean,
      default: true
    },
    isShopCover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      text: "没有内容~",
      max: 10000,
      listLen: 0
    };
  },
  created() {
    this.listLen = Math.ceil(
      Math.min(this.lists.length / 2, parseInt(this.maxLen || this.max))
    );
  },
  watch: {
    lists() {
      this.listLen = Math.ceil(
        Math.min(this.lists.length / 2, parseInt(this.maxLen || this.max))
      );
    }
  },
  computed: {
    //      listeners: function () {
    //        var vm = this
    //        // `Object.assign` 将所有的对象合并为一个新对象
    //        return Object.assign({},
    //          // 我们从父级添加所有的监听器
    //          this.$listeners,
    //          // 然后我们添加自定义监听器，
    //          // 或覆写一些监听器的行为
    //          {
    //            // 这里确保组件配合 `v-model` 的工作
    //            click: function (event) {
    //              debugger
    //              vm.$emit('click', event.target.value)
    //            }
    //          }
    //        )
    //      }
  },
  methods: {
    go(id) {
      this.$routerLink({ path: "/project_details", query: { item_id: id } });
    }
  }
};
</script>

<style scoped lang="less">
.azm-items-list--box {
  position: relative;
  .van-cell:not(:nth-child(1)) {
    padding-top: 0;
  }

  &::after {
    border-width: 0;
  }
  &.azm-hairline--top-bottom::after {
    border-width: 1px;
  }
  .azm-item--list-2-box {
    &.van-cell:after {
      border-width: 0;
    }
  }
  /*项目盒子*/
  .azm-item--box {
    background-color: #fff;
    height: 100%;
    padding-bottom: 70px;
    box-sizing: border-box;
    border-radius: 5px;
    > div {
      box-sizing: border-box;
      padding: 0 3px;
    }
    .azm-img {
      padding: 0;
      width: 100%;
      border-radius: 5px;
      height: 336/2px;
      overflow: hidden;
      background-color: #f4f4f4;
      img {
        width: inherit;
        height: auto;
      }
    }
    .azm-title {
      margin-top: 10px;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .azm-txt {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }
    .azm-txt__footer {
      position: absolute;
      left: 0;
      bottom: 10px;
      width: 100%;
      .azm-txt2 {
        line-height: 1;
        font-size: 14px;
        color: #999;
        > div {
          &:nth-child(1) {
          }
          &:nth-child(2) {
            text-align: right;
          }
        }
      }
      .azm-txt3 {
        position: relative;
        color: #ff6283;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-price__txt {
        }
        .azm-price__unit {
        }
        .azm-price {
          font-size: 16px;
        }
        .azm-dash__price {
          color: #999;
          text-decoration: line-through;
        }
        .azm-likes--num {
          position: absolute;
          bottom: 0;
          right: 0;
          color: #999;
        }
      }
      .azm-txt4 {
        position: relative;
        margin-top: 10px;
        color: #666;
        font-size: 12px;
        line-height: 25px;
        letter-spacing: 0;
        padding-right: 38%;
        box-sizing: border-box;
        .azm-txt--shop {
        }
        .azm-txt--distance {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .azm-txt5 {
        position: relative;
        margin-top: 5px;
        color: #666;
        font-size: 12px;
        line-height: 25px;
        letter-spacing: 0;
        padding-right: 38%;
        box-sizing: border-box;
        .azm-txt--shop-avatar {
          display: inline-block;
          width: 25px;
          height: 25px;
          border-radius: 100%;
          overflow: hidden;
          transform: translateY(25%);
          img {
            width: 100%;
            height: auto;
          }
        }
        .azm-txt--shop {
        }
        .azm-txt--distance {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .azm-money {
        margin-top: 15px;
        color: #ff6283;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0;
        .azm-price__txt {
        }
        .azm-price__unit {
        }
        .azm-price {
          font-size: 22px;
        }
        .azm-dash__price {
          color: #999;
          text-decoration: line-through;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>

