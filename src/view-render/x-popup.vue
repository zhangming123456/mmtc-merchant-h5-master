<template>
  <div>
    <a class="azm-popup-mask" :class="{'azm-popup-show':value}" :style="{zIndex:500}"
       v-if="value" href="javascript:void(0)" @click="value = false"></a>
    <x-popup v-model="value" class="azm-x-popup" position="bottom" :popup-style="{zIndex:1000}"
             :is-transparent="false"
             @on-show="onShow" @on-hide="onHide"
             :show-mask="false"
             :should-scroll-top-on-show="false" :should-rerender-on-show="true">
      <div class="azm-x-popup-container" :style="{background:bgColor}">
        <header class="azm-x-popup-header azm-1px azm-1px-b azm-1px-t">
          <!-- 我们希望把页头放这里 -->
          <slot name="header">
            <mu-list class="x-popup-header">
              <mu-list-item avatar :ripple="false">
                <mu-list-item-title class="azm-product-list-title">换模板</mu-list-item-title>
                <mu-list-item-title class="azm-product-list-title" style="text-align: right;">
                  <!--<i class="iconfont icon-time1"></i>-->
                  <span class="azm-time" @click="toPosterBrowse"><i class="iconfont icon-time1"></i>&nbsp;最近浏览</span>
                </mu-list-item-title>
                <mu-list-item-action class="azm-product-list-action">
                  <mu-icon value="check" color="#4DA9EB" @click="confirm"></mu-icon>
                  <!--<i class="iconfont icon-dui"></i>-->
                </mu-list-item-action>
              </mu-list-item>
            </mu-list>
          </slot>
        </header>
        <main class="azm-x-popup-value">
          <!-- 我们希望把主要内容放这里 -->
          <slot>
            <div class="azm-x-popup-value-img">
              <vue-scroll ref="scroll" :ops="options" @handle-resize="handleResize">
                <ul class="clearfix" style="flex: 1;width:100%;"
                    :style="{width:`${lists.length / 4 * 100}%`,height:imgH + 'px'}">
                  <li v-for="(item,index) in lists" class="child" @click="bindselect(item)"
                      :id="'child' +  (keyTxt === 'index'? index:item[keyTxt])"
                      :style="{width:`${100/lists.length}%`}">
                    <div class="img">
                      <azm-avatar mode="aspectFill" :src="item.image" @bindload="bindload(index,$event)"
                                  :aspectRatio="115/75"></azm-avatar>
                    </div>
                    <p class="van-ellipsis" v-if="keyTxt === 'index'" :class="{'active': index === +active}">
                      {{item.title}}</p>
                    <p class="van-ellipsis" v-else :class="{'active': item[keyTxt] === active}">{{item.title}}</p>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </slot>
        </main>
        <footer class="azm-x-popup-footer">
          <!-- 我们希望把页脚放这里 -->
          <slot name="footer"></slot>
        </footer>
      </div>
    </x-popup>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { Popup, Flexbox, FlexboxItem } from 'vux'
  import Avatar from '../components/avatar/index.vue'
  import config from '../libs/config'

  export default {
    name: "azm-x-popup",
    components: {
      [`x-popup`]: Popup,
      [Avatar.name]: Avatar,
      Flexbox, FlexboxItem
    },
    // // 异步组件加载时使用的组件
    // loading: LoadingComponent,
    // // 加载失败时使用的组件
    // error: ErrorComponent,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000,
    model: {
      prop: 'isShow'
    },
    props: {
      isShow: Boolean,
      keyTxt: {
        type: String,
        default: 'index'
      },
      deploy: {
        type: Object,
        default: function (n, o) {
          if (!n || !this.util.isEmptyObject(n)) {
            return {
              active: 0,
              list: [],
              cancel () {
              },
              confirm () {
              }
            };
          } else {
            return n
          }
        }
      },
      maxLen: {
        type: Number,
        default: 0
      },
      bgColor: {
        type: String,
        default: '#555'
      }
    },
    data () {
      return {
        message: '',
        options: {
          vuescroll: {
            mode: 'slide',
            scroller: {
              bouncing: true
            },
            zooming: false
          },
          scrollPanel: {
            scrollingY: false,
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
        imgW: 100,
        imgH: 134,
        arr: [],
        value: this.isShow,
        activeItem: null,
        active: this.deploy.active || 0,
        lists: this.deploy.list || [],
        ops: this.deploy
      }
    },
    computed: {
      ...mapState({})
    },
    watch: {
      isShow (val) {
        this.value = val
      },
      value (val) {
        this.$emit('input', val)
      },
      lists: {
        handler: function (val, old) {
          if (val && this.util.isArray(val)) {
            this.lists = val
          } else {
            this.lists = []
          }
        },
        deep: true
      }
    },
    inject: ["appRefresh", 'isMerchantH5'],
    created () {
      this.$nextTick(function () {

      })
    },
    methods: {
      updateLen () {
        this.imgW = this.arr.length / 4 * 100
      },
      bindload (index, e) {
        let $ = this.$azm.Zepto;
        let dom = $(e.target).parents("li.child");
        this.imgW = dom.outerWidth();
        this.arr[index] = dom.outerWidth() + 0.1;
        this.imgH = dom.outerHeight();
        this.updateLen()
      },
      bindselect (item) {
        let fIndex = this.lists.findIndex(function (v) {
          return v.image === item.image
        });
        if (fIndex < 0) {
          fIndex = 0
        }
        let active = this.keyTxt === 'index' ? fIndex : this.lists[fIndex][this.keyTxt];
        if (active === this.active) return;
        this.active = active;
        this.activeItem = item;
        this.ops.select && this.ops.select(item);
        this.$emit('onSelect', item)
      },
      show ({active, list = [], cancel, confirm, complete, select}) {
        this.ops = {
          cancel,
          confirm,
          complete,
          select
        };
        this.lists = list;
        this.value = true;
        this.active = active || this.active
      },
      hide () {
        this.ops = {}
        this.lists = []
        this.value = false
      },
      onHide () {
        this.activeItem = null;
        this.$emit('onHide');
        this.$emit('isShow', false);
      },
      onShow () {
        this.scrollBy();
        this.$emit('onShow');
        this.$emit('isShow', true);
      },
      handleResize (obj) {
        console.log(obj, 11, this.$device);
        if (this.$device) {

        }
      },
      scrollBy () {
        this.$nextTick(function () {
          let active = this.active;
          if (active || active === 0) {
            this.$refs.scroll.scrollIntoView(`#child${active}`)
          }
        })
      },
      confirm () {
        let data = null
        if (this.activeItem) {
          data = {...this.activeItem}
        }
        this.ops.confirm && this.ops.confirm(data)
        this.ops.complete && this.ops.complete({confirm: true, value: data})
        this.$emit('confirm', data)
        this.hide()
      },
      historyRecord () {

      },
      toPosterBrowse () {
        if (this.isMerchantH5) {
          this.util.Native.toPosterBrowse()
        } else if (config.isMiniWechat) {
          this.$wechat.miniProgram.navigateTo({url: '/page/me/pages/historyRecord/index'});
        }
      }
    }
  }
</script>

<style scoped lang="less">
  a.azm-popup-show {
    opacity: 1;
  }

  .azm-popup-mask {
    position: fixed;
    background: rgba(0, 0, 0, .5);
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    tap-highlight-color: transparent;
    transition: opacity .4s;
    z-index: -1;
  }

  .azm-x-popup {
    .azm-x-popup-container {
      .azm-x-popup-header {
        box-sizing: border-box;
        font-size: 12px;
        .x-popup-header {
          color: #fff;
          .azm-product-list-title {
            color: #fff;
            font-size: 14px;
            .azm-time {
              color: #c3c3c3;
              font-size: 14px;
            }
          }
          .azm-product-list-action {
            min-width: auto;
            margin-left: 25px;
            i {
              font-size: 20px;
            }
          }
        }
      }
      .azm-x-popup-value {
        box-sizing: border-box;
        min-height: 10px;
        .azm-x-popup-value-img {
          width: 100%;
          overflow: auto;
          white-space: nowrap;
          background-color: #555;
          min-height: 10px;
          box-sizing: border-box;
          padding-left: 15px;
          padding-top: 10px;
          .child {
            box-sizing: border-box;
            float: left;
            position: relative;
            padding-right: 10px;
            .img {
              width: 75px;
              height: 115px;
              overflow: hidden;
            }
            p {
              width: 100%;
              text-align: center;
              line-height: 33px;
              height: 33px;
              font-size: 12px;
              color: #C3C3C3;
              &.active {
                color: #4DA9EB;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .azm-x-popup {
    .mu-item.has-avatar {
      height: auto;
    }
  }
</style>
