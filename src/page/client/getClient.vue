<template>
  <div class="t-client-getClient">
    <div class="clientList">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loadedAll" @load="load">
        <template v-for="(val, i) in consumeList">
          <div class="t-clientList" v-for="(item, index) in val" :key="item.id">
            <div v-if="+$route.query.type === 2" class="t-checked" :class="{'t-checked2':item.checked}"
                 @click="chooseOrder(item)"></div>
            <div class="t-clientImg">
              <azm-avatar :src="item.avatar" shape="round"></azm-avatar>
              <img v-if="item.sex==='0'" class="t-sex" src="../../assets/client/icon-girl.png" alt="">
              <img v-if="item.sex==='1'" class="t-sex" src="../../assets/client/icon-boy.png" alt="">
            </div>
            <div class="t-clientInfo">
              <div class="">
                <div class="t-clientName">
                  <span>{{item.nickname}}</span>
                </div>
                <div class="t-phone">{{item.telephone}}</div>
              </div>
              <div v-if="!show" class="t-telephone" @click="SetCustomer(item)">
                <img src="../../assets/client/icon-add.png" alt="">
              </div>
            </div>

            <div class="t-border-bottom"></div>
          </div>
        </template>
      </mu-load-more>
    </div>
  </div>
</template>

<script>
  import { isMerchantH5 } from '../../libs/util'
  import Avatar from '../../components/avatar/index.vue'
  import { LoadMore, Paper, Badge } from 'muse-ui'
  import { mapState } from 'vuex'

  export default {
    components: {
      [Avatar.name]: Avatar,
      [Badge.name]: Badge,
      [Paper.name]: Paper,
      [LoadMore.name]: LoadMore
    },
    computed: {
      ...mapState({
        tcProductData: state => state.tcProduct.tcProductData
      })
    },
    inject: ['$$$setNarBar'],
    data () {
      return {
        isMerchantH5: isMerchantH5,
        consumeList: [],
        show: false,
        member_id: [],
        num: 10,
        page: 1,
        member_id: 0,
        refreshing: false,
        loading: false,
        loadedAll: false
      }
    },
    watch: {},
    created () {
      let that = this
      this.setType(this.$route.query.type)
      this.member_id = this.$route.query.member_id
      this.$nextTick(function () {
        this.refresh()
      })
      this.$navigation.on('replace', (to, from) => {
        let type = that.$route.query.type
        console.log(type, 'replace')
        that.setType(type)
      })
    },

    methods: {
      setType (type) {
        let that = this
        this.$$$setNarBar({
          rightText: +type === 2 ? '确定' : '多选',
          rightBtn: function () {
            that.showChecked(+type === 2 ? 1 : 2)
          }
        })
        if (+type === 1) {
          this.affirmSelect()
        }
      },
      refresh () {
        this.refreshing = true
        try {
          this.getListCustomer().finally(res => {
            this.refreshing = false
          })
        } catch (err) {
          this.refreshing = false
        }
      },
      load () {
        this.loading = true
        let page = this.page
        this.getListCustomer({page: page})
      },
      // 切换按钮
      showChecked (type) {
        let t = this.$route.query.type
        if (+t !== type) {
          this.$router.replace({path: '/client_getClient', query: {type}})
        }
      },
      chooseOrder (item) {
        item.checked = !item.checked
        this.$forceUpdate()
      },
      //      提交数据
      affirmSelect () {
        let that = this
        let member_id = []
        that.show = false
        let arr = that.util.pagingConcat(this.consumeList)
        let type = this.$route.query.type
        for (let v of arr) {
          if (v.checked && that.util.trim(v.member_id)) {
            member_id.push(v.member_id)
          }
        }
        if (member_id && member_id.length > 0) {
          this.$store.dispatch('ApiService/getSetListCustomer', {member_id: member_id.join(',')}).finally(res => {
            if (1 === res.status) {
              that.$router.back()
            } else {
              that.$toast.error(res.msg)
            }
          })
        } else if (type > 0) {
          that.$toast.message('至少选择一个~')
        }
        that.showChecked()
      },

      // 获取导客数据
      getListCustomer ({page = 1} = {}) {
        let that = this
        let member_id = this.member_id
        if (this.isGetConsume) return
        this.isGetConsume = true
        return this.$store
          .dispatch('ApiService/getListCustomer', {page})
          .finally(res => {
            this.loading = false
            this.isGetConsume = false
            if (1 === res.status) {
              let info = res.info
              if (info.length > 0) {
                if (page === 1) {
                  that.consumeList = [info]
                } else {
                  that.consumeList[`${page - 1}`] = info
                }
                that.page = page + 1
                that.loadedAll = info.length !== 10
              } else if (info.length === 0) {
                if (page > 1) {
                  that.page = pagep - 1
                } else {
                  that.consumeList = []
                }
                that.loadedAll = true
              }
            }
          })
      },

      SetCustomer (item) {
        console.log(item, 444444444)
        var member_id = item.member_id
        this.$store
          .dispatch('ApiService/getSetListCustomer', {member_id})
          .then(res => {
            console.log(res)
            if (1 === res.status) {
              this.$toast.warning('添加客户成功')
              this.getListCustomer()
            }
          })
      }
    }
  }
</script>

<style scoped lang='less'>
  .t-client-getClient {
    .clientList {
      .t-clientList:first-child {
        margin-top: 20/2px;
      }
      .t-clientList {
        padding: 30/2px;
        background: #ffffff;
        position: relative;
        align-items: center;
        box-sizing: border-box;
        display: flex;
        .t-checked {
          width: 32/2px;
          height: 32/2px;
          margin-right: 30/2px;
          background: url(../../assets/client/checkedBox-img.png) no-repeat;
          background-size: 100%;
          // img {
          //   width: 30/2px;
          //   height: 30/2px;
          // }
        }
        .t-checked2 {
          width: 32/2px;
          height: 32/2px;
          margin-right: 30/2px;
          background: url(../../assets/client/checkedBox.png) no-repeat;
          background-size: 100%;
        }
        .t-clientImg {
          width: 90/2px;
          height: 90/2px;
          border-radius: 50%;
          margin-right: 30/2px;
          position: relative;
          display: flex;

          .t-sex {
            width: 35/2px;
            height: 35/2px;
            position: absolute;
            bottom: -5px;
            right: 0;
          }
          img {
            width: 90/2px;
            height: 90/2px;
            border-radius: 50%;
          }
        }
        .t-clientInfo {
          flex: 1;
          display: flex;
          justify-content: space-between;
          .t-clientName {
            display: flex;
            align-items: center;
            > span {
              font-size: 36/2px;
              color: #171f24;
              font-weight: 500;
              margin-right: 42/2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .t-phone {
            font-size: 26/2px;
            color: #aab2b7;
          }
          .t-telephone {
            width: 55/2px;
            height: 55/2px;
            line-height: 63px;
            img {
              width: 55/2px;
              height: 55/2px;
            }
          }
        }
        .t-border-bottom {
          position: absolute;
          border: 1/2px solid #e5e5e5;
          width: 570/2px;
          bottom: 0;
          left: 152/2px;
        }
      }
    }
  }
</style>

