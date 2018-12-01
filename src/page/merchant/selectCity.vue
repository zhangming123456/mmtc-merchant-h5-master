<template>
  <div class="t-selectCity">
    <div class="t-cityTitle">
      <span>深圳（当前定位）</span>
      <div class="t-anew">
        <img src="../../assets/cooperation-icon/22_icon_again.png" alt="">
        <span>重新定位</span>
      </div>
    </div>
    <div class="t-selectCity">
      <span>可选城市</span>
      <div class="t-city">
        <span>深圳</span>
        <span>南昌</span>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../libs/config.js'
  import { regExp } from '../../libs/util'
  export default {
    components: {},
    data () {
      return {
        socketService: null,
        msg: 'Hello World!',
        setData: null
      }
    },
    created () {
      this.$store.dispatch('ApiService/Shop2GetCity', {}).then(res => {
        console.log(res)

      })
    },
    methods: {}
  }
</script>

<style scoped lang='less'>
  .t-selectCity {
    .t-cityTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80/2px;
      background-color: #ffffff;
      padding-left: 30/2px;
      padding-right: 30/2px;
      > span {
        font-size: 32/2px;
      }
      .t-anew {
        display: flex;
        align-items: center;
        > img {
          width: 32/2px;
          height: 32/2px;
          margin-right: 20/2px;
        }
        > span {
          font-size: 28/2px;
          color: #ff4919;
        }
      }
    }
    .t-selectCity {
      margin-top: 40/2px;
      > span {
        color: #666666;
        font-size: 28/2px;
        margin-left: 30/2px;
      }
      .t-city {
        margin-top: 20/2px;
        > span {
          width: 100%;
          height: 80/2px;
          background-color: #ffffff;
          border-bottom: solid 1px #e5e5e5;
          display: block;
          font-size: 32/2px;
          padding-left: 30/2px;
          line-height: 80/2px;
        }
      }
    }
  }
</style>
