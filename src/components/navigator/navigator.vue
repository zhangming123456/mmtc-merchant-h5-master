<template>
  <div ref="viewport" class="navigator-component">
    <scroll ref="scroll" direction="horizontal">
      <ul class="tab-list" ref="tabList">
        <li v-for="(item,index) in navList" class="tab-item" @click="selectNav(index,item)">
          <slot name="item" :item="item" :id="item.id" :index="index">
            <span class="tab-name" :class="{'link-active':isCurrentTab(item.id)}">{{item.name}}</span>
          </slot>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'

  const EVENT_CHANGE = 'change'
  let time = null

  export default {
    props: {
      navList: {
        type: Array,
        default () {
          return [{
            id: 1,
            name: 'default'
          }]
        }
      },
      currentTabIndex: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        currentTab: 4,
        current: 1,
        imageUrl: this.$azm.config.imageUrl
      }
    },
    mounted () {
      let that = this;
      that.$nextTick(function () {
        that.refresh()
      })
    },
    watch: {
      navList(curVal, oldVal){
        let that = this;
        if (curVal) {
          that.$nextTick(function () {
            that.refresh()
          })
        }
      }
    },
    methods: {
      refresh(){
        time && clearTimeout(time)
        this._initTabListWidth()
        this.$emit(EVENT_CHANGE)
        if (this.currentTabIndex === null) {
          this.current = this.currentTab
        } else {
          this.current = this.currentTabIndex
        }
        time = setTimeout(() => {
          this._adjust(this.current)
        }, 500)
      },
      isCurrentTab (index) {
        return index === this.current
      },
      selectNav (index, item) {
        this.current = index
        this._adjust(index)
        this.$emit(EVENT_CHANGE, index, item)
      },
      _initTabListWidth () {
        const tabList = this.$refs.tabList
        const items = tabList.children
        let width = 0
        for (let i = 0; i < items.length; i++) {
//          console.log(Math.ceil(items[i].clientWidth), i)
          width += Math.ceil(items[i].clientWidth) + 1
        }
        tabList.style.width = width + 'px'
      },
      _adjust (tabId) {
        const viewportWidth = this.$refs.viewport.clientWidth
        const tabListWidth = this.$refs.tabList.clientWidth
        const minTranslate = Math.min(0, viewportWidth - tabListWidth)
        const middleTranslate = viewportWidth / 2
        const items = this.$refs.tabList.children
        let width = 0
        this.navList.every((item, index) => {
          console.log(item, index)
          if (+tabId === tabId) {
            return false
          }
          width += items[index].clientWidth
          return true
        })
        let translate = middleTranslate - width
        translate = Math.max(minTranslate, Math.min(0, translate))
        this.$refs.scroll.scrollTo(translate, 0, 300)
      },
    },
    components: {
      Scroll
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  .navigator-component
    .list-wrapper
      background: none
      .scroll-content
      //用于横向滚动
        display: inline-block
      .tab-list
        margin: 0 auto
        .tab-item
          display: inline-block
          line-height: 54px;
          box-sizing: border-box;
          overflow: hidden;
          .tab-name
            display: block
            position: relative
            padding: 0 15px 0 14px
            font-size: 14px
            color: #666
            &.link-active
              transition: all 0.2s
              transform: scale(1.04)
              color: #fc9153
</style>
