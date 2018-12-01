<template>
  <div class="azm-poster-canvas maxWidth500 azm-fixed-top">
    <div class="azm-scroll">
      <div class="azm-scroll-box" :style="{height:`${posterHeight}px`}">
        <vue-scroll ref="scroll" :ops="options" @handle-resize="handleResize" @handle-scroll="handleScroll">
          <mu-paper :zDepth="20" id="posterCanvasContainer" :style="{height: `${posterHeight}px`}"></mu-paper>
        </vue-scroll>
      </div>
    </div>
    <div style=" height: 45px;background-color: red;">
    </div>
  </div>
</template>

<script>
  import Hammer from 'hammerjs'
  import { Paper } from 'muse-ui'
  import { mapState } from 'vuex'
  import canvasDraw from '../../libs/canvasDraw'
  import config from '../../libs/config'
  import Deploy2style from '../../libs/deploy2style';

  const PROXY_URL = `${config.host}/nodeapi/proxy_image?url=`
  const {Scene, Sprite, Path, Label, Group} = require('spritejs');

  export default {
    components: {
      [Paper.name]: Paper
    },
    data () {
      return {
        message: '',
        isHH: false,
        options: {
          vuescroll: {
            mode: 'slide',
            scroller: {
              bouncing: true,
              locking: true
            },
            zooming: false
          },
          scrollPanel: {
            scrollingY: true,
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
        model: {
          "image": "http://app.mmtcapp.com/static/upload/image/20181123/20181123154855_46115.png",
          "w": 750,
          "h": 1200,
          "background": "http://app.mmtcapp.com/static/upload/image/20181123/20181123154850_64348.png"
        },
        configList: [
          {
            "id": "480",
            "type": "2",
            "content": "https://app.mmtcapp.com/nodeapi/qrcode/shop_home?id=8662",
            "image": "/static/upload/image/20181112/20181112114537_46337.jpg",
            "status": "1",
            "vertical_align": "center",
            "basic": {
              "x": "309px",
              "y": "1015px",
              "w": "133px",
              "h": "133px",
              "z_index": "1",
              "color": "",
              "font_size": "",
              "line_height": "",
              "text_align": "center"
            },
            "tip": "替换此店铺二维码?",
            "tip2": "用户扫码即可进入您的店铺小程序"
          },
          {
            "id": "481",
            "type": "0",
            "content": "今天的你是什么颜色的？",
            "image": "",
            "status": "1",
            "vertical_align": "center",
            "basic": {
              "x": "76px",
              "y": "125px",
              "w": "599px",
              "h": "57px",
              "z_index": "1",
              "color": "#e6dd90",
              "font_size": "60px",
              "line_height": "39px",
              "text_align": "left"
            }
          },
          {
            "id": "482",
            "type": "0",
            "content": "五彩美甲，缤纷呈现",
            "image": "",
            "status": "1",
            "vertical_align": "center",
            "basic": {
              "x": "207px",
              "y": "207px",
              "w": "336px",
              "h": "34px",
              "z_index": "1",
              "color": "#e6dd90",
              "font_size": "37px",
              "line_height": "39px",
              "text_align": "left"
            }
          }
        ],
        placeholderPic: 1,
        posterWidth: 300,
        posterHeight: 456,
        scrollBoxHeight: 667,
        scale: 1,
        isLocking: true,
        draggableGroup: null
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", 'isMerchantH5'],
    beforeCreate () {

    },
    created () {
      let $ = this.util.Zepto;
      let that = this;
      this.$nextTick(async function () {
        let scale = that.scale;
        let model = that.model;
        let dom = $(that.$el);
        let canvas = dom.find('#posterCanvasContainer');
        let scrollBox = dom.find('.azm-scroll');

        that.posterWidth = canvas.width();
        that.posterHeight = model.h / model.w * that.posterWidth + 1;
        that.scrollBoxHeight = scrollBox.height();
        // let url = PROXY_URL + encodeURIComponent(model.background);
        let url = '/src/assets/proxy_image3.png';
        const scene = await new Scene('#posterCanvasContainer', {
          resolution: [model.w * scale, model.h * scale],
          viewport: [that.posterWidth, that.posterHeight],
          maxDisplayRatio: 1,
          useDocumentCSS: true,
          displayRatio: `${window.devicePixelRatio * 10}vw`,
        });
        const layer = await scene.layer('poster', {handleEvent: true, stickExtend: true});
        await scene.preload({id: 'model', src: url});
        const modelImage = new Sprite('model');
        modelImage.attr({
          id: 'model',
          anchor: 0.5,
          translate: [model.w / 2, model.h / 2],
          pos: [0, 0],
          scale: scale,
          rotate: 0,
          zIndex: 0
        });
        let configList = that.configList;
        let arr = [];

        for (let v of configList) {
          arr.push(that.drawGroup(v, layer));
        }

        // 路径案例start
        const p1 = new Path();
        p1.attr({
          path: {
            d: 'M3.70 2.47L3.70-10.18Q2.86-9.14 1.49-7.68L1.49-7.68L0.74-10.10Q4.51-14.30 6.26-19.82L6.26-19.82L8.40-18.82Q7.42-15.86 5.98-13.46L5.98-13.46L5.98 2.47L3.70 2.47ZM17.83-9.46L19.85-10.13Q21.60-5.83 22.85-1.13L22.85-1.13L20.86-0.22Q19.49-5.40 17.83-9.46L17.83-9.46ZM19.90-14.74L11.38-14.74Q10.32-12.14 8.86-9.86L8.86-9.86L6.89-11.09Q9.60-15.10 10.70-19.68L10.70-19.68L12.84-19.22Q12.46-17.78 12.17-16.94L12.17-16.94L22.25-16.94L22.25-15.46Q21.62-13.13 20.83-11.14L20.83-11.14L18.65-11.76Q19.42-13.13 19.90-14.74L19.90-14.74ZM14.14 2.30L11.06 2.30L10.56 0.14Q12.29 0.31 13.37 0.31L13.37 0.31Q14.23 0.31 14.23-0.62L14.23-0.62L14.23-12.98L16.44-12.98L16.44-0.05Q16.44 2.30 14.14 2.30L14.14 2.30ZM10.32-9.89L12.36-9.31Q11.11-4.34 9.10-0.62L9.10-0.62L6.96-1.39Q8.88-4.78 10.32-9.89L10.32-9.89Z',
            // transform: {scale: 100},
            trim: true,
          },
          fillColor: '#000000',
          // lineWidth: 24,
          pos: [100, 50],
          scale: scale,
          zIndex: 1
        });
        layer.append(p1);
        // 路径案例end

        // 元素组
        let groups = arr.map(function (v, i) {
          return that.draggable(v, 1, configList[i], layer)
        });

        // 拖拽，放大等事件盒子
        const draggableGroup = that.drawDraggableGroup(layer);

        layer.append(modelImage).append(...groups).append(draggableGroup);


        // const app = document.querySelector('#posterCanvasContainer');
        // const hammertime = new Hammer(app, {});

        layer.on('touchmove', (evt) => {
          // if (evt.targetSprites.some(target => target.isDraggable)) {
          //   scene.container.style.cursor = 'move'
          // } else {
          //   scene.container.style.cursor = 'default'
          // }
        });

        layer.on('touchstart', function (e) {
          let target = e.target;
          that.posterHeight = model.h / model.w * that.posterWidth;
          console.log(target, 123456789);
          if (that.posterHeight < scrollBox.height()) {
            that.options.scrollPanel.scrollingY = false;
          } else {
            that.options.scrollPanel.scrollingY = true;
          }
          if (target.id === 'model') {

          }
        })
      })
    },
    methods: {
      handleResize (val) {
        console.log(val, 9090);
        let $ = this.util.Zepto;
        this.posterWidth = $('#posterCanvasContainer').width();
      },
      handleScroll () {

      },
      drawDraggableGroup (layer) {
        let that = this;
        let width = 500
        let height = 500
        let padding = 20
        let gWidth = width + padding;
        let gHeight = height + padding;
        let x = gWidth / 2;
        let y = gHeight / 2;

        const group = new Group();
        group.attr({
          id: 0,
          name: 'DraggableGroup',
          anchor: 0.5,
          translate: [x, y],
          pos: [100, 200],
          width: gWidth,
          height: gHeight,
          bgcolor: 'rgba(0,0,0,.3)',
          boxSizing: 'content-box',
        });

        const box = new Sprite();
        box.attr({
          id: 1,
          name: 'Draggable',
          anchor: 0.5,
          translate: [x, y],
          pos: [0, 0],
          size: [width, height],
          border: {
            width: 2,
            color: '#fff'
          },
          shadow: {
            blur: 20,
            color: '#333333',
            offset: [2, 2],
          },
          borderRadius: 4,
          zIndex: 1,
          rotate: 0
        });

        let boxW = box.outerSize[0];
        let boxH = box.outerSize[1];

        let lrWidth = 6;
        let lrHeight = boxH / 3;
        // 创建盒子左移动块
        const LeftBox = new Sprite();
        // height / 2 - lrHeight
        LeftBox.attr({
          id: 2,
          name: 'Draggable',
          anchor: 0.5,
          translate: [x, y],
          bgcolor: '#fff',
          zIndex: 2,
          pos: [-boxW / 2 + lrWidth / 2, 0],
          size: [lrWidth, lrHeight],
          shadow: {
            blur: 20,
            color: '#333333',
            offset: [2, 2],
          },
          borderRadius: lrWidth
        });

        // 创建盒子右移动块
        const RightBox = LeftBox.cloneNode();
        // height / 2 - lrHeight
        RightBox.attr({
          id: 3,
          pos: [boxW / 2 - lrWidth / 2, 0],
        });


        let circleWidth = 14
        let offset = 3
        let circleX = -boxW / 2 + circleWidth / 2 - offset;
        let circleX2 = boxW / 2 - circleWidth / 2 + offset;
        let circleY = -boxH / 2 + circleWidth / 2 - offset;
        let circleY2 = boxH / 2 - circleWidth / 2 + offset;
        // 创建盒子左上角落移动块
        const ltCircle = new Sprite();
        // height / 2 - lrHeight

        let lrData = {
          id: 4,
          name: 'Draggable',
          anchor: 0.5,
          translate: [x, y],
          bgcolor: '#fff',
          zIndex: 2,
          pos: [circleX, circleY],
          width: circleWidth,
          height: circleWidth,
          shadow: {
            blur: 20,
            color: '#333333',
            offset: [2, 2],
          },
          borderRadius: circleWidth
        }

        console.log(lrData, 890799);
        ltCircle.attr(lrData);

        // 创建盒子右移动块
        const rtCircle = ltCircle.cloneNode();
        rtCircle.attr({
          id: 5,
          pos: [circleX2, circleY],
        });

        // 创建盒子右移动块
        const rbCircle = ltCircle.cloneNode();
        rbCircle.attr({
          id: 6,
          pos: [circleX2, circleY2],
        });

        // 创建盒子右移动块
        const lbCircle = ltCircle.cloneNode();
        lbCircle.attr({
          id: 7,
          pos: [circleX, circleY2],
        });


        group.append(box, LeftBox, RightBox, ltCircle, rtCircle, rbCircle, lbCircle);
        return group;
      },
      drawGroup (item) {
        let that = this;
        let style = {...Deploy2style.basisFilter(item.basic), ...Deploy2style.basisFilter(item.customize)};
        for (let k in style) {
          let val = style[k]
          if (Deploy2style.isPixel(val) || /^-?\d{0,}.?\d+$/ig.test(val)) {
            style[k] = parseFloat(val);
          }
        }
        item.style = style;
        let content = item.content;
        let zIndex = item.style.zIndex;
        console.log(item.style, item.type, content);
        let id = that.util.UUID.v1();
        const group = new Group();
        item.gid = id;
        group.attr({
          id,
          // display: 'flex',
          // alignItems: 'flex-start',
          // justifyContent: 'space-around',
          // flexWrap: 'wrap',
          // size: [300, 500],
          border: {width: 2, style: 'solid', color: 'red'},
          width: style.w,
          anchor: 0.5,
          translate: [style.width / 2, style.height / 2],
          pos: [style.x, style.y],
          zIndex: style.zIndex || 1,
          wordBreak: 'normal',
          lineBreak: 'normal',
          rotate: style.rotate || 0,
          borderRadius: style.borderRadius || 0,
          lineHeight: style.lineHeight || 1.2,
        });
        if ([0, 3].indexOf(+item.type) > -1) {
          // let contents = content.split('');
          // let labels = contents.map(function (v, i) {
          //   return that.drawText(style, v)
          // });
          group.append(that.drawText(style, content));
        } else if (+item.type === 1) {
          // group.append(that.drawImage(style, content));
        }
        return group;
      },
      drawText (style, content) {
        let that = this;
        const label = new Label();
        let id = that.util.UUID.v1();
        label.attr({
          id,
          text: content,
          // anchor: 0.5,
          // translate: [style.width / 2, style.height / 2],
          // pos: [style.x, style.y],
          // size: [style.width, style.height],

          opacity: style.opacity > -1 ? style.opacity / 100 : 1,
          textAlign: style.textAlign || 'left',
          letterSpacing: style.letterSpacing || 1,
          font: `${style.fontWeight || '400'} ${style.fontSize || 12}px ${style.fontFamily || 'Roboto'}`,
          fillColor: style.color || '',
          // border: {
          //   style: [10, 20],
          //   width: 1,
          //   color: '#37c',
          // },

        });
        return label;
      },
      drawImage (item) {

      },
      draggable (group, zIndex = 1, item) {
        let that = this;
        let $ = that.util.Zepto;
        let dom = $(that.$el);
        if (group.isDraggable) return;
        group.isDraggable = true;
        let x0, y0, startPos;

        function onMouseMove (e) {
          const dx = e.x - x0, dy = e.y - y0;
          group.attr('pos', [startPos[0] + dx, startPos[1] + dy]);
          e.stopDispatch();
        }

        let border = null;

        group.on('touchstart', (e) => {
          console.log(e, '结束');
          // border = group.attr('border');
          // group.attr('border', {width: 1, color: 'blue'});
        });
        group.on('touchend', (e) => {
          console.log(e, '鼠标离开');
          // group.attr('border', border);
        });

        group.on('touchstart', (e) => {
          that.options.vuescroll.scroller.locking = false;
          console.log(e, 'touchstart');
          x0 = e.x;
          y0 = e.y;
          startPos = group.attr('pos');
          console.log(startPos);
          if (group.id !== 'model') {
            group.attr('zIndex', zIndex++);
          }
          group.off('touchmove', onMouseMove);
          group.setMouseCapture();
          group.on('touchmove', onMouseMove);
          e.stopDispatch();
        }).on('touchend', e => {
          if (item.style) {
            const pos = group.attr('pos');
            item.style.x = pos[0];
            item.style.y = pos[1];
          }
          that.options.vuescroll.scroller.locking = true;
          console.log(e, 'touchend');
          group.off('touchmove', onMouseMove);
          group.releaseMouseCapture();
        })
        // group.on('mousedown', (evt) => {
        //   console.log(evt, '鼠标按下');
        //   x0 = evt.x;
        //   y0 = evt.y;
        //   startPos = group.attr('pos');
        //   group.attr('zIndex', zIndex++);
        //   group.off('mousemove', onMouseMove);
        //   group.setMouseCapture();
        //   group.on('mousemove', onMouseMove);
        //   evt.stopDispatch();
        // }).on('mouseup', (evt) => {
        //   console.log(evt, '鼠标松开');
        //   group.off('mousemove', onMouseMove);
        //   group.releaseMouseCapture();
        // });
        return group;
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-poster-canvas {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    .azm-scroll {
      position: relative;
      flex: 1;
      .azm-scroll-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-height: 90%;
        width: 100%;
      }
    }
    #posterCanvasContainer, .posterCanvasContainer {
      width: 80%;
      margin: 0 auto;
      background-color: transparent;
    }
    /*.posterCanvasContainer {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*z-index: 100;*/
    /*background-color: rgba(0, 0, 0, .3);*/
    /*}*/
  }
</style>
<style lang="less">
  .azm-poster-canvas {
    /*.__vuescroll {*/
    /*.__panel.__slide {*/
    /*padding: 10px 0;*/
    /*}*/
    /*}*/
  }
</style>
