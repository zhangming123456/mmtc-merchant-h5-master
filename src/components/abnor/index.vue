<template>
  <div class="azm-component-abnor-index">
    <div class="azm-component-abnor-index-box">
      <p class="azm-image"><img :src="image"/></p>
      <p class="azm-title" v-if="title">{{title}}</p>
      <p class="azm-tip" v-if="tip">{{tip}}</p>
      <p class="azm-button" v-if="button">
        <mu-button color="error" small @click.native="onConfirm">{{button}}</mu-button>
      </p>
    </div>
  </div>
</template>

<script>
  import Config from './config'
  export default {
    components: {},
    name: 'azm-abnor',
    props: {
      type: {
        type: String,
        default: ""
      },
      image: {
        type: String,
        default: function () {
          if (this.type && Config[this.type]) {
            return Config[this.type].image
          } else {
            return ""
          }
        }
      },
      title: {
        type: String,
        default: function () {
          if (this.type && Config[this.type]) {
            return Config[this.type].title
          } else {
            return ""
          }
        }
      },
      button: {
        type: String,
        default: function () {
          if (this.type && Config[this.type]) {
            return Config[this.type].button
          } else {
            return ""
          }
        }
      },
      tip: {
        type: String,
        default: function (v) {
          if (v) {
            return v
          } else if (this.type && Config[this.type]) {
            return Config[this.type].tip
          } else {
            return ""
          }
        }
      }
    },
    data(){
      return {
        message: ''
      }
    },
    created(){},
    methods: {
      onConfirm(e){
        this.$emit('btnTap', e)
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-component-abnor-index {
    position: relative;
    top: 0;
    left: 0;
    margin: 12px 15px;
    .azm-component-abnor-index-box {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 50px 0;
      background-color: #fff;
      border-radius: 5px;
      > p {
        text-align: center;
      }
      .azm-title {
        margin-top: 12px;
        font-size: 14px;
        color: #333;
      }
      .azm-tip {
        font-size: 12px;
        color: #666;
      }
      .azm-button {
        margin-top: 12px;
      }
      .azm-image {
        img {
          width: 60%;
          margin-top: 20px;
          height: auto;
        }
      }
    }

  }
</style>
<style lang="less">
  .azm-component-abnor-index {
  }
</style>
