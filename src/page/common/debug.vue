<template>
  <div>
    <mu-button color="primary" @click.native="open">打开Debug</mu-button>
    <mu-button color="secondary" @click.native="close">关闭Debug</mu-button>

    <span class="aa">拉法兰克</span>
  </div>
</template>

<script>
  import { Button } from 'muse-ui'

  export default {
    components: {
      [Button.name]: Button
    },
    data () {
      return {
        message: ''
      }
    },
    methods: {
      open () {
        this.$azm.cookie.set('Debug', 1, {expires: 1 / 24})
      },
      close () {
        this.$azm.cookie.remove('Debug')
      }
    }
  }
</script>

<style lang="less" scoped>
  .aa {
    font-size: 12px;
  }
</style>
