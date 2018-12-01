<template>
  <div class="azm-protocol-iframe azm-navBar-top">
    <iframe src="https://app.mmtcapp.com/mmtch5/#/inform" scrolling="auto" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    name: "protocol"
  }
</script>

<style scoped lang="less">
  .azm-protocol-iframe {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    iframe {
      /*第三种解决方案*/
      display: block;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
  }
</style>
