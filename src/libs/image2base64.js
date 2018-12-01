import Vue from 'vue'
import config from './config'
import Cropper from 'cropperjs'
import { absUrl } from './util'

class Images2base64 {
  getContentTxt (url, {crop = false, isUrl = false} = {}) {
    let that = this;
    if (!/\/nodeapi\/proxy_image\?url=/ig.test(url)) {
      url = absUrl(url);
      let flag = true;
      if (config.NODE_ENV === 'production') {
        flag = !/^https:\/\/app.mmtcapp.com/ig.test(url);
      }
      if (/^https?/ig.test(url) && flag) {
        url = `${config.host}/shopapi/Poster/getImg?url=${encodeURIComponent(url)}`
      }
    }
    console.log(isUrl, url);
    if (isUrl) {
      return url
    } else {
      return new Promise(function (resolve, reject) {
        //新建图片
        let image = new Image();
        image.src = url;
        //解决canvas无法读取画布问题
        image.setAttribute('crossOrigin', 'anonymous');
        // document.body.appendChild(image);
        if (crop) {
          document.getElementById('crop-image').appendChild(image);
        }
        //通加载图片完毕保证快速读取
        image.onload = (res) => {
          if (crop) {
            const cropper = new Cropper(image, {
              ...configCropper,
              aspectRatio: 16 / 7,
              crop (event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
              },
            });
            resolve()
          } else {
            let base64 = that.getBase64Image(image);
            resolve(base64)
          }
        }
        image.onerror = (res) => {
          reject()
        }
      })
    }
  }

  getBase64Image (img) {
    let canvas = document.createElement("canvas");
    let dataURL = null;
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    if (/.?(jpg|jpeg)$/ig.test(ext)) {
      dataURL = Vue.Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);
    } else if (/.?gif$/ig.test(ext)) {
      dataURL = Vue.Canvas2Image.convertToGIF(canvas, canvas.width, canvas.height);
    } else if (/.?png$/ig.test(ext)) {
      dataURL = Vue.Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height);
    } else {
      dataURL = Vue.Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);
    }
    return dataURL.src
  }
}

export default new Images2base64()
