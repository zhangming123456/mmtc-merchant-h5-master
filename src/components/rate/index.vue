<template>
  <div class="azm-rate--component">
    <template v-for="(item,index) in 5">
      <img src="../../assets/icons/project_details_icon_star_red@3x.png" :alt="index"
           v-if="parseInt(rateNum) > index"/>
      <img src="../../assets/icons/project_details_icon_star_half@3x.png" :alt="index"
           v-else-if="(rateNum % 2) !== 0 && parseInt(rateNum) === index"/>
      <img src="../../assets/icons/project_details_icon_star_gray@3x.png" :alt="index"
           v-else/>
    </template>
    
  </div>
</template>

<script>
  export default {
    name: 'azm-rate',
    props: {
      rateNum: Number
    },
    data() {
      return {
        imageUrl: this.$azm.config.imageUrl
      }
    },
    mounted() {

    },
    methods: {},
    watch: {}
  }
</script>

<style lang="less" scoped>
  /*评分*/
  .azm-rate--component {
    display: inline-block;
    line-height: 0;
    img {
      vertical-align: middle;
      width: 15px;
      height: auto;
      margin-right: 5px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }
</style>
