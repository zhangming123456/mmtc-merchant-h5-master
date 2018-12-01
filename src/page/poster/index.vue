<template>
  <div ref="dom" class="azm-poster-index">
    <mu-paper :zDepth="20" class="azm-poster-box">
      <div id="poster" class="poster" ref="poster"
           :style="{height: `${model.h/ model.w * posterWidth / placeholderPic}rem`,overflow:!isGenerate?'hidden':'visible'}">
        <img :src="model.background" v-if="model.background" class="azm-poster-bg" @load="loadImage">
        <template v-for="(item,index) in configList">
          <div class="azm-poster-item"
               :class="{'azm-poster-img':+item.type === 1 || +item.type === 2,
                            'azm-poster-txt':+item.type === 0 || +item.type === 3,
                            'azm-poster-txt-line':+item.type === 0,
                            'azm-overflow-visible':(item.focus || $route.query.isEdit == 1) && !isGenerate && +item.status === 1}"
               :style="item.style"
               @click.stop="textFocus(item,index,$event)">
            <div :data-index="index" :style="{zIndex:item.z_index}" v-if="!isGenerate && +item.status === 1"
                 :class="{'azm-poster-focus':item.focus,'azm-poster-edit':$route.query.isEdit == 1 && !item.focus}"></div>
            <!--模板文字 多行文字-->
            <textarea class="azm-poster-content" v-if="+item.type === 3" disabled>{{item.content}}</textarea>
            <!--模板文字 单行文字-->
            <!--<p class="azm-poster-content" v-else-if="+item.type === 0 && item.content.indexOf(/\d/ig) > -1"></p>-->
            <p class="azm-poster-content" v-else-if="+item.type === 0">{{item.content}}</p>
            <!--模板图片-->
            <img class="azm-poster-content" v-else-if="+item.type === 1 && item.content" :src="item.content">
            <!--二维码-->
            <qrcode class="azm-poster-qrcode azm-poster-content" v-else-if="+item.type === 2 && item.content"
                    v-model="item.content"></qrcode>
          </div>
        </template>
      </div>
    </mu-paper>
    <mu-flex class="azm-footer">
      <mu-flex fill>
        <mu-button class="azm-btn azm-btn-chang" flat color="primary" @click.native="changeTemplate">
          <img src="../../assets/teml@3x.png">
          <span>换模板</span>
        </mu-button>
      </mu-flex>
      <mu-flex fill class="vux-1px-l">
        <mu-button class="azm-btn azm-btn-generate" flat color="primary" @click.native="generate">
          <img src="../../assets/save@3x.png">
          <span>生成</span>
        </mu-button>
      </mu-flex>
    </mu-flex>
    <div class="azm-wechat-edit" v-if="isMiniWechat" @click="toEdit">
      <i class="iconfont icon-dui" v-if="$route.query.isEdit == 1"></i>
      <i class="iconfont icon-bianji" v-else></i>
    </div>
    <azm-crop-image ref="cropImage" id="imgUploader"></azm-crop-image>
    <mu-dialog ref="qrcodeDialog" width="84%" max-width="500px" class="azm-qrcode-dialog"
               transition="slide-bottom" :open.sync="qrcodeDialog.show" @close="qrcodeDialog.cancel">
      <div slot="title" class="w100">
        <p class="azm-qrcode-dialog-title">{{qrcodeDialog.title}}</p>
        <p class="azm-qrcode-dialog-body">{{qrcodeDialog.content}}</p>
      </div>
      <mu-flex class="azm-footer azm-1px-t">
        <mu-flex fill>
          <mu-button class="azm-btn azm-btn-dialog" flat color="primary" @click.native="qrcodeDialog.cancel">
            <span>取消</span>
          </mu-button>
        </mu-flex>
        <mu-flex fill class="azm-1px-l">
          <mu-button class="azm-btn azm-btn-dialog" flat color="primary" @click.native="qrcodeDialog.confirm">
            <span>确认</span>
          </mu-button>
        </mu-flex>
      </mu-flex>
    </mu-dialog>
    <mu-dialog ref="dialog" width="100%" max-width="500px" class="azm-mu-dialog-box"
               transition="slide-bottom" :open.sync="openFullscreen" scrollable>
      <p class="azm-poster-txt" slot="title" v-if="!imageLoading">长按这张海报保存到手机相册，分享好友或朋友圈~</p>
      <mu-paper :zDepth="10" class="azm-poster-img" v-if="!imageLoading">
        <img :src="posterImage">
      </mu-paper>
      <!--<p class="azm-poster-txt" v-if="!imageLoading">长按这张海报保存到手机相册，分享好友或朋友圈~</p>-->
      <div class="azm-poster-loading" v-if="imageLoading">
        <mu-circular-progress class="demo-circular-progress" color="#2D81E4" :stroke-width="7"
                              :size="56"></mu-circular-progress>
        <p class="p2">正在为你生成</p>
      </div>
    </mu-dialog>
    <azm-textarea class="textarea" ref="textarea" @input="inputField"></azm-textarea>
    <azm-x-popup v-model="show" ref="XPopup" keyTxt="id"></azm-x-popup>
    <div class="azm-html2canvas" ref="canvas"></div>
  </div>
</template>

<script>
  import canvasDraw from '../../libs/canvasDraw'
  import { mapState } from 'vuex';
  import azmXPopup from "../../view-render/x-popup"
  import museTextarea from "../../view-render/muse-textarea"
  import cropImage from '../../view-render/crop-image';
  import VueCoreImageUpload from 'vue-core-image-upload';
  import image2base64 from '../../libs/image2base64'
  import { Paper } from 'muse-ui'
  import { Uploader, Popup } from 'vant';
  import { Qrcode } from 'vux'
  import config from '../../libs/config'
  import Deploy2style from '../../libs/deploy2style';
  import h5Jssdk from '../../libs/h5-jssdk-api/index'

  export default {
    components: {
      VueCoreImageUpload,
      [azmXPopup.name]: azmXPopup,
      [museTextarea.name]: museTextarea,
      [cropImage.name]: cropImage,
      [Paper.name]: Paper,
      [Uploader.name]: Uploader,
      [Popup.name]: Popup,
      Qrcode
    },
    data () {
      return {
        winW: document.documentElement.clientWidth,
        winH: document.documentElement.clientHeight,
        message: '',
        openFullscreen: false,
        imageLoading: true,
        show: false,
        active: 0,
        placeholderPic: 1,
        imgList: [{url: "http://pic.58pic.com/58pic/14/62/50/62558PICxm8_1024.jpg", title: '默认'},
          {url: "http://img12.3lian.com/gaoqing02/01/58/85.jpg", title: '田园'},
          {url: "http://img2.imgtn.bdimg.com/it/u=2120794298,1619920560&fm=200&gp=0.jpg", title: '风格'},
          {url: "http://img4.imgtn.bdimg.com/it/u=2470095470,149692322&fm=200&gp=0.jpg", title: '太阳'},
          {url: "http://img1.imgtn.bdimg.com/it/u=2136224270,1682917163&fm=200&gp=0.jpg", title: '月亮'},
          {url: "http://img1.imgtn.bdimg.com/it/u=3608809992,539129017&fm=200&gp=0.jpg", title: '你好'},
          {url: "http://img0.imgtn.bdimg.com/it/u=3225290706,4214409874&fm=200&gp=0.jpg", title: 'tag'},],
        options: {
          vuescroll: {
            mode: 'slide',
            scroller: {
              bouncing: true
            },
            zooming: false,
          },
          scrollPanel: {
            scrollingX: false,
            speed: 800,
          },
          bar: {
            keepShow: false,
            opacity: 0,
            background: "rgb(3, 185, 118)",
            showDelay: 500
          },
          rail: {
            keepShow: false,
            opacity: 0,
            background: '#01a99a',
          }
        },
        model: {},
        configList: [],
        imgIndex: null,
        isGenerate: false,
        posterWidth: 300,
        qrcodeDialog: {
          show: false,
          confirm () {

          },
          cancel () {
            this.show = false;
            this.title = null;
            this.content = null;
          }
        },
        posterImage: null,
      }
    },
    computed: {
      ...mapState({})
    },
    watch: {
      ['$route.query'] (n, o) {
        this.unqateNavbar(n.isEdit);
      },
      [`qrcodeDialog.show`]: {
        handler (n) {
          console.log(n, 'qrcodeDialog');
          if (n) {
            this.util.Native.setNavigation({opacity: 0.5, isDisabled: 1})
          } else {
            this.util.Native.setNavigation({opacity: 1, isDisabled: 0})
          }
        },
        deep: true
      }
    },
    inject: ["appRefresh", 'isMerchantH5', '$$$setNarBar'],
    created () {
      let $ = this.$azm.Zepto;
      let that = this;
      that.placeholderPic = this.util.placeholderPic();
      that.getPosterConfig(that.$route.query.id);
      that.unqateNavbar(that.$route.query.isEdit);
      this.$nextTick(function () {
        this.winH -= $('.azm-poster-index').offset().top
        let dom = $("input[type='file']");
        if (this.$device.isAndroid) {
          dom.attr('accept', 'image/*');
          if (this.$device.isWechat || window.mmtc_environment == 2) {
            dom.attr('capture', 'camera')
          } else {
            dom.removeAttr("capture");
          }
        } else {
          dom.attr('accept', 'image/jpg,image/jpeg,image/png,image/gif')
          dom.removeAttr("capture");
        }
        $(document.body, window).on('click', function (e) {
          e = e || window.event
          that.inputBodyBlur(e);
        });
        this.posterWidth = $(that.$refs.poster).width();
      });
    },
    methods: {
      unqateNavbar (type = 0) {
        if (type == 1) {
          this.$$$setNarBar({
            title: '编辑',
            rightIcon: "icon-dui",
            rightBtn: this.toEdit,
            lowerLine: false,
            style: {
              background: "#555",
              color: "#fff"
            },
            rightStyle: {
              color: "#fff"
            }
          });
        } else {
          this.$$$setNarBar({
            rightText: "编辑",
            rightBtn: this.toEdit,
            lowerLine: false,
            style: {
              background: "#555",
              color: "#fff"
            },
            rightStyle: {
              color: "#fff"
            }
          });
        }
      },
      inputBodyBlur (e) {
        for (let v of this.configList) {
          v.focus = false;
          v.zIndex = 0;
        }
        this.$forceUpdate();
      },
      getPosterConfig (id = 0, bol = false) {
        let that = this;
        if (bol) {
          that.$vux.loading.show({
            text: "加载中..."
          });
        }
        that.$ajax.getPosterConfig({id}).finally(function (res) {
          that.$vux.loading.hide();
          if (res.status === 1) {
            let info = res.info;
            that.model = info.model;
            that.configList = info.config;
            that.deploy2style();
          } else {
            that.$toast.error(res.msg || '请求失败')
          }
        });
      },
      /**
       * 编辑与确定
       */
      toEdit () {
        let isEdit = this.$route.query.isEdit;
        let id = this.$route.query.id;
        this.$router.replace({path: '/poster_index', query: {id, isEdit: isEdit == 1 ? 0 : 1}})
      },
      handleResize () {

      },
      /**
       * 生成
       */
      generate () {
        let that = this;
        that.isGenerate = true;
        that.openFullscreen = true;
        that.imageLoading = true;
        let $ = this.util.Zepto;
        this.$nextTick(function () {
          canvasDraw.drawPoster(that.$refs.poster).then(function (img) {
            if (that.isMerchantH5) {
              that.openFullscreen = false;
              that.util.Native.saveImageToPhotosAlbum({filePath: img.src}).finally(res => {
                if (res.status === 0) {
                  that.$toast.error('操作失败~')
                }
              })
            } else if (config.isMiniWechat && false) {
              that.openFullscreen = false;
              that.$wechat.updateAppMessageShareData({
                title: '', // 分享标题
                link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: img.src, // 分享图标
              });
              // that.$wechat.miniProgram.navigateBack(1);
            } else {
              console.log(img.src);
              that.posterImage = img.src
            }
          }).finally(function (res) {
            that.imageLoading = false;
            that.isGenerate = false;
          });
        })
      },
      changeTemplate () {
        let that = this;
        let id = this.$route.query.id
        if (id) {
          that.$vux.loading.show({
            text: "获取中..."
          })
          this.$ajax.getPosterModel({id}).finally(res => {
            that.$vux.loading.hide();
            if (res.status === 1 && res.info) {
              that.$refs.XPopup.show({
                list: res.info,
                active: id,
                confirm (res) {
                  console.log(res);
                },
                select (item) {
                  if (item && item.id) {
                    that.getPosterConfig(item.id, true);
                    that.$router.replace({path: '/poster_index', query: {id: item.id}})
                  }
                }
              })
            } else {
              that.$toast.error(res.msg || '请求失败')
            }
          })
        }
      },
      async textFocus (item, index, e) {
        if (+item.status !== 1) {
          return;
        }
        let that = this;
        let $ = this.util.Zepto;
        for (let v of that.configList) {
          if (v.id !== item.id) {
            v.focus = false;
            v.zIndex = 0;
          }
        }
        if ([0, 1, 3].indexOf(+item.type) > -1) {
          item.focus = true;
          item.zIndex = 1000;
        }
        if (!item) return;
        if (+item.type === 0 || +item.type === 3) {
          that.$refs.textarea.focus({
            value: item.content,
            input (val) {
              item.content = val;
            },
            submit () {
              item.focus = false;
              item.zIndex = null;
              that.$forceUpdate();
            }
          })
        } else if (+item.type === 1 || +item.type === 2) {
          let box = $(e.target);
          if (!box.is('div.azm-poster-item')) {
            box = box.parents('div.azm-poster-item');
          }
          if (+item.type === 2) {
            that.qrcodeDialog.show = true;
            that.qrcodeDialog.title = item.tip;
            that.qrcodeDialog.content = item.tip2;
            that.qrcodeDialog.confirm = function () {
              that.chooseCrop(box, item)
            }
          } else {
            that.chooseCrop(box, item)
          }
        }
        that.$forceUpdate();
      },
      async chooseCrop (box, item) {
        let that = this;
        that.qrcodeDialog.show = false;
        that.$refs.cropImage.chooseCrop({
          aspectRatio: box.width() / box.height(),
          success (data) {
            if (data && data.url) {
              item.content = data.url;
              item.url = data.originalUrl;
              if (+item.type === 2) {
                item.type = 1
              }
            }
            item.focus = false;
            item.zIndex = null;
            that.$forceUpdate();
          },
          cancel () {
            item.focus = false;
            item.zIndex = null;
            that.$forceUpdate();
          }
        })
      },
      inputField (val) {
        console.log(val);
        let newProductSkuVOList = [
          {
            id: 1,
            value: 20
          },
          {
            id: 2,
            value: 30
          },
          {
            id: 3,
            value: 50
          },
          {
            id: 4,
            value: 400
          },
          {
            id: 5,
            value: 20
          },
          {
            id: 6,
            value: 30
          },
          {
            id: 7,
            value: 30
          }
        ];
        let arr = [];
        for (let v of newProductSkuVOList) {
          if (arr.indexOf(v.value) === -1) {
            v.repeat = true
          }

        }
        console.log(newProductSkuVOList);
      },
      getBase64 (url) {
        return image2base64.getContentTxt(url).finally(res => {

        });
      },
      loadImage () {
        // this.$forceUpdate()
      },
      deploy2style () {
        let $ = this.util.Zepto;
        let dom = $(this.$refs.poster)
        if (this.configList) {
          let deploy2style = new Deploy2style(this.model, dom.width());
          for (let v of this.configList) {
            v.style = deploy2style.toStyleObj(v.basic, v.customize)
          }
        }
        this.$forceUpdate();
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-poster-index {
    position: relative;
    .azm-wechat-edit {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1000;
      height: 45px;
      width: 45px;
      text-align: center;
      display: table;
      > i {
        display: table-cell;
        vertical-align: middle;
        color: rgb(255, 255, 255);
      }
    }
    .azm-poster-scroll {
      position: absolute;
      margin: auto;
      left: 0;
      top: 0;
      right: 0;
      bottom: 45px;
      box-sizing: border-box;
      .azm-poster-scroll-box {
        box-sizing: border-box;
        padding-top: 40px;
        padding-bottom: 40px;
      }
    }
    .azm-footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 1000;
      .azm-btn {
        width: 100%;
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        &.azm-btn-generate {
          color: #fff;
          background-color: #2D81E4;
          img {
            width: 24px;
            height: auto;
            margin-right: 10px;
          }
        }
        &.azm-btn-chang {
          color: #C3C3C3;
          background-color: #555555;
          img {
            width: 24px;
            height: auto;
            margin-right: 10px;
          }
        }
      }
    }
    .azm-html2canvas.azm-poster-box {
      position: absolute;
      z-index: 0;
    }
    .azm-poster-box {
      position: relative;
      margin: 50px auto;
      width: 80%;
      background: transparent;
      font-size: 32px;
      z-index: 200;
    }
    #poster {
      position: relative;
      color: #fff;
      line-height: 0;
      overflow: hidden;
      .azm-poster-bg {
        width: 100%;
        height: auto;
      }
      .azm-poster-img {
        display: table;
        overflow: hidden;
        > img.azm-poster-content {
          width: 100%;
          height: auto;
          display: table-cell;
          vertical-align: middle;
        }
      }
      .azm-poster-txt {
        overflow: hidden;
        box-sizing: content-box;
        line-height: 1;
        font-size: 12px;
        > textarea.azm-poster-content, p.azm-poster-content {
          overflow: hidden;
          border: none;
          background-color: transparent;
          width: 100%;
          height: 100%;
          font-size: inherit;
          color: inherit;
          opacity: 1;
          text-align: inherit;
          line-height: inherit;
        }
        > p.azm-poster-content {
          /*word-wrap: break-word;*/
          /*word-break: break-all;*/
          /*overflow: hidden;*/
        }
      }
      .azm-overflow-visible {
        overflow: visible !important;
      }
      .azm-poster-focus {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(45, 129, 228, 0.10);
        border: 1px solid #FF3C00;
        z-index: 2000;
        &:after, &:before {
          position: absolute;
          content: ' ';
          top: 50%;
          width: 5px;
          height: 5px;
          background: #FFFFFF;
          border: 1px solid #FF3C00;
        }
        &:after {
          transform: translate(-50%, -50%);
          left: 0;
        }
        &:before {
          transform: translate(50%, -50%);
          right: 0;
        }
      }
      .azm-poster-edit {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(45, 129, 228, 0.10);
        border: 1px solid #4DA9EB;
        &:after {
          transform: translate(-50%, -50%);
          left: 0;
        }
        &:before {
          transform: translate(50%, -50%);
          right: 0;
        }
        &:after, &:before {
          position: absolute;
          content: ' ';
          top: 50%;
          width: 5px;
          height: 5px;
          background: #FFFFFF;
          border: 1px solid #4DA9EB;
        }
      }
      .azm-poster-item {
        position: absolute;
        display: block;
        z-index: 10;
        top: 0;
        left: 0;
        min-width: 10px;
        min-height: 10px;
        &.azm-poster-txt.azm-poster-txt-line {
          display: table;
          table-layout: fixed; //(用来显示表格单元格、行、列的算法规则)
          word-wrap: break-word;
          word-break: break-all;
          .azm-poster-content {
            display: table-cell;
            vertical-align: inherit;
            word-wrap: break-word;
            word-break: break-all;
            /*writing-mode: vertical-lr; !*从左向右 从右向左是 writing-mode: vertical-rl;*!*/
            /*writing-mode: tb-rl; !*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*!*/
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .azm-poster-index {
    .azm-poster-qrcode {
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 3px;
      box-sizing: border-box;
      img {
        width: 100% !important;
        height: 100% !important;
      }
    }
    .azm-input-content {
      .mu-input-content {
        padding: 5px 10px;
        border: 1px solid #DBDBDB;
        border-radius: 4px;
        background: #FFFFFF;
        font-size: 16px;
        color: #333333;
      }
    }
  }

  .azm-mu-dialog-box {
    .mu-dialog {
      position: relative;
      .mu-dialog-body {
        position: relative;
        min-width: 100%;
        min-height: 50px;
        padding: 20px 30px;
        box-sizing: border-box;
        .azm-poster-img {
          line-height: 0;
          border-radius: 4px;
          min-height: 300px;
          max-height: 90%;
          > canvas {
          }
          > img {
            width: 100%;
            height: auto;
          }
        }
        .azm-poster-loading {
          width: 100%;
          height: 215px;
          text-align: center;
          img {
            width: 60px;
            height: auto;
            margin-top: 40px;
          }
          .demo-circular-progress {
            margin-top: 50px;
          }
          p.p1 {
            margin-top: 10px;
            font-size: 14px;
            color: #2D81E4;
          }
          p.p2 {
            margin-top: 10px;
            color: #333333;
            font-size: 14px;
          }
        }
      }
      .mu-dialog-title {
        padding: 0;
        .azm-poster-txt {
          position: absolute;
          text-align: center;
          color: #fff;
          font-size: 14px;
          width: 60%;
          bottom: -12%;
          left: 50%;
          line-height: 20px;
          transform: translateX(-50%);
        }
      }
    }
  }

  .azm-qrcode-dialog {
    .mu-dialog {
      border-radius: 5px;
      overflow: hidden;
      .mu-dialog-title {
        font-size: 12px;
        text-align: center;
        .azm-qrcode-dialog-title {
          font-size: 34/2px;
          color: #171F24;
          text-align: center;
        }
        .azm-qrcode-dialog-body {
          font-size: 14px;
          color: #AAB2B7;
          text-align: center;
        }
      }
      .mu-dialog-body {
        padding: 0;
      }
      .azm-footer {
        width: 100%;
        &.vux-1px-t:before {
          color: #AAB2B7;
        }
        &.azm-1px-t {
          border: 0 solid #AAB2B7;
          border-top-width: 1px;
        }
        .azm-1px-l {
          border: 0 solid #AAB2B7;
          border-left-width: 1px;
        }
        .azm-btn {
          width: 100%;
          border-radius: 0;
          height: 45px;
          line-height: 45px;
          &.azm-btn-dialog {
            font-size: 32/2px;
            color: #2D81E4;
            background-color: #fff;
          }
        }
      }
    }
  }

  @media screen and (max-width: 500px) {
    .azm-mu-dialog-box {
      .mu-dialog {
        max-width: 85% !important;
      }
    }
  }
</style>
