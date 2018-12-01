<template>
  <div class="t-example">
    <div class="t-exampleBox">
      <img src="../../assets/cooperation-icon/mg_shop.png" alt="">
      <p>1. 不得遮挡门牌，拍摄环境需白天</p>
      <p>2. 门牌需与店铺名称一致</p>
      <p>3. 图片清晰且不多于1M</p>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        socketService: null,
        msg: "Hello World!",
        setData: null
      };
    },
    created() {},
    methods: {}
  };
</script>


<style scoped lang='less'>
  .t-example {
    .t-exampleBox {
      margin-top: 30/2px;
      > img {
        width: 100%;
        height: 750/2px;
        margin-bottom: 30/2px;
      }
      > p {
        font-size: 28/2px;
        color: #333333;
        margin-left: 118/2px;
      }
    }
  }
</style>






