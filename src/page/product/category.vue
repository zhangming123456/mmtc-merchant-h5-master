<template>
  <div class="azm-product-category">
    <mu-flex direction="column">
      <div class="azm-header">
        <mu-row>
          <mu-col :span="3" class="azm-flex-left">选着项目:</mu-col>
          <mu-col :span="9">
            <template v-if="category && category.length>0">
              <mu-chip v-for="(item,index) in category" :key="index" class="demo-chip" @delete="handleClose(item)"
                       delete>
                {{item.title}}
              </mu-chip>
            </template>
            <span v-else>最多三个标签</span>
          </mu-col>
        </mu-row>
      </div>
      <mu-flex fill class="azm-section" justify-content="start">
        <mu-flex justify-content="start" class="azm-section-drawer">
          <div class="azm-section-drawer"></div>
          <mu-drawer style="position: absolute;" :open.sync="open" :docked="docked"
                     :right="position === 'right'" :z-depth="0">
            <mu-list>
              <mu-list-item button v-for="(item,index) in itemList" :key="index" @click="tabIndex = index">
                <mu-list-item-title class="azm-item-title" :class="{'azm-item-title-active':tabIndex === index}">
                  {{item.title}}
                </mu-list-item-title>
              </mu-list-item>
            </mu-list>
          </mu-drawer>
        </mu-flex>
        <mu-flex fill justify-content="start" style="height: 100%" class="van-ellipsis">
          <mu-list style="height: 100%;width: 100%">
            <div style="width: 100%" v-if="itemList && itemList[tabIndex] &&  itemList[tabIndex].children">
              <template v-for="(item,index) in itemList[tabIndex].children">
                <div class="azm-list-title">{{item.title}}</div>
                <mu-flex wrap="wrap" fill justify-content="start" class="van-hairline--bottom azm-list-item"
                         v-if="item.children">
                  <template v-for="(val,i) in item.children">
                    <mu-button flat round class="azm-btn-item" @click.native="selectCatg(val)"
                               :textColor="val.isSelect?'#fff':'#666'" small
                               :class="{'azm-btn-item-active':val.isSelect}">
                      {{val.title}}
                    </mu-button>
                  </template>
                </mu-flex>
              </template>
            </div>
          </mu-list>
        </mu-flex>
      </mu-flex>
      <div class="azm-footer van-hairline--top">
        <mu-flex justify-content="end" class="">
          <mu-button flat textColor="#ff4919" small
                     @click.native="$router.back">
            取消
          </mu-button>
          <mu-button flat textColor="#fff" small class="azm-shelf-btn"
                     @click.native="onConfirm">
            确认
          </mu-button>
        </mu-flex>
      </div>
    </mu-flex>
  </div>
</template>

<script>
  import { Chip } from 'muse-ui'
  import { Cell } from 'vant'
  import { mapState } from 'vuex'
  export default {
    components: {
      [Chip.name]: Chip
    },
    filters: {},
    data(){
      return {
        message: '',
        docked: true,
        open: true,
        position: 'left',
        category: [],
        itemList: [],
        tabIndex: 0
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    created(){
      let that = this
      this.$store.dispatch('ApiService/iteminfoDataList').finally(res => {
        if (res.status === 1) {
          let category = []
          for (let v  of that.productData.category_ids) {
            category.push(v.id)
          }
          for (let val  of res.info) {
            for (let val2 of val.children) {
              for (let value of val2.children) {
                value.isSelect = category.indexOf(value.id + '') > -1;
                if (value.isSelect) {
                  that.category.push(value)
                }
              }
            }
          }
          that.itemList = res.info
        }
      })
    },
    methods: {
      indexOf(id){
        return this.category.findIndex(v => {
          return v.id = id
        })
      },
      selectCatg(val){
        let fIndex = this.category.findIndex(v => {
          return val.id === v.id
        })
        if (fIndex > -1) {
          this.handleClose(this.category[fIndex])
          return;
        }
        if (this.category.length < 3) {
          val.isSelect = true;
          this.category.push(val)
        } else {
          this.$toast.error('最多三个标签')
        }
      },
      handleClose(item){
        let fIndex = this.category.findIndex(v => {
          return v.id === item.id
        })
        if (fIndex > -1) {
          this.category[fIndex].isSelect = false;
          this.category.splice(fIndex, 1)
        }
      },
      onConfirm(){
        if (this.category.length === 0) {
          this.$toast.error('最少一个标签')
          return;
        }
        this.productData.category_ids = this.category
        this.$router.back()
      }
    }
  }
</script>
<style lang="less">
  .azm-product-category {
    .azm-header {
      .demo-chip {
        .mu-chip-delete-icon {
          width: 20px;
        }
      }
    }

  }
</style>

<style scoped lang="less">
  .azm-product-category {
    position: fixed;
    height: 100%;
    width: 100%;
    > .d-flex {
      width: 100%;
      height: 100%;
    }
    .azm-header {
      box-sizing: border-box;
      width: 100%;
      background-color: #fff;
      padding: 8px 0 8px 15px;
      margin-bottom: 12px;
      .col {
        line-height: 30px;
      }
      .azm-flex-left {
        width: 90px;
      }
      .demo-chip {
        line-height: 24px;
        margin-right: 5px;
        margin-bottom: 5px;
        font-size: 12px;
      }
    }
    .azm-section {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #fff;
      .azm-section-drawer {
        font-size: 12px;
        height: 100%;
        .azm-section-drawer {
          width: 105px;
        }
        .mu-drawer {
          width: 90px;
        }
        .azm-item-title {
          font-size: 12px;
          &.azm-item-title-active {
            color: #ff4919;
          }
        }
      }
      .azm-list-title {
        font-size: 32/2px;
        color: #ff4919;
        margin-bottom: 20px;
      }
      .azm-list-item {
        .azm-btn-item {
          border: 1px solid #d1d1d1;
          margin-bottom: 12px;
          margin-right: 15px;
          color: #d1d1d1;
          height: 30px;
          line-height: 30px;
          border-radius: 30px;
          min-width: 70px;
          &.azm-btn-item-active {
            border: none;
            background-color: #ff4919;
          }
        }
      }
    }
    .mu-flex {
      position: relative;
    }
    .azm-footer {
      width: 100%;
      padding: 12px 15px;
      background-color: #fff;
      .mu-button {
        margin-left: 5px;
        min-width: 75px;
        border: 1px solid #ff4919;
        font-size: 12px;
        &.azm-shelf-btn {
          background-color: #ff4919;
        }
      }
    }
  }
</style>
