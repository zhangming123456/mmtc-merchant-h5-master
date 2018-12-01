<template>
  <div class="azm-ranking-list">
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <mu-list>
        <mu-list-item class="van-hairline--bottom azm-ranking-list-top">
          <mu-list-item-title class="azm-ranking-list-title">
            <span class="iconfont icon-jiangbei azm-icon"></span>
            <span>名称</span>
          </mu-list-item-title>
          <mu-list-item-title class="azm-ranking-list-value">销量（单）</mu-list-item-title>
        </mu-list-item>
        <template v-if="lists.length>0" v-for="(items,i) in lists">
          <mu-list-item v-for="(item,index) in items" :key="index" class="van-hairline--bottom azm-ranking-list-item">
            <mu-list-item-title class="azm-ranking-list-title">
              <span class="azm-num-icon">{{index + 1}}</span>
              <span>{{item.item_name}}</span>
            </mu-list-item-title>
            <mu-list-item-title class="azm-ranking-list-value">{{item.num}}单</mu-list-item-title>
          </mu-list-item>
        </template>
      </mu-list>
    </mu-load-more>
  </div>
</template>

<script>
  import { LoadMore } from 'muse-ui'
  import { dateFormat } from 'vux'
  import MuListItemAction from 'muse-ui/es5/List/ListAction'
  export default {
    name: "azm-ranking-list",
    components: {
      MuListItemAction,
      [LoadMore.name]: LoadMore
    },
    updated() {

    },
    props: {
      label: {
        type: String,
        default: ""
      },
      lists: [Array, String, undefined],
      num: [Number, String]
    },
    data() {
      return {
        dataList: [],
        refreshing: false,
        loading: false,
        text: 'List'
      }
    },
    created() {
      this.$nextTick(function () {

      })
    },
    watch: {},

    methods: {
      refresh(e){
        this.$emit('refresh', e)
      },
      load(e){
        this.$emit('load', e)
      }
    }
  };
</script>

<style scoped lang="less">
  .azm-ranking-list {
    .mu-list {
      padding: 0;
      background-color: #fff;
    }
    .azm-ranking-list-title, .azm-ranking-list-value {
      font-size: 14px;
    }

    .azm-ranking-list-title {
      text-align: left;
      box-sizing: border-box;
      position: relative;
      color: #6F7578;
      .azm-icon {
        font-size: 33/2px;
        margin-right: 14px;
        color: #6F7578;
      }
      .azm-num-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: #9E9E9E;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        font-weight: 500;
        transform: scale(.8);
        color: #fff;
        border-radius: 100%;
        vertical-align: middle;
        margin-right: 14px;
      }

    }
    .azm-ranking-list-value {
      text-align: right;
      color: #323232;
      flex: 3 3 auto;
    }

    .azm-ranking-list-item {
      &:nth-child(2) .azm-num-icon {
        background-color: #F9B655;
      }
      &:nth-child(3) .azm-num-icon {
        background-color: #FF9330;
      }
      &:nth-child(4) .azm-num-icon {
        background-color: #F4715A;
      }
    }

    .azm-ranking-list-top {
      .azm-ranking-list-title, .azm-ranking-list-value {
        color: #171F24;
        font-weight: 500;
      }

    }
  }
</style>

