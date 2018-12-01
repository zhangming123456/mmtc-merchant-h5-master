<template>
  <div class="azm-404">
    <azm-abnor type="NOT_FOUND" @btnTap="back"></azm-abnor>
  </div>
</template>

<script>
  import Abnor from "../components/abnor/index.vue"
  export default {
    components: {
      [Abnor.name]: Abnor
    },
    data(){
      return {
        message: ''
      }
    },
    computed: {},
    created(){},
    methods: {
      back(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-404 {
  }
</style>
<style lang="less">
  .azm-404 {
  }
</style>
