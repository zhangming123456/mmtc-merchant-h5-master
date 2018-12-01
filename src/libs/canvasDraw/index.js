import html2canvas from 'html2canvas'
import Canvas2Image from "./canvasUtil";
import config from '../config'
import { $ as Zepto } from '../util';

const DOM_WIDTH = 100
const DOM_HEIGHT = 100
const RADIUS = 100
const MARGIN_WIDTH = 100
const MARGIN_HEIGHT = 100
const SHADOW_X = 100
const SHADOW_Y = 100
const SHADOW_BLUR = 100
const SHADOW_COLOR = 100


class Html2canvas {
  constructor () {
    for (let k in Canvas2Image) {
      this[k] = Canvas2Image[k];
    }
  }

  /**
   * 圆角矩形
   * @param origCanvas
   * @param scale
   * @param DOM_WIDTH
   * @param DOM_HEIGHT
   * @param RADIUS
   * @returns {HTMLCanvasElement}
   */
  drawRound (origCanvas, scale) {
    const roundCanvas = document.createElement('canvas');
    roundCanvas.width = DOM_WIDTH * scale;
    roundCanvas.height = DOM_HEIGHT * scale;

    const roundCtx = roundCanvas.getContext('2d');
    const roundRadius = RADIUS * scale;

    // 在 canvas 上画出圆角矩形
    const x1 = roundRadius;
    const y1 = 0;
    const x2 = x1 + roundCanvas.width - 2 * roundRadius;
    const y2 = y1;
    const x3 = x2 + roundRadius;
    const y3 = roundRadius;
    const x4 = x3;
    const y4 = y3 + roundCanvas.height - 2 * roundRadius;
    const x5 = x2;
    const y5 = y4 + roundRadius;
    const x6 = x1;
    const y6 = y5;
    const x7 = x6 - roundRadius;
    const y7 = y4;
    const x8 = x7;
    const y8 = y3;
    roundCtx.beginPath();
    roundCtx.moveTo(x1, y1);
    roundCtx.lineTo(x2, y2);
    roundCtx.quadraticCurveTo(x3, y2, x3, y3);
    roundCtx.lineTo(x4, y4);
    roundCtx.quadraticCurveTo(x4, y5, x5, y5);
    roundCtx.lineTo(x6, y6);
    roundCtx.quadraticCurveTo(x7, y6, x7, y7);
    roundCtx.lineTo(x8, y8);
    roundCtx.quadraticCurveTo(x8, y1, x1, y1);

    // 将图片「贴」进 clipping 区域，得到一个圆角矩形的图片
    roundCtx.clip();
    roundCtx.drawImage(origCanvas, 0, 0);

    return roundCanvas;
  }

  /**
   * 阴影
   * @param origCanvas
   * @returns {HTMLCanvasElement}
   */
  drawShadow (origCanvas) {
    const bgdCanvas = document.createElement('canvas');
    bgdCanvas.width = origCanvas.width + MARGIN_WIDTH;
    bgdCanvas.height = origCanvas.height + MARGIN_HEIGHT;
    const ctx = bgdCanvas.getContext('2d');

    ctx.shadowOffsetX = SHADOW_X;
    ctx.shadowOffsetY = SHADOW_Y;
    ctx.shadowBlur = SHADOW_BLUR;
    ctx.shadowColor = SHADOW_COLOR;
    ctx.drawImage(origCanvas, MARGIN_WIDTH / 2, 0);

    return bgdCanvas;
  }

  /**
   * 根据window.devicePixelRatio获取像素比
   */
  DPR () {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
    return 1;
  }

  /**
   * @param async //是否异步解析和呈现元素
   * @param allowTaint //现有的canvas元素，用作绘图的基础
   * @param backgroundColor //现有的canvas元素，用作绘图的基础
   * @param canvas //现有的canvas元素，用作绘图的基础
   * @param foreignObjectRendering //是否在浏览器支持的情况下使用ForeignObject渲染
   * @param imageTimeout //加载图像的超时（以毫秒为单位）。设置为0以禁用超时。
   * @param ignoreElements //谓词函数，用于从渲染中删除匹配元素。
   * @param logging //日志开关，便于查看html2canvas的内部执行流程
   * @param onclone //在克隆文档进行渲染时调用的回调函数可用于修改将在不影响原始源文档的情况下呈现的内容。
   * @param removeContainer //是否要清理克隆的DOM元素html2canvas会暂时创建
   * @param scale // 参数用于渲染的比例。默认为浏览器设备像素比率。
   * @param width //dom 原始宽度
   * @param height
   * @param useCORS // 【重要】开启跨域配置,是否尝试使用CORS从服务器加载图像
   * @param proxy //代理地址
   */
  /**
   * 绘制海报
   * @param selector
   * @param scale
   * @param onmodify
   * @param type
   * @param options
   * @returns {Promise<any>}
   */
  async drawPoster (selector, width, scale = 2, onmodify, type = 'png', options = {logging: true, useCORS: true, proxy: `${config.host}/shopapi/Poster/getImg`}) {
    let that = this;
    scale *= this.DPR();
    let dom = $(selector);
    let canvas = document.createElement("canvas");
    let height = dom.height();
    if (width) {
      height = dom.height() * (width * dom.width());
    } else {
      width = dom.width();
      height = dom.height();
    }
    let x = dom.offset().left;
    let y = dom.offset().top;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    let opts = {
      ...options,
      scale: scale,
      canvas: canvas,
      width: width,
      height: height,
    };

    return new Promise((resolve, reject) => {
      html2canvas(dom[0], opts).then(
        async canvas => {
          let context = canvas.getContext('2d');
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;

          if (onmodify) {
            await onmodify(context);
          }

          // 【重要】默认转化的格式为png,也可设置为其他格式
          if (type === 'png') {
            await resolve(that.convertToPNG(canvas, canvas.width, canvas.height), canvas);
          } else if (type === 'gif') {
            await resolve(that.convertToGIF(canvas, canvas.width, canvas.height), canvas);
          } else if (type === 'bmp') {
            await resolve(that.convertToBMP(canvas, canvas.width, canvas.height), canvas);
          }
        },
        reject
      );
    })
  }
}


export default new Html2canvas();
export const canvasDraw = new Html2canvas();
