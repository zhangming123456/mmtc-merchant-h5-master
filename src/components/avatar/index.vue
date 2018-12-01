<template>
  <div class="azm-avatar" ref="avatar" style="background-color: #eeeeee" :style="avatarStyle">
    <img src="../../assets/cooperation-icon/05_icon_add.png" :style="imgStyle"
         @load="bindload($event)"
         @error="binderror" ref="avatarImg" v-if="isLocal && imgType==='img1'">
    <img v-lazy="url" :style="imgStyle" @load="bindload($event)" @error="binderror"
         ref="avatarImg" v-else>
  </div>
</template>

<script>

  export default {
    name: 'azm-avatar',
    props: {
      src: {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: 'scaleToFill'
      },
      lazyLoad: {
        type: Boolean,
        default: false
      },
      isLocal: {
        type: Boolean,
        default: false
      },
      aspectRatio: {
        type: [String, Number],
        default: 1
      },
      displayPosition: {
        type: String,
        default: 'center'
      },
      shape: [String, Number],
      width: [String, Number],
      height: [String, Number],
      size: [String, Number],
      imgType: String,
      base64: Boolean
    },
    data () {
      return {
        imageUrl: this.$azm.config.imageUrl,
        isLoad: false,
        imgStyle: '',
        avatarStyle: '',
        url: ''
      }
    },
    mounted () {
      let that = this;
      this.$nextTick(function () {
        that.refresh()
      })
    },
    methods: {
      refresh () {
//        this._setAvatarWidth(true)
//        this.avatar.refresh()
        let that = this,
          avatarBox = that.$azm.Zepto(that.$refs.avatar);
        that.isLoad = false;
        that._setAvatarWidth(avatarBox);
      },
      bindload (...args) {
        let that = this,
          avatarImg = that.$azm.Zepto(that.$refs.avatarImg);
        // `Object.assign` 将所有的对象合并为一个新对象
        that._setImgStyle(avatarImg);
        that.isLoad = true;
        that.$emit('bindload', ...args)
      },
      binderror () {
        let that = this,
          avatarImg = that.$azm.Zepto(that.$refs.avatarImg);
        // `Object.assign` 将所有的对象合并为一个新对象
        that.isLoad = false;
        that.$emit('binderror', avatarImg)
      },
      _setImgStyle (e) {
        let parent = e.parent().parent();
        let height = parent.height();
        let width = parent.width();
        let _f = width > height;
        let W = e.width(),
          H = e.height(),
          mode = this.mode,
          imgStyle = '';
        if (mode === 'aspectFill' && !this.height) {
          let obj1 = {width: '100%', height: "auto"};
          let obj2 = {width: "auto", height: '100%'};
          if (W === H && !_f) {
            imgStyle = obj2
          } else if (W === H && _f) {
            imgStyle = obj1
          } else if (W > H && !_f) {
            imgStyle = obj2
          } else if (W > H && _f) {
            imgStyle = obj1
          } else if (W < H && !_f) {
            imgStyle = obj2
          } else {
            imgStyle = obj1
          }
        } else if (this.height > 0) {
          imgStyle = {
            width: "100%",
            height: 'auto'
          }
        } else {
          if (W >= H) {
            imgStyle = `width: auto;height: 100%;`
          } else {
            imgStyle = `width: 100%;;height: auto;`
          }
        }
        this.imgStyle = imgStyle
      },
      async _setAvatarWidth (e) {
        let w1 = this.width,
          h1 = this.height,
          W = w1 || e.width(),
          H = h1 || e.height(),
          height = H / this.aspectRatio,
          width = W * this.aspectRatio,
          placeholderPic = this.$azm.util.placeholderPic(),
          avatarStyle = 'width: 100%;';
        if (w1) {
          avatarStyle = `width: ${W / 75}rem;`
          avatarStyle += `height: ${width / 75}rem;`
        } else if (h1) {
          avatarStyle += `height: ${height / 75}rem;`
        } else if (width) {
          avatarStyle += `height: ${width / placeholderPic}rem;`
        }
        if (this.shape === 'round') {
          avatarStyle += 'border-radius: 100%;'
        }
        this.avatarStyle = avatarStyle;
        let url = this.util.absUrl(this.src);
        this.url = url;
        this.$emit('input', url);
        // this.avatarStyle += `background: url('${url}') no-repeat fixed center;background-size: cover;`;
      }
    },
    watch: {
      src: {
        handler () {
          this.refresh();
        },
        deep: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .azm-avatar {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 10px;
    line-height: 1;
    display: inline-block;
    overflow: hidden;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &.azm-avatar--img {
        transform: translate(-250%, -250%);
      }
    }
  }
</style>
