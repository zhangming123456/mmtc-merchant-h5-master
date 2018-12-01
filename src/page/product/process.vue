<template>
  <div class="azm-product-process">
    <div class="azm-process-item" v-for="(item,index) in service_flow" :key="index">
      <mu-paper round :z-depth="4">
        <mu-flex class="azm-header" justify-content="start">
          <mu-flex fill justify-content="start">
            <span class="iconfont icon-time azm-icon"></span>
            <span>&nbsp;流程{{index + 1}}</span>
          </mu-flex>
          <mu-flex fill justify-content="end">
            <mu-button color="#fff" flat @click.native="close(index)">删除</mu-button>
          </mu-flex>
        </mu-flex>
        <section>
          <van-field label="服务项目" :border="false" v-model="item.name" placeholder="例如卸妆、洗面等细节服务内容"
                     maxlength="10"></van-field>
          <mu-row>
            <mu-col :span="6">
              <van-field label="服务项目" :border="false" input-align="center" type="number" v-model="item.times"
                         @blur="timesFieldBlur(item)">
                <span slot="icon" class="azm-input-right-text">次</span>
              </van-field>
            </mu-col>
            <mu-col :span="6">
              <van-field label="服务项目" :border="false" input-align="center" type="number" v-model="item.time"
                         @blur="timeFieldBlur(item)">
                <span slot="icon" class="azm-input-right-text">分钟</span>
              </van-field>
            </mu-col>
          </mu-row>
        </section>
      </mu-paper>
    </div>
    <div class="azm-product-add">
      <mu-button fab color="teal" @click.native="addFlow">
        <mu-icon value="add"></mu-icon>
      </mu-button>
    </div>
    <mu-flex class="azm-append-footer azm-append-footer-fixed">
      <mu-button full-width textColor="#fff" @click.native="onConfirm">
        <span>确定</span>
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>
  import { Field } from 'vant';
  import { Paper }from 'muse-ui'
  import { mapState } from 'vuex'
  export default {
    components: {
      [Paper.name]: Paper,
      [Field.name]: Field,
    },
    data(){
      return {
        message: '',
        service_flow: []
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    created(){
      let $ = this.$azm.Zepto
      if (this.productData.service_flow && this.productData.service_flow.length > 0) {
        $.extend(true, this.service_flow, this.productData.service_flow)
      } else {
        this.addFlow()
      }
    },
    methods: {
      timesFieldBlur(item){
        if (item && item.times !== undefined) {
          item.times = item.times > 0 ? parseInt(item.times) : 1
        }
      },
      timeFieldBlur(item){
        if (item && item.time !== undefined) {
          item.times = item.time > 0 ? parseInt(item.time) : 1
        }
      },
      close(index){
        let that = this
        that.$confirm('确定要删除？', '提示', {type: 'warning'}).then(({result}) => {
          if (result) {
            that.service_flow.splice(index, 1);
          } else {
            that.$toast.message('点击了取消');
          }
        });
      },
      addFlow(){
        let that = this
        let fIndex = this.service_flow.findIndex(v => {
          return v.name === undefined || that.util.trim(v.name) === ''
        })
        if (fIndex > -1) {
          that.$toast.error(`流程${fIndex + 1}内容还未完成，请完成后再添加新的流程哦~`)
        } else {
          this.service_flow.push({
            name: '',
            times: 1,
            time: 30
          })
        }
      },
      onConfirm(){
        let that = this
        let fIndex = this.service_flow.findIndex(v => {
          return v.name === undefined || that.util.trim(v.name) === ''
        })
        if (that.service_flow && that.service_flow.length === 0) {
          that.$toast.error(`至少一个~`)
        } else if (fIndex > -1) {
          that.$toast.error(`流程${fIndex + 1}内容还未完成，请完成后再添加新的流程哦~`)
        } else {
          that.productData.service_flow = that.service_flow
          that.$router.back()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-process {
    margin-bottom: 50px;
    .azm-process-item {
      box-sizing: border-box;
      padding: 12px 15px;
      .mu-paper {
        overflow: hidden;
        .azm-header {
          position: relative;
          background-color: #2c2e3e;
          height: 32px;
          line-height: 32px;
          color: #fff;
          box-sizing: border-box;
          padding: 0 15px;
          font-size: 32/2px;
          .mu-button {
            height: 32px;
            line-height: 32px;
            min-width: 0;
            font-size: 12px;
          }
        }
        .azm-input-right-text {
          color: #333;
        }
      }
    }
    .azm-product-add {
      margin-top: 20px;
      text-align: center;
    }
    .azm-append-footer {
      .mu-button {
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
      }
    }
  }
</style>
<style lang="less">
  .azm-product-process {
    .azm-header {
      .mu-button-wrapper {
        padding-right: 0;
      }
    }
  }

</style>
