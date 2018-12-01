<template>
  <div class="not-more" v-if="!show">
    <div class="notMore2" v-if="type === 'notMore2'">
      <p><img src="../assets/ios-pic/icon-kong.png" alt=""></p>
      <p><span>{{message || text2}}</span></p>
    </div>
    <div class="notMore2" v-else-if="type === 'notMore3'">
      <p><img src="../assets/cooperation-icon/04_no.png" alt=""></p>
      <p><span>{{message || text3}}</span></p>
    </div>

    <div class="notMore2 notMore4" v-else-if="type === 'notMore4'">
      <p><img src="../assets/success@3x.png" alt=""></p>
      <p><span>{{message || text4}}</span></p>
    </div>

    <van-row type="flex" v-else>
      <van-col :span="12">
        <img src="../../assets/Group39@2x_65.png" alt="">
      </van-col>
      <van-col :span="12">
        {{message || text}}~
      </van-col>
    </van-row>
  </div>
</template>

<script>
  import Avatar from '../components/avatar/index.vue'
  import { Row, Col } from 'vant'
  export default {
    name: 'azm-not-more',
    components: {
      [Avatar.name]: Avatar,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    props: {
      show: Boolean,
      message: String,
      type: String
    },
    data(){
      return {
        text: '没有内容',
        text2: '没有更多点评',
        text3: '没有找到商家，快来添加吧~',
        text4: '恭喜您，您已支付认证成功！',
      }
    },
    watch: {
      message: function (cur, old) {
        if (cur) {
          this.text = cur
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .not-more {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    text-align: center;
    box-sizing: border-box;
    padding-top: 25px;
    padding-bottom: 25px;
    .notMore2 {
      p {
        text-align: center;
        color: #999;
        font-size: 14px;
      }
      p:nth-child(1) {
        padding-bottom: 10px;
        img {
          width: 115px;
          height: auto;
        }
      }
      p:nth-child(2) {

      }
    }
    .notMore4 {
      p {
        text-align: center;
        color: #999;
        font-size: 14px;
      }
      p:nth-child(1) {
        padding-bottom: 10px;
        img {
          width: 172px;
          height: auto;
        }
      }
      p:nth-child(2) {
        margin-top: 35px;
        font-size: 14px;
        color: #666666;
      }
    }
    .van-row {
      margin: 0 auto;
      width: 100%;
      height: 135/2px;
      line-height: 135/2px;
      .van-col:nth-child(1) {
        text-align: right;
        img {
          width: 128/2px;
          height: inherit;
          vertical-align: middle;
        }
      }
      .van-col:nth-child(2) {
        text-align: left;
        color: #999999;
        font-size: 14px;
      }

    }
  }
</style>
