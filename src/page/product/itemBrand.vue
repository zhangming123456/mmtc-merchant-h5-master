<template>
  <mu-flex direction="column" class="azm-product-itemBrand">
    <mu-flex class="azm-header w100">
      <mu-flex fill justify-content="start">填写商品信息并添加</mu-flex>
      <mu-flex justify-content="end">
        <mu-button flat textColor="#ff4919" small @click.native="bindaddItem">
          保存
        </mu-button>
      </mu-flex>
    </mu-flex>
    <mu-flex class="w100">
      <van-cell-group class="w100 azm-top">
        <van-field v-model="title" label="商品名称" placeholder="填写名称，例如精油" maxlength="5"
                   clearable/>
        <van-field v-model="brand" label="商品品牌" placeholder="填写品牌，例如德国kneipp" maxlength="10"
                   clearable/>
        <van-cell title="商品图片" is-link>
          <vue-core-image-upload ref="imgUpload" :class="['btn', 'btn-primary']" inputOfFile="_file_" :crop="false"
                                 :data="{}" :multiple="false" :compress="30" :isXhr="isXhr" :url="url"
                                 @imageuploaded="imageuploaded" @imagechanged="imagechanged" @errorhandle="errorhandle"
                                 @imageuploading="imageuploading">
            <template v-if="cover">
              <span>已完善</span>
            </template>
            <span class="azm-perfect-active" v-else><i class="iconfont icon-gantanhao azm-icon"></i>未完善</span>
          </vue-core-image-upload>
        </van-cell>
      </van-cell-group>
    </mu-flex>
    <mu-container class="demo-loadmore-content marTop12">
      <mu-list style="height: 100%">
        <mu-row :gutter="true" v-if="item_brand.length>0">
          <template v-for="(item,index) in item_brand">
            <mu-col :span="4" class="pr">
              <van-icon name="clear" class="azm-icon" @click="closeItem(index)"/>
              <azm-avatar :src="item.cover"></azm-avatar>
              <p class="azm-title">{{item.title}}</p>
              <p class="azm-brand">{{item.brand}}</p>
            </mu-col>
          </template>
        </mu-row>
        <azm-abnor v-else type="ORDER" title="还没有相关商品哦~"></azm-abnor>
      </mu-list>
    </mu-container>
    <mu-flex class="azm-append-footer">
      <mu-button full-width textColor="#fff" @click.native="onConfirm">
        <span>提交</span>
      </mu-button>
    </mu-flex>
  </mu-flex>
</template>

<script>
  import Abnor from "../../components/abnor/index.vue"
  import config from  '../../libs/config'
  import VueCoreImageUpload  from 'vue-core-image-upload';
  import Avatar from '../../components/avatar/index.vue'
  import { Button } from 'muse-ui';
  import { Field, Cell, CellGroup, Icon } from 'vant';
  import { mapState } from 'vuex'
  export default {
    components: {
      VueCoreImageUpload,
      [Abnor.name]: Abnor,
      [Icon.name]: Icon,
      [Avatar.name]: Avatar,
      [Button.name]: Button,
      [Field.name]: Field,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
    },
    data(){
      return {
        message: '',
        title: '',
        brand: '',
        cover: '',
        item_brand: [],
        url: config.upImageUrl,
        isXhr: true
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
      $.extend(true, this.item_brand, this.productData.item_brand)
      this.$nextTick(function () {
        let dom = $("input[type='file']")
        if (this.$device.isAndroid) {
          dom.attr('accept', 'image/*')
          if (this.$device.isWechat || window.mmtc_environment == 2) {
            dom.attr('capture', 'camera')
          } else {
            dom.removeAttr("capture");
          }
        } else {
          dom.attr('accept', 'image/jpg,image/jpeg,image/png,image/gif')
          dom.removeAttr("capture");
        }
      })
    },
    methods: {
      imageuploaded(res){
        console.log(res, 'imageuploaded')
        this.loading && this.loading.close()
        try {
          if (!this.isXhr)return;
          let long_url = res.info
          if (+res.status === 1) {
            this.$toast.message('上传成功')
            this.cover = long_url
          } else {
            this.$toast.error(long_url || '上传失败')
          }
        } catch (err) {
          this.$toast.error('上传失败')
        }
      },
      imageuploading(e){
        console.log(e, 'imageuploading')
        this.loading = this.$loading({
          text: '上传中。。。'
        });
      },
      imagechanged(e){
        console.log(e, 'imagechanged')
      },
      errorhandle(e){
        console.log(e, 'errorhandle')
        this.$toast.error(e)
      },
      bindaddItem(){
        let imgUpload = this.$refs.imgUpload
        console.log(imgUpload)
        if (!this.title) {
          this.$toast.error('请添加商品名称~')
          return;
        } else if (!this.brand) {
          this.$toast.error('请添加商品品牌~')
          return;
        } else if (!this.cover) {
          this.$toast.error('请添加商品图片~')
          return;
        }
        this.addItem()
      },
      addItem(){
        this.item_brand.push({
          title: this.title,
          brand: this.brand,
          cover: this.cover,
        })
        this.title = ''
        this.brand = ''
        this.cover = ''
      },
      closeItem(index){
        let that = this;
        if (index > -1) {
          that.$confirm('确定要删除商品？', '提示', {type: 'warning'}).then(({result}) => {
            if (result) {
              that.item_brand.splice(index, 1)
            } else {
              that.$toast.message('点击了取消');
            }
          })
        }
      },
      onConfirm(){
        let productData = this.productData;
        if (this.item_brand && this.item_brand.length > 0) {
          productData.item_brand = this.item_brand
          this.$router.back()
        } else {
          this.$toast.warning('至少添加一个商品~')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-itemBrand {
    position: fixed;
    height: 100%;
    width: 100%;
    .azm-header {
      background-color: #fff2e5;
      font-size: 12px;
      color: #ff4919;
      padding: 3px 15px;
      > .d-flex {
        height: 25px;
        line-height: 25px;
      }
      .mu-button {
        font-size: 12px;
        height: 25px;
        min-width: 0;
        border: 1px solid #ff4919;
      }
    }
    .azm-perfect-active {
      color: #ff4919;
      font-size: 14px;
      .azm-icon {
        font-size: 14px;
        margin-right: 3px;
      }
    }
    .demo-loadmore-content {
      .mu-list {
        box-sizing: border-box;
        padding-left: 8px;
        padding-right: 8px;
      }
      background-color: #fff;
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      p {
        text-align: center;
      }
      .azm-title {
        font-size: 14px;
        color: #282828;
      }
      .azm-icon {
        position: absolute;
        top: 0;
        right: 8px;
        z-index: 100;
        font-size: 16px;
        transform: translate(50%, -50%);
        background-color: #fff;
        color: #999;
      }
    }
    .azm-append-footer {
      width: 100%;
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
  .azm-product-itemBrand {
  }
</style>
