<template>
  <mu-dialog class="azm-amap maxWidth500" width="100%" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
    <mu-appbar color="primary" class="azm-map-search maxWidth500">
      <van-search type="search" v-model="search" placeholder="请输入搜索关键词" show-action @input="onSearch" autofocus
                  @cancel="onCancel"/>
    </mu-appbar>
    <div id="azmAmapMap" v-show="!no_data && showMap && searchList.length===0"></div>
    <vue-scroll ref="scroll" :ops="options" @handle-resize="handleResize">
      <ul class="azm-search-list" v-if="searchList.length>0 || no_data">
        <li class="azm-search-list-hear"></li>
        <li class="azm-search-list-item vux-1px-b azm-search-list-no_data" v-if="no_data"><p>暂无数据</p></li>
        <li class="azm-search-list-item vux-1px-b" v-for="item in searchList" @click="complete(item)">
          <p>{{item.name}}</p>
          <p>{{item.district}}{{item.address || ''}}</p>
        </li>
      </ul>
    </vue-scroll>
  </mu-dialog>
</template>

<script>
  import { AppBar } from 'muse-ui'
  import { Search } from 'vant'
  import { mapState } from 'vuex'

  export default {
    name: 'vue-azm-amap',
    prop: {
      show: Boolean,
      searchType: String,
      city: String,
      citylimit: Boolean,
    },
    components: {
      [AppBar.name]: AppBar,
      [Search.name]: Search,
    },
    data () {
      return {
        message: '',
        map: null,
        Getlocation: null,
        Autocomplete: null,
        isGetlocation: false,
        openFullscreen: false,
        search: '',
        // `090201|071100|150500|071400|061401|061400|190000|190100
        // |190101|190102|190103|190104|190105|190106|190107|190108|190109
        // |190200|170206|190400|190700|190500|190403|190402|190301`
        searchType: ``,
        currentCity: '深圳',
        currentAddress: '',
        currentPosition: {},
        searchList: [],
        showMap: true,
        no_data: false,
        opts: {},
        options: {
          vuescroll: {
            mode: 'slide',
            scroller: {
              bouncing: true
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
      }
    },
    computed: {
      ...mapState({})
    },
    inject: [],
    created () {
      let that = this;
      // that.initialize();
    },
    methods: {
      handleResize () {
      },
      createMap () {
        let that = this;
        that.map = new window.AMap.Map('azmAmapMap', {resizeEnable: true, zoom: 10});
        that.getLocation()
      },
      initialize () {
        let that = this
        that.$nextTick(function () {
          if (window.AMap) {
            that.createMap()
          } else {
            window.onLoad = that.createMap
            let url = 'https://webapi.amap.com/maps?v=1.4.10&key=0781b981fd0a7eb07de1eba8dc6c9b3b&callback=onLoad';
            let jsapi = document.createElement('script');
            jsapi.charset = 'utf-8';
            jsapi.src = url;
            document.head.appendChild(jsapi);
          }
        })
      },
      getLocation () {
        let that = this;
        return new Promise(((resolve, reject) => {
          function onComplete (data) {
            // data是具体的定位信息
            console.log(data);
            that.currentPosition = data.position;
            that.currentCity = data.addressComponent.city;
            that.currentAddress = data.formattedAddress;
            that.search = ''
            that.searchList = []
            that.isGetlocation = false;
            resolve(data);
          }

          function onError (data) {
            // 定位出错
            alert(data.message);
            that.isGetlocation = false;
            reject(data);
          }

          if (that.isGetlocation) {
            reject();
            return;
          }
          that.isGetlocation = true;
          if (that.Getlocation) {
            that.Getlocation.getCurrentPosition((status, result) => {
              if (status === 'complete') {
                onComplete(result)
              } else {
                onError(result)
              }
            });
          } else if (this.map) {
            that.map.plugin('AMap.Geolocation', function () {
              const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              });
              that.map.addControl(geolocation);
              geolocation.getCurrentPosition();
              AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
              AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
              that.Getlocation = geolocation;
            })
          } else {
            that.isGetlocation = false;
            reject();
          }
        }))
      },
      autocomplete (val, type) {
        let that = this;
        return new Promise(((resolve, reject) => {
          function onSearch (status, result) {
            that.isAutocomplete = false;
            if (status === 'complete' || status === 'no_data') {
              resolve({status: status === 'complete' ? 1 : 2, data: result});
            } else {
              reject(result)
            }
          }

          if (that.isAutocomplete) {
            reject();
            return;
          }
          that.isAutocomplete = true;
          if (that.Autocomplete) {
            that.isGetlocation = false;
            that.Autocomplete.search(val, onSearch);
          } else if (this.map) {
            that.map.plugin('AMap.Autocomplete', function () {
              const Autocomplete = new AMap.Autocomplete({
                type: that.searchType || '',//输入提示时限定POI类型，多个类型用“|”分隔，POI相关类型请在网站“相关下载”处下载目前只支持Poi类型编码如“050000”默认值：所有类别
                city: that.city || that.currentCity || '全国',//输入提示时限定城市。可选值：城市名（中文或中文全拼）、citycode、adcode；默认值：“全国”
                datatype: that.searchType || 'poi',//返回的数据类型可选值：all-返回所有数据类型、poi-返回POI数据类型、bus-返回公交站点数据类型、busline-返回公交线路数据类型目前暂时不支持多种类型
                citylimit: that.citylimit || false,//是否强制限制在设置的城市内搜索,默认值为：false true：强制限制设定城市，false：不强制限制设定城市
              });
              that.map.addControl(Autocomplete);
              Autocomplete.search(val, onSearch);
              AMap.event.addListener(Autocomplete, 'select', onSelect);      //返回定位出错信息
              function onSelect (data) {
                alert(data.message);
              }

              that.Autocomplete = Autocomplete;
            })
          } else {
            that.isGetlocation = false;
            reject();
          }
        }))
      },
      onSearch (val) {
        let that = this;
        this.autocomplete(val).finally(res => {
          that.no_data = false;
          if (res && res.status === 1) {
            that.searchList = res.data.tips
          } else if (res && res.status === 2) {
            that.no_data = true
            that.searchList = []
          } else {
            that.searchList = []
          }
        });
      },
      show ({complete, cancel} = {}) {
        this.openFullscreen = true;
        this.opts.complete = complete;
        this.opts.cancel = cancel;
        this.initialize();
      },
      complete (item) {
        this.opts.complete && this.opts.complete({...item});
        this.$emit('complete', {...item});
        this.destroy();
      },
      onCancel () {
        this.opts.cancel && this.opts.cancel();
        this.$emit('cancel');
        this.destroy();
      },
      destroy () {
        this.search = '';
        this.no_data = false;
        this.searchList = [];
        this.opts = {};
        this.openFullscreen = false;
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-amap {
    /*position: fixed;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*width: 100%;*/
    margin: 0 auto;
    .mu-appbar {;
      height: auto;
      padding: 0;
    }
    #azmAmapMap {
      height: 100%;
      width: 100%;
    }
    .azm-map-search {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      margin: 0 auto;
    }
    .azm-search-list-hear {
      height: 50px;
    }
    .azm-search-list-item {
      padding: 10px 15px;
      box-sizing: border-box;
      background-color: #fff;
      &.azm-search-list-no_data {
        p {
          text-align: center;
        }

      }
      p:nth-child(1) {
        font-size: 14px;
        margin-bottom: 5px;
      }
      p:nth-child(2) {
        font-size: 12px;
      }
    }
  }
</style>
<style lang="less">
  .azm-amap {
    .mu-dialog-body {
      position: relative;
      height: 100%;
      width: 100%;
      max-height: 100% !important;
    }
    .mu-appbar-title {
      padding: 0;
    }
  }
</style>
