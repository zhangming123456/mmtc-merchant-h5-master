<template>
  <div class="azm-product-graphic">
    <div id="contentEditor"></div>
    <!--<iframe src="http://app.mmtcapp.com/Eleditor-master/demo/index.html" frameborder="0" ref="iframe"></iframe>-->
    <!--<iframe class="iframe" :src="src" scrolling="no" frameborder="0" ref="iframe"></iframe>-->
  </div>
</template>

<script>
  export default {
    data(){
      return {
        message: '',
        src: `http://192.168.3.65:8084/demo/index.html?_t=${+new Date()}`
      }
    }
  }
</script>
<style scoped lang="less">
  .azm-product-graphic {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    .iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
