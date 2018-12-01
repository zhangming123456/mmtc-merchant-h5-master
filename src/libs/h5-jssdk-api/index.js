"use strict";
import ChooseImage from './chooseImage'
import EXIF from 'exif-js'
import Cropper from "cropperjs";
import Canvas2image from '../canvasDraw/canvasUtil'
import { md5, UUID } from '../util'

const DASE_64_IMAGE = /^data:image\/(bmp|gif|jpg|jpeg|png);base64,/ig

function imgCallback (src, file, autoUpload = false, formData) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = src;
    //通加载图片完毕保证快速读取
    image.onload = function () {
      FixImg(image, function (canvas) {
        try {
          canvas.toBlob(function (blob) {
            let url = URL.createObjectURL(blob);
            let name = `${md5(url)}.${blob.type.split('/')[1]}`;
            if (formData) {
              formData.append('_file_', blob, name);
              resolve({url, formData});
            } else {
              let formData = new FormData();
              formData.append('_file_', blob, name);
              resolve({url, formData});
            }
          })
        } catch (err) {
          let dataUrl = canvas.toDataURL(file.type, 1.0);
          resolve({url: dataUrl});
        }
      })
    };
    image.onerror = function () {
      reject();
    };
  })
}

// 参数列表：img 对象，callback返回Base64图片编码，生成图片质量默认值0.9
const FixImg = (img, callback, quality = 1) => {
  let Orientation, ctxWidth, ctxHeight, base64; // 定义所需变量
  EXIF.getData(img, function () {
    Orientation = EXIF.getTag(this, 'Orientation');
    ctxWidth = this.naturalWidth;
    ctxHeight = this.naturalHeight;

    console.log(Orientation, ctxWidth, ctxHeight);

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = ctxWidth;
    canvas.height = ctxHeight;
    if ([5, 6, 7, 8].includes(Orientation)) {
      canvas.width = ctxHeight;
      canvas.height = ctxWidth;
    }

    switch (Orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, ctxWidth, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, ctxWidth, ctxHeight);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, ctxHeight);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, ctxHeight, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, ctxHeight, ctxWidth);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, ctxWidth);
        break;
      default:
        ctx.transform(1, 0, 0, 1, 0, 0);
    }

    ctx.drawImage(img, 0, 0, ctxWidth, ctxHeight);
    callback(canvas);

    // // 默认输出jpeg,也可以读取原图片格式，最后输出原图格式，搜索关键词 ：File.type
    // base64 = canvas.toDataURL('image/jpeg', quality);
  });
};

const chooseImage = ({count = 1, crop = false, autoUpload = false, sourceType = ['album', 'camera'], success, fail, complete, maxSize} = {}) => {
  let chooseImage = new ChooseImage();
  let list = [];
  crop = count > 1 ? false : crop;
  return new Promise((resolve, reject) => {
    chooseImage.create({
      count, sourceType, maxSize, success (res) {
        if (crop && /^data:image\/(bmp|gif|jpg|jpeg|png);base64,/ig.test(res.dataUrl)) {
          resolve(res);
        } else if (!crop && count > 1 && res && res.length > 0) {
          let i = 0;
          let formData = null;
          if (autoUpload) {
            formData = new FormData();
          }
          for (let v of res) {
            i++;
            imgCallback(v.url, v.file, autoUpload, formData).finally(
              ({url, formData}) => {
                if (url && /^data:image\/(bmp|gif|jpg|jpeg|png);base64,/ig.test(url)) {
                  list.push({dataUrl: url, file: v.file, url: url});
                } else if (url && /^blob:https?:\/\//ig.test(url)) {
                  list.push({dataUrl: url, file: v.file, url: url});
                }
                if (i === res.length) {
                  if (list.length > 0) {
                    resolve(list, formData);
                  } else {
                    reject()
                  }
                }
              }
            )
          }
        } else if (!crop && res && res.dataUrl) {
          imgCallback(res.url, res.file, autoUpload).then(
            ({url, formData}) => {
              if (url && url.length > 0 && /^data:image\/(bmp|gif|jpg|jpeg|png);base64,/ig.test(url)) {
                resolve({dataUrl: url, file: res.file, url: url, formData});
              } else if (url && /^blob:https?:\/\//ig.test(url)) {
                resolve({dataUrl: url, file: res.file, url: url, formData});
              } else {
                reject()
              }
            },
            reject
          )
        } else {
          reject({msg: '图片格式不正确'})
        }
      },
      fail (res) {
        reject()
      }
    })
  }).catch(err => {
    console.log(err, 'chooseImage');
  })
};


export default {
  FixImg,
  chooseImage
}
export {
  Canvas2image
}
