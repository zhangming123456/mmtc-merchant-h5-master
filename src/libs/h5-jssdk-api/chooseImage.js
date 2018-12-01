import { $ as Zepto } from '../util'
import Vue from 'vue'

const ua = navigator.userAgent

const isAndroid = /(Android);?[\s/]+([\d.]+)?/.test(ua)
const isIpad = /(iPad).*OS\s([\d_]+)/.test(ua)
const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(ua)
const isIphone = !isIpad && /(iPhone\sOS)\s([\d_]+)/.test(ua)
const isWechat = /micromessenger/i.test(ua)
const isAlipay = /alipayclient/i.test(ua)

// 一些常量定义
const MIN_SIZE = 1024 * 1024;
const IMAGE_MIN_WIDTH = 200; // 上传图片最小宽
const IMAGE_MIN_HEIGHT = 200; // 上传图片最小高
const IMAGE_MAX_SIZE = 10; // 上传图片最大大小

export default class {
  constructor () {
    this.inputElement = null;
    this.ops = {}
    this.list = []
    this.errStr = []
    this.flag = []
    this.inputEl = null
  }

  create ({count = 1, sourceType = ['album', 'camera'], success, fail, complete, maxSize} = {}) {
    $('body>#azmFileImage').remove();
    let that = this;
    this.list = [];
    this.errStr = [];
    this.flag = []
    that.ops = {count, success, fail, complete, maxSize};
    let input = $(`<input id="azmFileImage" type="file" style="position: fixed;z-index: -1;top: -9999px;" />`);
    let arr = `mousedown,mouseup,click,input,change,focus,blur,load`.split(',');
    arr.map(function (value, index, array) {
      input.on(value, function () {
        console.log(value);
        that[`on${value}`] && that[`on${value}`](this)
      })
    });
    if (isAndroid) {
      input.attr('accept', 'image/*');
      if (isWechat || window.mmtc_environment == 2) {
        input.attr('capture', 'camera')
      } else {
        input.removeAttr("capture");
      }
    } else {
      input.attr('accept', 'image/jpg,image/jpeg,image/png,image/gif');
      // input.attr('capture', 'camcorder');
      input.removeAttr("capture");
    }
    if (count > 1) {
      input.attr('multiple', 'multiple')
    }
    this.inputEl = input;

    return new Promise((resolve, reject) => {
      if (sourceType.indexOf('camera') > -1 && sourceType.length === 1) {
        input.attr('capture', 'camera')
      }
      //判断浏览器是否支持FileReader接口
      if (typeof FileReader === 'undefined') {
        alert('你的浏览器不支持FileReader接口！');
        //使选择控件不可操作
        input.setAttribute("disabled", "disabled");
        reject()
      } else {
        document.body.appendChild(input[0]);
        input.ready(function () {
          input.click();
          resolve(that, input);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onchange (_self) {
    let i = 0;
    this.inputElement = _self;
    for (let file of _self.files) {
      i++;
      if (this.ops.count < i) break;
      if (this.handleBeforeUpload(file)) {
        this.readerFile(file, i);
      } else if (this.ops.count === 1) {
        $(_self).remove();
      }
    }
  }

  // 检查照片格式、大小等信息
  handleBeforeUpload (file) {
    if (file) {
      console.log(file.size);
      console.log(file.type);
      console.log(file);
      const maxSize = this.ops.maxSize || IMAGE_MAX_SIZE;
      const sizeOk = file.size < (maxSize * MIN_SIZE);
      const typeOk = /^image\/(bmp|gif|jpg|jpeg|png)$/ig.test(file.type);
      if (!typeOk) {
        Vue.$muse.toast.error(`照片格式有误`)
        this.errStr.push({msg: `照片格式有误`, type: 'type', file});
      } else if (!sizeOk) {
        Vue.$muse.toast.error(`照片大小超过${maxSize}M`);
        this.errStr.push({msg: `照片大小超过${maxSize}M`, type: 'size', file});
      }
      return sizeOk && typeOk;
    }
  }

  // 读取文件
  readerFile (file, index) {
    let that = this;
    let flag = true;
    let reader = new FileReader(); //新建FileReader对象
    reader.readAsDataURL(file); //读取为base64
    //以下代码可以删除
    reader.onloadstart = function (e) {
      console.log('start', e);  //开始读取
      if (index === 1) {
        Vue.$vux.loading.show({
          text: '0%'
        });
        that.ops.start && that.ops.start(e);
      }
    };
    reader.onprogress = function (e) {
      //这个是定时触发的事件，文件较大的时候较明显
      let p = Math.round(e.loaded / e.total * 100);
      console.log('uploading', p);  //文件较大，就会出现多个uploading
      Vue.$vux.loading.show({
        text: `${p}%`
      });
      if (p === 100) {
        flag = true;
        Vue.$vux.loading.hide();
      }
      that.ops.progress && that.ops.progress(p / that.ops.count, e);
    };
    reader.onabort = function (e) {
      console.log('abort'); //用作取消上传功能
      that.ops.abort && that.ops.abort(reader);
    };
    reader.onerror = function (e) {
      console.log('error'); //文件读取出错的时候触发，暂模拟不出
      flag = false;
    };
    reader.onload = function (e) {
      const dataUrl = reader.result;
      console.log('load', dataUrl); //成功
      const url = URL.createObjectURL(file);
      if (flag) {
        that.list.push({dataUrl, file, url})
      }
      let len = that.inputElement.files.length;
      let fIndex = len > that.ops.count ? that.ops.count : len;
      if (fIndex <= index) {
        if (that.list.length > 0) {
          let list = that.ops.count > 1 ? that.list : that.list[0];
          that.ops.success && that.ops.success(list);
        } else {
          that.ops.fail && that.ops.fail(that.errStr);
        }
      }
    };
    //预览代码，没在onload里面写的原因是我不想
    reader.onloadend = function (e) {
      console.log('load complete'); //完成
      let len = that.inputElement.files.length;
      let fIndex = len > that.ops.count ? that.ops.count : len;
      if (fIndex <= index) {
        $(that.inputElement).remove();
        let list = that.ops.count > 1 ? that.list : that.list[0];
        that.ops.complete && that.ops.complete(list);
      }
    };
  }
}
