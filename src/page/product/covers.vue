<template>
  <div class="azm-product-covers">
    <mu-row :gutter="true">
      <mu-col :span="3" class="azm-images-item">
        <vue-core-image-upload ref="imgUpload" :class="['btn', 'btn-primary']" inputOfFile="_file_" :crop="false"
                               :data="{}"
                               :multiple="true" :multiple-size="9" :credentials="true" :max-file-size="1024*1024*6"
                               :compress="30" :isXhr="isXhr" :url="url" @imageuploaded="imageuploaded"
                               @imagechanged="imagechanged"
                               @errorhandle="errorhandle" @imageuploading="imageuploading">
          <azm-avatar class="azm-images-img" src="https://app.mmtcapp.com/mmtc/imgs/addpic@2x.png"></azm-avatar>
        </vue-core-image-upload>
      </mu-col>
      <mu-col class="pr azm-images-item" :span="3" v-for="(item,index) in productData.cover" :key="index">
        <van-icon name="clear" class="azm-icon azm-icon-close" @click="closeItem(index)"></van-icon>
        <azm-avatar :height="74" :src="item"></azm-avatar>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>

  import { Icon }  from 'vant';
  import VueCoreImageUpload  from 'vue-core-image-upload';
  import Avatar from '../../components/avatar/index.vue'
  import config from '../../libs/config'
  import { mapState } from 'vuex'
  export default {
    components: {
      VueCoreImageUpload,
      [Icon.name]: Icon,
      [Avatar.name]: Avatar,
    },
    data(){
      return {
        message: '',
        covers: '',
        isXhr: true,
        loading: null,
        url: config.upImagesUrl
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    created(){
      this.$nextTick(function () {
        let $ = this.$azm.Zepto
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
          let long_url = res.info.long_url
          if (res.status === 1 && long_url.length > 0) {
            this.$toast.message('上传成功')
            this.productData.cover = this.productData.cover.concat(long_url)
          } else {
            this.$toast.error(JSON.stringify(res.info) || '上传失败')
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
      closeItem(index){
        let that = this;
        if (index > -1) {
          that.$confirm('确定要删除该图片？', '提示', {type: 'warning'}).then(({result}) => {
            if (result) {
              that.productData.cover.splice(index, 1)
            } else {
              that.$toast.message('点击了取消');
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-covers {
    box-sizing: border-box;
    padding: 12px 15px;
    .azm-images-item {
      height: 74px;
    }
  }
</style>
