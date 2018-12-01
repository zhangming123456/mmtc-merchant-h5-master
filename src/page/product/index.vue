<template>
  <div class="azm-product-index demo-loadmore-wrap">
    <mu-paper :z-depth="4">
      <mu-tabs :value.sync="tabsActive" indicatorColor="#2D81E4" color="#2D81E4"
               textColor="#2D81E4" center inverse @change="tabsChange">
        <template v-for="(item,index) in tabs">
          <mu-tab>
            <div class="azm-tab-box">{{item.title}}（{{item.num}}）</div>
          </mu-tab>
        </template>
      </mu-tabs>
    </mu-paper>
    <mu-container ref="container" class="demo-loadmore-content needsclick">
      <mu-load-more class="needsclick" @refresh="refresh" :refreshing="refreshing" :loading="loading"
                    :loaded-all="loadedAll" @load="load">
        <transition :name="isTransition?'mu-slide-right-transition':'mu-slide-left-transition'">
          <azm-product-index-list v-show="tabsActive === 0" v-model="shelfData"
                                  :active="0" @refresh="refresh"></azm-product-index-list>
        </transition>
        <transition :name="isTransition?'mu-slide-right-transition':'mu-slide-left-transition'">
          <azm-product-index-list v-show="tabsActive === 1" v-model="obtainedData"
                                  :active="1" @refresh="refresh"></azm-product-index-list>
        </transition>
        <transition :name="isTransition?'mu-slide-right-transition':'mu-slide-left-transition'">
          <azm-product-index-list v-show="tabsActive === 2" v-model="reviewData"
                                  :active="2" @refresh="refresh"></azm-product-index-list>
        </transition>
      </mu-load-more>
    </mu-container>
    <mu-flex class="azm-append-footer" v-if="!isMerchantH5">
      <mu-button full-width textColor="#fff" to="/product_editAndModify">
        <span>+&nbsp;</span>
        <span>发布产品</span>
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>
  import productList from '../../view-render/product-index-list.vue'
  import { isMerchantH5 } from '../../libs/util'
  import { Icon } from 'vant'
  import { LoadMore, Paper, Badge } from 'muse-ui'
  import { dateFormat } from 'vux'
  import Avatar from '../../components/avatar/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      [productList.name]: productList,
      [Badge.name]: Badge,
      [Paper.name]: Paper,
      [LoadMore.name]: LoadMore,
      [Avatar.name]: Avatar,
      [Icon.name]: Icon,
    },
    data () {
      return {
        isMerchantH5: isMerchantH5,
        message: '',
        tabsActive: 0,
        refreshing: false,
        loading: false,
        loadedAll: false,
        lists: [],
        tabs: [
          {
            title: '已上架',
            num: 0
          },
          {
            title: '已下架',
            num: 0
          },
          {
            title: '审核',
            num: 0
          }
        ],
        shelvesPage: 1,
        soldOutPage: 1,
        auditPage: 1,
        shelvesLoadedAll: false,
        soldOutLoadedAll: false,
        auditLoadedAll: false,
        isTransition: false
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        shelfData: state => state.product.shelfData,
        obtainedData: state => state.product.obtainedData,
        reviewData: state => state.product.reviewData,
      })
    },
    watch: {
      tabsActive: {
        handler: function (val, oldVal) {
          if (val > oldVal) {
            this.isTransition = true
          } else if (val < oldVal) {
            this.isTransition = false
          }
        },
        deep: true
      }
    },
    created () {
      this.tabsActive = +this.$route.query.type || 0
      this.$nextTick(function () {
        this.refresh()
      })
    },
    methods: {
      refresh (e) {
        this.refreshing = true
        this.$refs.container.scrollTop = 0
        let tabsActive = this.tabsActive
        this.getItemlistFigure()
        try {
          this.getItemlistSite(1, tabsActive).finally(res => {
            this.refreshing = false
          })
        } catch (err) {
          this.refreshing = false
        }
      },
      load (e) {
        this.loading = true
        let tabsActive = this.tabsActive
        let P = null
        if (tabsActive === 2) {
          P = this.getItemlistSite(this.auditPage, tabsActive)
        } else if (tabsActive === 1) {
          P = this.getItemlistSite(this.soldOutPage, tabsActive)
        } else {
          P = this.getItemlistSite(this.shelvesPage, tabsActive)
        }
        if (P) {
          P.finally(res => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      },
      getItemlistFigure () {
        let that = this
        return this.$store.dispatch('ApiService/itemlistFigure', {}).finally(res => {
          if (res.status === 1 && res.info) {
            let info = res.info
            that.tabs[0].num = info.type1num || 0
            that.tabs[1].num = info.type2num || 0
            that.tabs[2].num = info.type3num || 0
          }
        })
      },
      getItemlistSite (p = 1, t = 0) {
        let that = this
        if (this.isGetItemlistSite) return
        this.isGetItemlistSite = true
        return that.$ajax.getProductList({p, t}).finally(res => {
          this.isGetItemlistSite = false
          if (res.status === 1 && res.info) {
            let info = that.shelfData
            if (+t === 1) {
              info = that.obtainedData
            } else if (+t === 2) {
              info = that.reviewData
            }
            let len = info.length
            let page = info[len - 1].length === 10 ? p + 1 : p
            that.loadedAll = page === p
            switch (true) {
              case (t === 2):
                that.auditPage = page
                that.shelvesLoadedAll = page === p
                break
              case (t === 1):
                that.soldOutPage = page
                that.soldOutLoadedAll = page === p
                break
              default:
                that.shelvesPage = page
                that.shelvesLoadedAll = page === p
            }
          }
        })
      },
      tabsChange (e) {
        let tabsActive = this.tabsActive
        let P = null
        if (tabsActive === 2) {
          P = this.getItemlistSite(this.auditPage, tabsActive)
        } else if (tabsActive === 1) {
          P = this.getItemlistSite(this.soldOutPage, tabsActive)
        } else {
          P = this.getItemlistSite(this.shelvesPage, tabsActive)
        }
        if (P) {
          P.finally(res => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
        this.$router.replace({path: '/product_index', query: {type: tabsActive}})
      },
    }
  }
</script>

<style lang="less" scoped>
  .flex-wrapper {
    box-sizing: border-box;
    padding: 12px 15px;
  }

  .azm-product-index {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    .azm-tab-box {
      min-width: 80px;
    }
    .mu-paper {
      width: 100%;
      .mu-tabs {
        width: 100%;
        background-color: #fff;
        color: #282828;
      }
    }
    .demo-loadmore-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0;
      .mu-load-more {
        min-height: 100%;
      }
      .azm-product-list-item {
        padding: 0;
        background-color: #fff;
        .azm-product-list-header {
          .azm-product-list-title {
            font-size: 14px;
            color: #999999;
          }
          .azm-product-list-value {
            text-align: right;
          }
        }
        .azm-product-list-section {
          .azm-product-list-value {
            .azm-title {
              font-size: 18px;
              color: #282828;
            }
            .azm-time {
              font-size: 13px;
              color: #666;
            }
            .azm-detail {
              text-align: right;
              .mu-button {
                height: 30px;
                line-height: 30px;
                font-size: 12px;
              }
              .van-icon {
                font-size: 12px;
              }
            }
          }
        }
        .azm-product-list-image {
          width: 94px;
          min-width: 94px;
        }
        .azm-product-list-footer {
          .azm-product-list-value {
            text-align: right;
          }
        }
      }
    }
    .azm-append-footer {
      .mu-button {
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
      }
    }
  }
</style>

<style lang="less">
  .azm-product-index {
    .azm-product-index-list {
      &.mu-slide-right-transition-leave-active, &.mu-slide-left-transition-leave-active,
      &.mu-slide-right-transition-enter-active, &.mu-slide-left-transition-enter-active {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f4f4f4;
      }
      &.mu-slide-right-transition-leave-active, &.mu-slide-left-transition-leave-active {
        z-index: 2;
      }
    }
    .azm-product-list-header {
      .mu-badge-container {
        border: 1px solid #ff4919;
        border-radius: 3px;
        .mu-badge {
          color: #ff4919;
        }
      }
    }
  }
</style>
