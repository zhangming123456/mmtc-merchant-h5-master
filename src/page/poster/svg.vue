<template>
  <div class="azm-poster-canvas maxWidth500 azm-fixed-top" @mousewheel="handleMousewheel">
    <div class="azm-scroll">
      <mu-paper :zDepth="20" id="posterCanvasContainer"
                :style="{height: `${posterHeight}px`,width:`${scaleWidth}%`}">
        <!--xmlns:svgjs="http://svgjs.com/svgjs"-->
        <svg id="posterSvg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
             xmlns:svgjs="http://svgjs.com/svgjs"
             version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" :viewBox="`0 0 ${model.w} ${model.h}`"></svg>
      </mu-paper>
    </div>
    <!--<div class="azm-scroll">-->
    <!--<div class="azm-scroll-box" :style="{height:`${posterHeight>maxPosterHeight?maxPosterHeight:posterHeight}px`}">-->
    <!--<vue-scroll ref="scroll" :ops="options" @handle-scroll="handleScroll">-->
    <!---->
    <!--</vue-scroll>-->
    <!--</div>-->
    <!--</div>-->
    <footer>
      <van-stepper class="azm-stepper clearfix" v-model="scale" integer :min="10" :max="100" :step="2"></van-stepper>
    </footer>
  </div>
</template>

<script>
  // import { QRCode } from '../../tools/qrcode/qrcode.min'
  //
  // debugger
  import device from '../../libs/device'
  import { Stepper } from 'vant'
  import Hammer from 'hammerjs'
  import { Paper } from 'muse-ui'
  import { mapState } from 'vuex'
  import canvasDraw from '../../libs/canvasDraw'
  import config from '../../libs/config'
  import Deploy2style from '../../libs/deploy2style'

  import io from 'socket.io-client'

  const PROXY_URL = `${config.host}/nodeapi/proxy_image?url=`
  import Snap from 'snapsvg'

  import SVG from 'svg.js'

  const TEXT_SCALE = 0.89

  let ScaleTimer = null
  let ScrollTimer = null

  let defaultScale = 90
  let defaultHeightStatus = true
  export default {
    components: {
      [Paper.name]: Paper,
      [Stepper.name]: Stepper,
    },
    data () {
      return {
        socket: null,
        socketStatus: false,
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
            background: 'rgb(3, 185, 118)',
            showDelay: 500
          },
          rail: {
            keepShow: false,
            opacity: 0,
            background: '#01a99a',
          }
        },
        model: {
          'image': 'http://app.mmtcapp.com/static/upload/image/20181101/20181101142548_13480.png',
          'title': '美容',
          'w': 750,
          'h': 1200,
          'background': 'http://app.mmtcapp.com/static/upload/image/20181101/20181101142553_64410.png'
        },
        configList: [
          {
            'id': '1418',
            'type': '0',
            'content': 'A delicate woman, at least, knows how to please herself',
            'image': '',
            'status': '1',
            'vertical_align': 'center',
            'basic': {
              'x': '0px',
              'y': '1011px',
              'w': '750px',
              'h': '18px',
              'z_index': '1',
              'color': '#ffffff',
              'font_size': '17px',
              'line_height': '40px',
              'text_align': 'center'
            },
            'customize': {
              'rotate': '0',
              'opacity': '1',
              'text-decoration': '',
              'font-weight': '',
              'font-style': '',
              'letter-spacing': '1px'
            }
          },
          {
            'id': '1415',
            'type': '3',
            'content': '美丽是一种充满\n活力的艺术',
            'image': '',
            'status': '1',
            'vertical_align': 'middle',
            'basic': {
              'x': '134px',
              'y': '132px',
              'w': '300px',
              'h': '100px',
              'z_index': '1',
              'color': '#ffffff',
              'font_size': '31px',
              'line_height': '40px',
              'text_align': 'left'
            },
            'customize': {
              'rotate': '0',
              'opacity': '1',
              'text-decoration': '',
              'font-weight': '',
              'font-style': '',
              'letter-spacing': '1px'
            }
          },
          {
            'id': '1416',
            'type': '0',
            'content': '2018',
            'image': '',
            'status': '1',
            'vertical_align': 'center',
            'basic': {
              'x': '580px',
              'y': '187px',
              'w': '67px',
              'h': '21px',
              'z_index': '1',
              'color': '#ffffff',
              'font_size': '25px',
              'line_height': '40px',
              'text_align': 'left'
            }
          },
          {
            'id': '1417',
            'type': '0',
            'content': '一个精致的女人，最起码懂得取悦自己',
            'image': '',
            'status': '1',
            'vertical_align': 'center',
            'basic': {
              'x': '0px',
              'y': '977px',
              'w': '750px',
              'h': '28px',
              'z_index': '1',
              'color': '#ffffff',
              'font_size': '29px',
              'line_height': '40px',
              'text_align': 'center'
            },
            'customize': {
              'rotate': '0',
              'opacity': '1',
              'text-decoration': '',
              'font-weight': '',
              'font-style': '',
              'letter-spacing': '2px'
            }
          },
          {
            'id': '1414',
            'type': '1',
            'content': 'http://app.mmtcapp.com/static/upload/image/20181101/20181101142740_99230.jpg',
            'image': 'http://app.mmtcapp.com/static/upload/image/20181101/20181101142740_99230.jpg',
            'status': '1',
            'vertical_align': '',
            'basic': {
              'x': '120px',
              'y': '251px',
              'w': '510px',
              'h': '690px',
              'z_index': '1',
              'color': '',
              'font_size': '',
              'line_height': '',
              'text_align': 'center'
            },
            'customize': {
              'rotate': '0',
              'opacity': '1',
              'background-color': '',
              'border-width': '1px',
              'border-color': '',
              'border-style': '',
              'border-radius': '0px'
            }
          },
          {
            'id': '1413',
            'type': '2',
            'content': 'https://app.mmtcapp.com/nodeapi/qrcode/shop_home?id=8662',
            'image': 'http://app.mmtcapp.com/static/upload/image/20181101/20181101142701_80521.jpg',
            'status': '1',
            'vertical_align': '',
            'basic': {
              'x': '317px',
              'y': '1059px',
              'w': '116px',
              'h': '116px',
              'z_index': '1',
              'color': '',
              'font_size': '',
              'line_height': '',
              'text_align': 'center'
            },
            'customize': {
              'rotate': '0',
              'opacity': '1',
              'background-color': '',
              'border-width': '1px',
              'border-color': '',
              'border-style': '',
              'border-radius': '0px'
            },
            'tip': '替换此店铺二维码?',
            'tip2': '用户扫码即可进入您的店铺小程序'
          }
        ],
        placeholderPic: 1,
        posterWidth: 300,
        scaleWidth: this.scale,
        posterHeight: 456,
        maxPosterHeight: 667,
        scrollBoxHeight: 667,
        scale: defaultScale,
        isLocking: true,
        draggableGroup: null,
        keyboard: {
          height: 312,
          status: 0
        }
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ['appRefresh', 'isMerchantH5'],
    beforeCreate () {
      this.socket && this.socket.close()
    },
    created () {
      let $ = this.util.Zepto
      let that = this
      let socket = that.socket = io(`${config.host}/nodeapi/wsFonts`)

      // 加入房间
      socket.on('connect', function () {
        that.$toast.message('socket连接成功')
        that.SVG_JS()
      })

      if (device.mobile()) {
        $(document).focusin(function () {
          let keyboard = that.keyboard
          //软键盘弹出的事件处理
          // alert('软键盘弹出的事件处理')
          that.keyboard.status > 0 && $(window).scrollTop(that.keyboard.top || 0)
          $(document).on('scroll', function () {
            if (that.keyboard.status > 0) {
              $(window).scrollTop(that.keyboard.top || 0)
            } else {
              clearTimeout(ScrollTimer)
              ScrollTimer = setTimeout(function () {
                if (keyboard.status === 0) {
                  that.keyboard.height = $(this).scrollTop()
                }
                that.keyboard.status++
                $(window).scrollTop(that.keyboard.top || 0)
                document.title = `高度：${that.keyboard.height},次数：${that.keyboard.status}`
              }, 300)
            }
          })
        })
        $(document).focusout(function () {
          //软键盘收起的事件处理
          alert('软键盘收起的事件处理')
        })
      }
      this.$nextTick(async function () {
        // that.SnapSvg()
        // const hammer = new Hammer.Manager(document.getElementById('posterCanvasContainer'));
        // hammer.add(new Hammer.Tap({event: 'doubletap', taps: 2}));
        // hammer.add(new Hammer.Tap({event: 'singletap'}));
        // hammer.get('doubletap').recognizeWith('singletap');
        // hammer.get('singletap').requireFailure('doubletap');
        // hammer.on('doubletap', function (e) {
        //   console.log(that.scale, e.type);
        //   if (that.scale === defaultScale / 2) {
        //     that.scale = defaultScale;
        //   } else if (that.scale === 80) {
        //     that.scale = defaultScale / 2;
        //   } else {
        //     that.scale = 80
        //   }
        // }).on('singletap', function (ev) {
        //   console.log(ev.type);
        // });
      })
      $(window).resize(function () {
        that.handleResize(true)
        if (!that.$device.isAndroid) {
          window.setTimeout(function () {
            window.scrollTo(0, document.body.clientHeight)
          }, 500)
        }
      })
    },
    destroyed () {
      this.socket && this.socket.close()
    },
    watch: {
      scale (n, o) {
        let that = this
        that.handleResize()
      }
    },
    methods: {
      async SVG_JS () {
        let that = this
        let $ = that.util.Zepto
        if (!SVG.supported) {
          alert('当前浏览器SVG不受支持，请更换浏览器使用！！！')
          return
        }
        let scale = that.scale
        let model = that.model
        let dom = $(that.$el)
        let canvas = dom.find('#posterCanvasContainer')
        let scrollBox = dom.find('.azm-scroll')
        await that.handleResize(true)
        that.scrollBoxHeight = scrollBox.height()
        let draw = SVG('posterSvg')
        let group = draw.group().addClass('svgPosterGroup')
        if (model.background) {
          group.add(await that.drawModelImage(draw))
        }
        let configList = that.configList

        function compare (property) {
          return function (a, b) {
            let value1 = 0
            let value2 = 0
            try {
              value1 = eval('a.' + property)
              value2 = eval('b.' + property)
            } catch (err) {
              console.log(err, a, b)
            }
            return value1 - value2
          }
        }

        // 元素排序
        configList.sort(compare('basic.z_index'))
        let arr = []
        for (let v of configList) {
          setTimeout(function () {
            if ('0, 3'.indexOf(v.type) > -1) {
              let textGroup = that.drawSvgText(draw, v)
              // group.add(itemGroup);
              group.add(textGroup)
              arr.push(textGroup)
            } else if ('1,2'.indexOf(v.type) > -1) {
              let imageGroup = that.drawSvgImage(draw, v)
              group.add(imageGroup)
              arr.push(imageGroup)
            } else {

            }
          })
        }
      },
      SnapSvg () {
        let that = this
        let $ = that.util.Zepto
        let scale = that.scale
        let model = that.model
        let dom = $(that.$el)
        let canvas = dom.find('#posterCanvasContainer')
        let scrollBox = dom.find('.azm-scroll')
        that.posterWidth = canvas.width()
        that.posterHeight = model.h / model.w * that.posterWidth + 1
        that.scrollBoxHeight = scrollBox.height()
        // let url = PROXY_URL + encodeURIComponent(model.background);
        let url = '/src/assets/proxy_image3.png'
        let txt = 'M3.70 2.47L3.70-10.18Q2.86-9.14 1.49-7.68L1.49-7.68L0.74-10.10Q4.51-14.30 6.26-19.82L6.26-19.82L8.40-18.82Q7.42-15.86 5.98-13.46L5.98-13.46L5.98 2.47L3.70 2.47ZM17.83-9.46L19.85-10.13Q21.60-5.83 22.85-1.13L22.85-1.13L20.86-0.22Q19.49-5.40 17.83-9.46L17.83-9.46ZM19.90-14.74L11.38-14.74Q10.32-12.14 8.86-9.86L8.86-9.86L6.89-11.09Q9.60-15.10 10.70-19.68L10.70-19.68L12.84-19.22Q12.46-17.78 12.17-16.94L12.17-16.94L22.25-16.94L22.25-15.46Q21.62-13.13 20.83-11.14L20.83-11.14L18.65-11.76Q19.42-13.13 19.90-14.74L19.90-14.74ZM14.14 2.30L11.06 2.30L10.56 0.14Q12.29 0.31 13.37 0.31L13.37 0.31Q14.23 0.31 14.23-0.62L14.23-0.62L14.23-12.98L16.44-12.98L16.44-0.05Q16.44 2.30 14.14 2.30L14.14 2.30ZM10.32-9.89L12.36-9.31Q11.11-4.34 9.10-0.62L9.10-0.62L6.96-1.39Q8.88-4.78 10.32-9.89L10.32-9.89Z'

        if (!SVG.supported) {
          alert('当前浏览器SVG不受支持，请更换浏览器使用！！！')
          return
        }
        const svg = $(`<svg id="svg" width="100%" height="100%" viewBox="0,0,${model.w},${model.h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:snapsvg="https://cdn.bootcss.com/snap.svg/0.5.1/snap.svg-min.js"></svg>`)
        $('#posterCanvasContainer').html(svg)
        svg.ready(async () => {
          let svg = Snap('#svg')
          let pathBox = svg.paper.path(txt)
          pathBox.attr({width: '200', fill: '#fff'})
          var t1 = svg.paper.text(0, 0)
          let g = svg.paper.g(pathBox) // 注意这里元素的顺序是不一样的
        })
      },

      // 绘制背景图
      async drawModelImage (draw) {
        let that = this
        let model = that.model
        model.svgDrow = {}
        const parentGroup = await draw.group().rotate(0).attr({'data-type': 'model'}).style({opacity: 1})
        const hoveMoveGroup = await draw.group()
        const svgGroup = await draw.group()
        parentGroup.addClass('parentGroup')
        parentGroup.add(hoveMoveGroup.add(svgGroup))
        let id = svgGroup.attr('id')
        // 绘制文字SVG盒子
        let pathDraw = await SVG(id).size(model.w, model.h).viewbox(0, 0, model.w, model.h).style({
          top: 0,
          left: 0
        })
        model.svgDrow.parentNode = pathDraw
        await svgGroup.add(pathDraw)
        // 绘制透明矩形
        const rect = await pathDraw.rect(model.w, model.h).attr({opacity: 0})
        rect.addClass('modelRect')
        model.svgDrow.childModelRect = rect
        let url = model.background
        if (/(:3000)/ig.test(PROXY_URL) || location.origin !== config.host) {
          url = PROXY_URL + encodeURIComponent(model.background)
        }
        const group = pathDraw.group()
        group.addClass('modelGroup')

        let modelGroup = pathDraw.image(url, model.w, model.h)
        group.add(modelGroup)
        await pathDraw.attr({fill: model.backgroundColor})
        return parentGroup
      },

      // 绘制图片元素
      drawSvgImage (draw, item = {}) {
        let that = this
        let model = that.model
        let style = {...Deploy2style.basisFilter(item.basic), ...Deploy2style.basisFilter(item.customize)}
        for (let k in style) {
          let val = style[k]
          if (Deploy2style.isPixel(val) || /^-?\d{0,}.?\d+$/ig.test(val)) {
            style[k] = parseFloat(val)
          }
        }
        item.style = style
        item.svgDrow = {}

        const parentGroup = draw.group().attr({'data-type': +item.type === 2 ? 'qrcode' : 'image'}).style({opacity: 1})
        const hoveMoveGroup = draw.group()
        if (+item.status === 1) {
          hoveMoveGroup.addClass('hoveMove')
        }
        const svgGroup = draw.group()
        parentGroup.x(item.style.x).y(item.style.y).addClass('parentGroup')
        parentGroup.add(hoveMoveGroup.add(svgGroup))
        const id = svgGroup.attr('id')
        // 绘制文字SVG盒子
        const pathDraw = SVG(id).size(style.width, style.height).viewbox(0, 0, style.width, style.height).style({
          top: 0,
          left: 0
        })
        item.svgDrow.parentNode = pathDraw
        svgGroup.add(pathDraw)
        // 绘制透明矩形
        const rect = pathDraw.rect(style.width, style.height).attr({opacity: 0})
        rect.addClass(+item.type === 2 ? 'qrcodeRect' : 'imageRect')
        item.svgDrow.childModelRect = rect
        const group = pathDraw.group()
        group.addClass(+item.type === 2 ? 'qrcodeGroup' : 'imageGroup')
        if (+item.type === 2) {
          let image = item.image
          if (/(:3000)/ig.test(PROXY_URL) || location.origin !== config.host) {
            image = PROXY_URL + encodeURIComponent(image)
          }
          let id = group.attr('id')
          that.util.getScriptLoad('https://app.mmtcapp.com/js/qrcode/qrcode.min.js', 'QRCode', function (QRCode) {
            if (QRCode) {
              const qrcode = new QRCode(document.getElementById(id), {
                width: style.width * 2,
                height: style.width * 2,
                useSVG: true
              })
              $(`#${id}`).find('img').on('load', function () {
                let qrcodeGroup = pathDraw.image($(this)[0].src).loaded(function (loader) {
                  const w = loader.width / 2 * 0.8
                  const h = loader.height / 2 * 0.8
                  this.size(w, h)
                  const x = (style.width - w) / 2
                  const y = (style.width - w) / 2
                  this.move(x, y)
                  rect.opacity(1)
                  rect.fill(style.backgroundColor || '#fff')
                  pathDraw.image('/static/favicon.ico').loaded(function (loader) {
                    const w = style.width * 0.2
                    const h = style.width * 0.2
                    this.size(w, h)
                    const x = (style.width - w) / 2
                    const y = (style.width - w) / 2
                    this.move(x, y)
                  })
                })
                group.add(qrcodeGroup)
              })
              qrcode.makeCode(item.content)
            }
          })
        } else {
          let content = item.content
          if (/(:3000)/ig.test(PROXY_URL) || location.origin !== config.host) {
            content = PROXY_URL + encodeURIComponent(content)
          }
          let imageGroup = pathDraw.image(content, style.width, style.height)
          group.add(imageGroup)
        }
        if (+item.type === 2)
          pathDraw.fill(style.backgroundColor || '#fff')
        else
          pathDraw.fill(style.backgroundColor)
        // 元素旋转
        parentGroup.rotate(style.rotate || 0)
        return parentGroup
      },

      // 绘制文字元素
      drawSvgText (draw, item = {}) {
        let that = this
        let model = that.model
        let style = {...Deploy2style.basisFilter(item.basic), ...Deploy2style.basisFilter(item.customize)}
        for (let k in style) {
          let val = style[k]
          if (Deploy2style.isPixel(val) || /^-?\d{0,}.?\d+$/ig.test(val)) {
            style[k] = parseFloat(val)
          }
        }
        item.style = style
        item.svgDrow = {}
        let content = item.content
        let zIndex = item.style.zIndex
        let txtWidth = item.style.width / TEXT_SCALE
        if (txtWidth - item.style.width > 50) {
          txtWidth = item.style.width + 50
        }
        if (txtWidth >= this.model.w) {
          txtWidth = this.model.w
        }
        let txtHeight = item.style.height
        if (txtHeight / 1.2 <= style.fontSize) {
          style.fontSize = txtHeight / 1.2
        }
        // console.log(item.style, item.type, content)

        const parentGroup = draw.group().rotate(0).attr({'data-type': 'text'}).style({opacity: 1})
        const hoveMoveGroup = draw.group()
        if (+item.status === 1) {
          hoveMoveGroup.addClass('hoveMove')
        }
        const svgGroup = draw.group()
        parentGroup.x(item.style.x).y(item.style.y).addClass('parentGroup')
        parentGroup.add(hoveMoveGroup.add(svgGroup))
        let id = svgGroup.attr('id')
        // 绘制文字SVG盒子
        let pathDraw = SVG(id).size(txtWidth, txtHeight).viewbox(0, 0, txtWidth, txtHeight).style({
          top: 0,
          left: 0
        })
        item.svgDrow.parentNode = pathDraw
        svgGroup.add(pathDraw)
        // 绘制透明矩形
        const rect = pathDraw.rect(txtWidth, txtHeight).attr({opacity: 0})
        rect.addClass('modelRect')
        item.svgDrow.childModelRect = rect
        pathDraw.attr({fill: item.style.color})
        // that.$ajax.getFontsPath({
        //   txt: content,
        //   fontSize: style.fontSize,
        //   fontFamily: '方正字迹-新手书'
        // }).finally(res => {
        //   if (res && res.status === 1 && res.info) {
        //     item.fontPaths = res.info.fontPaths;
        //     item.fonts = res.info.fonts;
        //     that.fontGroup(pathDraw, item);
        //   }
        // });
        that.socket.emit('getFontsPath', {
          txt: content,
          fontSize: style.fontSize,
          fontFamily: '方正字迹-新手书'
        }, function (data) {
          if (data.status === 1 && data.info) {
            item.fontPaths = data.info.fontPaths
            item.fonts = data.info.fonts
            that.fontGroup(pathDraw, item)
          }
        })

        // 元素旋转
        parentGroup.rotate(style.rotate || 0)
        return parentGroup
      },
      async fontGroup (draw, item) {
        let style = item.style
        item.svgDrow.childTextGroups = []
        item.svgDrow.childTextPaths = []
        if (Array.isArray(item.fontPaths) && item.fontPaths.length > 0) {
          let txtHeight = 0
          for (let [index, elem] of new Map(item.fontPaths.map((item, i) => [i, item]))) {
            let txtWidth = 0
            let group = await draw.group()
            group.addClass('textGroup')
            item.svgDrow.childTextGroups.push(group)
            let txtPaths = []
            let txtHeights = []
            for (let [i, v]of new Map(elem.map((item, i) => [i, item]))) {
              // 绘制文字
              let txtPath = await draw.path(v).translate(0, style.fontSize)
              // console.log(txtPath.width(), txtPath.height(), txtPath.length(), '宽:高:长度', item.fonts[index][i])
              // txtWidth += Math.round(txtPath.width());
              if (i === elem.length - 1) {
                txtWidth = Math.round(txtPath.x() + txtPath.width())
              }
              txtHeights.push(Math.round(txtPath.height()))
              group.add(txtPath)
              txtPaths.push(txtPath)
            }
            let txtPadding = 0
            // 居中布局
            if (style.textAlign === 'center') {
              console.log(style.width, txtWidth, 'center')
              txtPadding = (style.width - txtWidth / TEXT_SCALE) / 2
            } else if (style.textAlign === 'right') {
              txtPadding = (style.width - txtWidth / TEXT_SCALE)
            }
            if (index > 0) {
              txtHeights.sort((a, b) => {
                return b - a
              })
              txtHeight = txtHeights[0] * 1.2
            }
            // console.log(txtWidth, '文字宽度', item.fonts[index].join(''))
            // console.log(txtHeight, '文字高度', txtHeights)
            await group.translate(txtPadding, txtHeight)
            item.svgDrow.childTextPaths.push(txtPaths)
            // if (index > 0) {
            //   debugger
            //   txtHeight = item.svgDrow.childTextGroups[index - 1].height() * index
            //   console.log(txtHeight, '文字高度');
            // }
          }
        }
      },
      // 鼠标滚轮事件
      handleMousewheel (e) {
        let that = this
        // console.log(e, '鼠标滚轮事件');
        if (e.deltaY > 0) {
          this.scale -= 1
        } else {
          this.scale += 1
        }
        // setTimeout(function () {
        //   that.handleResize(true)
        // }, 300)
      },
      handleResize (bol) {
        // this.$toast.message(9090);
        let that = this
        const $ = this.util.Zepto
        const dom = $(this.$el)
        dom.height($(window).height())
        const container = dom.find('#posterCanvasContainer')
        const azmScrollBox = dom.find('.azm-scroll')
        const model = this.model
        if (!model.h || !model.w) {
          return
        }
        const aspectRatio = model.w / model.h
        let scaleWidth = this.scale
        if (scaleWidth < 10 || scaleWidth > 100) {
          scaleWidth = scaleWidth < 10 ? 10 : 100
        }
        let posterWidth = 0
        let azmScrollWidth = azmScrollBox.width() * (scaleWidth / 100)
        let azmScrollHeight = azmScrollBox.height() * 0.9
        that.maxPosterHeight = azmScrollHeight
        // console.log(azmScrollWidth, azmScrollHeight, '父盒子');
        let posterHeight = azmScrollWidth / aspectRatio
        // console.log(posterHeight, bol, 'svg盒子高度');
        if (posterHeight > azmScrollHeight && bol === true) {
          posterWidth = azmScrollHeight * aspectRatio
          defaultScale = scaleWidth = Math.round(posterWidth / azmScrollBox.width() * 100)
          // if (defaultScale < 70) {
          //   scaleWidth = 70
          // }
        } else {
          posterWidth = azmScrollWidth
        }
        // console.log(scaleWidth, posterWidth, posterHeight, '百分比:宽：高');
        this.scaleWidth = scaleWidth
        this.posterHeight = posterHeight
        this.posterWidth = posterWidth
        this.scale = scaleWidth
      },
      handleScroll (e) {
        // console.log(e);
        // if (defaultHeightStatus) {
        //   defaultHeightStatus = false;
        //   this.posterHeight++;
        // } else {
        //   defaultHeightStatus = true;
        //   this.posterHeight--;
        // }
      },

      // canvas
      drawDraggableGroup (layer) {
        let that = this
        let width = 500
        let height = 500
        let padding = 20
        let gWidth = width + padding
        let gHeight = height + padding
        let x = gWidth / 2
        let y = gHeight / 2

        const group = new Group()
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
        })

        const box = new Sprite()
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
        })

        let boxW = box.outerSize[0]
        let boxH = box.outerSize[1]

        let lrWidth = 6
        let lrHeight = boxH / 3
        // 创建盒子左移动块
        const LeftBox = new Sprite()
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
        })

        // 创建盒子右移动块
        const RightBox = LeftBox.cloneNode()
        // height / 2 - lrHeight
        RightBox.attr({
          id: 3,
          pos: [boxW / 2 - lrWidth / 2, 0],
        })

        let circleWidth = 14
        let offset = 3
        let circleX = -boxW / 2 + circleWidth / 2 - offset
        let circleX2 = boxW / 2 - circleWidth / 2 + offset
        let circleY = -boxH / 2 + circleWidth / 2 - offset
        let circleY2 = boxH / 2 - circleWidth / 2 + offset
        // 创建盒子左上角落移动块
        const ltCircle = new Sprite()
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

        console.log(lrData, 890799)
        ltCircle.attr(lrData)

        // 创建盒子右移动块
        const rtCircle = ltCircle.cloneNode()
        rtCircle.attr({
          id: 5,
          pos: [circleX2, circleY],
        })

        // 创建盒子右移动块
        const rbCircle = ltCircle.cloneNode()
        rbCircle.attr({
          id: 6,
          pos: [circleX2, circleY2],
        })

        // 创建盒子右移动块
        const lbCircle = ltCircle.cloneNode()
        lbCircle.attr({
          id: 7,
          pos: [circleX, circleY2],
        })

        group.append(box, LeftBox, RightBox, ltCircle, rtCircle, rbCircle, lbCircle)
        return group
      },
      drawGroup (item) {
        let that = this
        let style = {...Deploy2style.basisFilter(item.basic), ...Deploy2style.basisFilter(item.customize)}
        for (let k in style) {
          let val = style[k]
          if (Deploy2style.isPixel(val) || /^-?\d{0,}.?\d+$/ig.test(val)) {
            style[k] = parseFloat(val)
          }
        }
        item.style = style
        let content = item.content
        let zIndex = item.style.zIndex
        console.log(item.style, item.type, content)
        let id = that.util.UUID.v1()
        const group = new Group()
        item.gid = id
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
        })
        if ([0, 3].indexOf(+item.type) > -1) {
          // let contents = content.split('');
          // let labels = contents.map(function (v, i) {
          //   return that.drawText(style, v)
          // });
          group.append(that.drawText(style, content))
        } else if (+item.type === 1) {
          // group.append(that.drawImage(style, content));
        }
        return group
      },
      drawText (style, content) {
        let that = this
        const label = new Label()
        let id = that.util.UUID.v1()
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

        })
        return label
      },
      drawImage (item) {

      },
      draggable (group, zIndex = 1, item) {
        let that = this
        let $ = that.util.Zepto
        let dom = $(that.$el)
        if (group.isDraggable) return
        group.isDraggable = true
        let x0, y0, startPos

        function onMouseMove (e) {
          const dx = e.x - x0, dy = e.y - y0
          group.attr('pos', [startPos[0] + dx, startPos[1] + dy])
          e.stopDispatch()
        }

        let border = null

        group.on('touchstart', (e) => {
          console.log(e, '结束')
          // border = group.attr('border');
          // group.attr('border', {width: 1, color: 'blue'});
        })
        group.on('touchend', (e) => {
          console.log(e, '鼠标离开')
          // group.attr('border', border);
        })

        group.on('touchstart', (e) => {
          that.options.vuescroll.scroller.locking = false
          console.log(e, 'touchstart')
          x0 = e.x
          y0 = e.y
          startPos = group.attr('pos')
          console.log(startPos)
          if (group.id !== 'model') {
            group.attr('zIndex', zIndex++)
          }
          group.off('touchmove', onMouseMove)
          group.setMouseCapture()
          group.on('touchmove', onMouseMove)
          e.stopDispatch()
        }).on('touchend', e => {
          if (item.style) {
            const pos = group.attr('pos')
            item.style.x = pos[0]
            item.style.y = pos[1]
          }
          that.options.vuescroll.scroller.locking = true
          console.log(e, 'touchend')
          group.off('touchmove', onMouseMove)
          group.releaseMouseCapture()
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
        return group
      }
    }
  }
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  .azm-poster-canvas {
    height: 100%;
    width: 100%;
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .azm-scroll {
      position: relative;
      flex: 1;
      touch-action: auto;
      overflow: hidden;

      #posterCanvasContainer {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    footer {
      box-sizing: border-box;
      padding: 10px 0;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #fff;
      vertical-align: middle;
    }

    #posterCanvasContainer, .posterCanvasContainer {
      width: 80%;
      margin: 0 auto;
      background-color: transparent;
      text-align: center;
    }

    @media screen and (min-width: 500px) {
      #posterCanvasContainer, .posterCanvasContainer {
        width: 100%;
      }
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
  html.html-poster_svg {
    position: fixed;
    /*z-index: 10000000;*/
    user-select: none;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    body, #app {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

  .azm-poster-canvas {
    /*.__vuescroll {*/
    /*.__panel.__slide {*/
    /*padding: 10px 0;*/
    /*}*/
    /*}*/

    .hoveMove {
      cursor: move;
    }

    svg:not(:root), symbol, image, marker, pattern, foreignObject {
      overflow: hidden;
    }

    footer {

    }
  }
</style>
