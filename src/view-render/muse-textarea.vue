<template>
  <div>
    <a href="javascript:void(0)" class="azm-mask" v-if="show"></a>
    <div class="azm-muse-textarea"
         :style="{bottom:(!show?'-1000px':0),left:0}">
      <mu-text-field ref="textField" v-model="value" class="azm-input-content"
                     multi-line :rows="4" :rows-max="4"
                     full-width :max-length="100" solo @input="inputField" @blur="inputBlur" @focus="inputFocus"
                     v-on:keyup="keyup"
                     v-on:keyup.enter="submit"></mu-text-field>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  let interval = null;
  export default {
    name: 'azm-textarea',
    components: {},
    data () {
      return {
        message: '',
        value: '',
        show: false,
        ops: {},
        innerHeight: window.innerHeight,
        keyboardHeight: 0,
        x: 0,
        y: 0
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", 'isMerchantH5'],
    created () {
      let that = this,
        $ = this.util.Zepto;
    },
    methods: {
      inputField () {
        this.ops.input && this.ops.input(this.value);
        this.$emit('input', this.value);
      },
      inputFocus (e) {
        let that = this,
          $ = this.util.Zepto;
        var dom = e.target
        setTimeout(function () {
          dom.scrollIntoView(true);
          dom.scrollIntoViewIfNeeded();
        }, 500);
        // interval = setInterval(function () {//设置一个计时器，时间设置与软键盘弹出所需时间相近
        //   document.body.scrollTop = that.y - 100;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
        //   // that.keyboardHeight = that.y;
        // }, 100);
      },
      inputBlur (e) {
        let that = this,
          $ = this.util.Zepto;
        this.ops.submit && this.ops.submit(this.value);
        this.$emit('submit', this.value);
        this.show = false;
        this.value = '';
        // clearInterval(interval);//清除计时器
      },
      submit (e) {
        console.log(e, e.target);
      },
      keyup (e) {

      },
      focus ({input, submit, value = '', y = 0}) {
        this.value = value;
        this.y = y;
        submit && (this.ops.submit = submit);
        input && (this.ops.input = input);
        this.show = true;
        let $ = this.$azm.Zepto;
        let dom = $(this.$refs.textField.$el);
        dom.find('textarea.mu-text-field-textarea').focus();
        dom.find('textarea.mu-text-field-textarea-hide').focus();
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-mask {
    background: rgba(0, 0, 0, .5);
    bottom: 0;
    display: block;
    left: 0;
    opacity: 0;
    position: fixed;
    right: 0;
    tap-highlight-color: transparent;
    top: 0;
    transition: opacity .4s;
    z-index: 1000;
  }

  .azm-muse-textarea {
    position: fixed;
    box-sizing: border-box;
    z-index: 9999;
    width: 100%;
    background: #FAFAFA;
    padding: 10px 15px 20px;
    .azm-input-content {
      padding-top: 0;

    }
  }
</style>
<style lang="less">
  .azm-muse-textarea {
  }
</style>
