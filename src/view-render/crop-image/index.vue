<template>
  <div class="azm-crop-image" ref="avatar" :style="avatarStyle">
    <div v-transfer-dom v-show="cropShow" class="crop-image-box" ref="cropImageBox">
      <mu-button class="azm-btn azm-btn-generate" flat color="#fff" @click.native="generate">
        <i class="iconfont icon-dui"></i>
      </mu-button>
      <mu-button class="azm-btn azm-btn-reset" flat color="#fff" @click.native="reset">还原</mu-button>
      <mu-button class="azm-btn azm-btn-rotate" flat color="#fff" @click.native="rotate">
        <i class="iconfont icon-xuanzhuan"></i>
      </mu-button>
      <mu-button class="azm-btn azm-btn-cancel" flat color="#fff" @click.native="dropOut">
        <i class="iconfont icon-quxiao"></i>
      </mu-button>
      <mu-divider class="azm-divider"></mu-divider>
      <div class="crop-image" v-loading="loading"></div>
    </div>
    <van-uploader :after-read="onFileRead" :id="id" @oversize="oversize"
                  ref="uploader" v-show="false"></van-uploader>
  </div>
</template>

<script>
  import h5Jssdk, { Canvas2image } from '../../libs/h5-jssdk-api/index'
  import { $ as Zepto, config } from '../../libs/util'

  import image2base64 from '../../libs/image2base64';
  import Cropper from 'cropperjs'
  import { Uploader } from 'vant';
  import { Divider } from "muse-ui"

  let configCropper = {
    viewMode: 1,
    dragMode: 'move',
    minCropBoxWidth: 200,
    minCropBoxHeight: 200,
    cropBoxMovable: false,
    cropBoxResizable: false,
    background: true,
    autoCrop: true,
  }

  let $ = null;

  export default {
    name: 'azm-crop-image',
    components: {
      [Uploader.name]: Uploader,
      [Divider.name]: Divider,
    },
    props: {
      id: String,
      base64: Boolean,
      autoUpload: Boolean,
      isCrop: {
        type: Boolean,
        default: true
      },
    },
    data () {
      $ = this.$azm.Zepto;
      return {
        imageUrl: this.$azm.config.imageUrl,
        isLoad: false,
        imgStyle: '',
        avatarStyle: '',
        url: '',
        originalUrl: null,
        cropShow: false,
        cropper: null,
        imgWidth: 0,
        imgHeight: 0,
        aspectRatio: 1,
        src: '',
        success: null,
        canal: null,
        loading: false
      }
    },
    mounted () {
      let that = this;
    },
    created () {
      this.$nextTick(function () {
        let dom = $(this.$el).find('input[type=file]');
        dom.on('blur', function (e) {
          console.log(e);
        })
        dom.on('focus', function (e) {
          console.log(e);
        })
        dom.on('select', function (e) {
          console.log(e);
        })
      })
    },
    methods: {
      // 还原
      reset () {
        if (this.cropper) {
          this.cropper.reset()
        }
      },
      // 旋转
      rotate () {
        if (this.cropper) {
          this.cropper.rotate(-90)
        }
      },
      // 退出
      dropOut () {
        if (this.cropper) {
          this.cropShow = false;
          this.cancel && this.cancel();
        }
      },
      generate () {
        let that = this;
        const autoUpload = !!that.autoUpload;
        that.$vux.loading.hide();
        if (this.cropper) {
          that.$vux.loading.show({
            text: "生成中..."
          });
          let flag = that.imgWidth > that.imgHeight;
          let width = this.imgWidth;
          let height = that.imgWidth / that.aspectRatio;
          if (flag) {
            height = that.imgHeight;
            width = that.imgHeight * that.aspectRatio;
          }
          let canvas = this.cropper.getCroppedCanvas({width, height, maxWidth: 4096, maxHeight: 4096});
          that.cropShow = false;
          try {
            canvas.toBlob(function (blob) {
              that.upload(blob)
            })
          } catch (err) {
            let dataURL = {};
            let ext = this.originalUrl;
            if (/.?(jpg|jpeg)$/ig.test(ext) || /^data:image\/(jpg|jpeg);/ig.test(ext)) {
              dataURL = Canvas2image.convertToJPEG(canvas, canvas.width, canvas.height);
            } else if (/.?gif$/ig.test(ext) || /^data:image\/gif;/ig.test(ext)) {
              dataURL = Canvas2image.convertToGIF(canvas, canvas.width, canvas.height);
            } else if (/.?png$/ig.test(ext) || /^data:image\/png;/ig.test(ext)) {
              dataURL = Canvas2image.convertToPNG(canvas, canvas.width, canvas.height);
            } else {
              dataURL = Canvas2image.convertToImage(canvas, canvas.width, canvas.height);
            }
            that.url = dataURL.src;
            try {
              let blob = that.util.base64toBlob(dataURL.src);
              that.upload(blob)
            } catch (err) {
              that.$vux.loading.hide();
              that.success && that.success({url: dataURL.src, originalUrl: that.originalUrl})
            }
          }
        }
      },
      upload (blob) {
        let that = this;
        let md5 = that.util.md5;
        let url = URL.createObjectURL(blob);
        let name = `${md5(url)}.${blob.type.split('/')[1]}`;
        let formData = new FormData()
        formData.append('_file_', blob, name);
        that.url = url;
        that.cropShow = false;
        if (that.autoUpload) {
          that.$vux.loading.show({
            text: "生成中..."
          });
          that.$ajax.uploadImg({file: formData}).finally(res => {
            that.$vux.loading.hide();
            if (res.status === 1 && res.info && res.info.url) {
              that.success && that.success({url: res.info.url})
            } else {
              that.cancel(res);
            }
          })
        } else {
          that.$vux.loading.hide();
          that.success && that.success({url, originalUrl: that.originalUrl, formData})
        }
      },
      refresh () {
        let that = this,
          avatarBox = that.$azm.Zepto(that.$el);
      },
      readCrop () {
        if (this.originalUrl) {
          this.cropShow = true;
          this.cropImage(this.originalUrl);
        }
      },
      loadImage (e) {

      },
      cropImage (url) {
        let that = this;
        let reg1 = /^https?:\/\//ig;
        let reg2 = /^blob:https?:\/\//ig;
        let reg3 = /^data:image\/(bmp|gif|jpg|jpeg|png);base64,/ig;
        if (!reg1.test(url) && !reg2.test(url) && !reg3.test(url)) {
          url = `data:image/jpeg;base64,${url}`
        }
        this.originalUrl = url;
        this.cropShow = true;
        this.loading = true;

        //新建图片
        let image = new Image();
        image.src = url;
        //解决canvas无法读取画布问题
        image.setAttribute('crossOrigin', 'anonymous');
        $(that.$refs.cropImageBox).find('div.crop-image').html(image);
        //通加载图片完毕保证快速读取
        image.onload = (res) => {
          that.loading = false;
          let dom = $(that.$el);
          let img = $(res.target);
          that.imgWidth = img.width();
          that.imgHeight = img.height();
          const cropper = new Cropper(image, {
            ...configCropper,
            aspectRatio: that.aspectRatio,
            crop (event) {

            },
          });
          that.cropper = cropper;
        }
        image.onerror = (res) => {
          alert(JSON.stringify(res))
        }
      },
      oversize (e) {
        console.log(e, 'oversize');
        this.$emit('oversize', e);
      },
      onFileRead (e) {
        let content = e.content;
        this.cropImage(content);
        console.log(e, 'onFileRead');
        this.$emit('onFileRead', e)
      },
      onUnload (e) {
        console.log(e, 'onUnload');
        this.$emit('unload', e)
      },
      show ({src = '', aspectRatio = 1, success, canal}) {
        this.src = src;
        this.aspectRatio = aspectRatio;
        this.success = success;
        this.canal = canal;
        if (this.src) {
          console.log(this.src, '需要剪切的图片');
          this.cropImage(this.src);
        }
      },
      chooseCrop ({aspectRatio = 1, success = new Function(), cancel = new Function()}) {
        let that = this;
        this.aspectRatio = aspectRatio;
        this.success = success;
        this.cancel = cancel;
        console.log(config.isWxRegister, '微信授权');
        if (that.$device.isWechat && config.isWxRegister) {
          that.$wechat.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              if (res.localIds && res.localIds.length > 0) {
                let src = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                that.$wechat.getLocalImgData({
                  localId: src, // 图片的localID
                  success: function (res) {
                    let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    // alert(localData);
                    that.cropImage(localData);
                  }
                });
              } else {
                cancel();
              }
            },
            cancel
          });
        } else {
          const isCrop = !!that.isCrop;
          const autoUpload = !!that.autoUpload;
          h5Jssdk.chooseImage({crop: isCrop, autoUpload}).then(function (res) {
            console.log(res, 'crop');
            const formData = res.formData;
            let url = res.url || res.dataUrl;
            if (res && url && isCrop) {
              that.cropImage(url);
            } else if (res && url && formData && !isCrop && autoUpload) {
              that.$ajax.uploadImg({file: formData}).finally(res => {
                that.$vux.loading.hide();
                if (res.status === 1 && res.info && res.info.url) {
                  success && success({url: res.info.url})
                } else {
                  cancel(res);
                }
              })
            } else if (res && url && formData && !isCrop && !autoUpload) {
              success && success(res);
            } else {
              cancel();
            }
          }, cancel)
        }
      }
    },
    watch: {
      src: {
        handler () {
          this.refresh();
        },
        deep: true
      },
      cropShow: {
        handler (n) {
          console.log(n, 'cropShow');
          if (n) {
            this.util.Native.setNavigation({isHide: 1})
          } else {
            this.util.Native.setNavigation({isHide: 0})
          }
        },
        deep: true
      },
    }
  }
</script>

<style lang="less" scoped>
  .azm-crop-image {
    display: inline-block;
    line-height: 0;
    overflow: hidden;
  }
</style>


<style lang="less">
  .v-transfer-dom {
    &.crop-image-box {
      .azm-btn {
        position: fixed;
        z-index: 10000;
        height: 55px;
      }
      .azm-divider {
        position: fixed;
        z-index: 10000;
        bottom: 55px;
        left: 0;
        width: 100%;
        background: #eeeeee52;
      }
      .azm-btn-generate {
        bottom: 0;
        right: 0;
      }
      .azm-btn-cancel {
        bottom: 0;
        left: 0;
      }
      .azm-btn-reset {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .azm-btn-rotate {
        bottom: 55px;
        left: 0;
        height: 45px;
      }
    }
    & > .crop-image {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      overflow: hidden;
      background-color: rgba(0, 0, 0, .5);
      .cropper-bg {
        background-image: none;
        background-color: rgb(0, 0, 0);
      }
      .cropper-modal {
        /*background-color: transparent;*/
      }
      & > img {
        position: absolute;
        top: 300%;
      }
    }
  }


</style>
