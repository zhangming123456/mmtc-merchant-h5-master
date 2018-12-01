<template>
  <div class="azm-demo pr">
    <div class="azm-poster-box" :class="{'overflow':isHH}">
      <label class="azm-poster-item azm-poster-txt">
        <div class="azm-poster-content">
          <textarea disabled="disabled">HAIRSTYLE案件发挥空间啊回复框架爱好地方看见爱上</textarea>
        </div>
      </label>
    </div>
    <mu-button class="azm-btn azm-btn-generate" flat color="primary" @click.native="generate">
      <span>生成</span>
    </mu-button>
    <div v-transfer-dom id="img"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import canvasDraw from '../../libs/canvasDraw'

  export default {
    components: {},
    data () {
      return {
        message: '',
        isHH: false
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", 'isMerchantH5'],
    created () {
    },
    methods: {
      generate () {
        let that = this;
        let $ = this.util.Zepto;
        that.isHH = true;
        that.$nextTick(function () {
          canvasDraw.drawPoster('.azm-poster-box').then(function (img) {
            $('#img').html(img);
            $(img).css({width: "100%", height: "auto"});
          }).finally(function (res) {
          });
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-demo {
    .azm-poster-box {
      position: relative;
      width: 300px;
      height: 400px;
      /*overflow: hidden;*/

      &.overflow {
        overflow: visible;
      }
      .azm-poster-item {
        position: absolute;
        z-index: 2;
        top: 56px;
        left: 90.3%;
        width: 421px;
        height: 60.8px;
        color: rgb(0, 0, 0);
        text-align: left;
        transform: rotateZ(90deg);
        transform-origin: top left;
        font-size: 60px;
      }
    }
  }
</style>
<style lang="less">
  .azm-demo {
  }
</style>
