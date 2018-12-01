<template>
    <div class="t-example">
        <div class="t-exampleBox">
            <img src="../../assets/cooperation-icon/mg_license.png" alt="">
            <p>1. 图片内容需要保证清晰无遮挡</p>
            <p>2. 证件大小不超过1M</p>
            <p>3. 证件需在有效期内</p>
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
    >p{
      font-size: 28/2px;
      color: #333333;
      margin-left: 118/2px;
    }
  }
}
</style>





