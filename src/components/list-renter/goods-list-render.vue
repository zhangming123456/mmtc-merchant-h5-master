<template>
  <div class="goods-list-render-view">
    <scroll class="scroll" listenScroll @scroll="onScroll">
      <slot ref="list"></slot>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import BScroll from 'better-scroll'

  export default {
    name: 'azm-goods-list',
    components: {
      Scroll
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        foods: []
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.scroll = this.$refs.scroll

        console.log(this.scroll, "dsfjlakdsjf")

//        this.scroll.on('scrollStart', () => {
//          console.log('scrollStart')
//        })
//
//        this.scroll.on('scroll', (pos) => {
//          console.log('pos:', pos)
//        })
//
//        this.scroll.on('scrollEnd', () => {
//          console.log('scrollEnd')
//        })
//
//        this.scroll.on('dblclick', (e) => {
//          console.log('dblclick:', e)
//        })

//        this._appendFood()
      })
    },
    destroyed() {
      this.scroll && this.scroll.destroy()
    },
    methods: {
      _appendFood() {
        while (this.foods.length < 100) {
          this.foods = this.foods.concat(_foods)
          this._appendFood()
        }
      },
      onScroll(a){
        console.log(a)
      }
    }
  }
</script>

<style lang="less">
  .goods-list-render-view {
    background-color: white;
    width: 100%;
    height: 500px;
    overflow: hidden;
    .scroll {
      height: 100%;
    }
  }

</style>
