<template>
  <div class="azm-results-ranking">
    <azm-results-date-filter v-model="resultsDateFilter" format="YYYY-MM-DD"
                             @onChange="resultsDateFilterChange"
                             @onCancel="resultsDateFilterCancel"></azm-results-date-filter>
    <mu-tabs class="van-hairline--bottom azm-tabs" :value.sync="tabActive" color="#2D81E4" indicatorColor="#2D81E4"
             textColor="#2D81E4" center inverse @change="tabsChange">
      <mu-tab :to="{path:'/results_ranking/1',params:{type:1}}" replace>
        <div class="azm-tab-box">服务</div>
      </mu-tab>
      <mu-tab :to="{path:'/results_ranking/2',params:{type:2}}" replace>
        <div class="azm-tab-box">卡项</div>
      </mu-tab>
    </mu-tabs>
    <section>
      <mu-slide-left-transition>
        <azm-ranking-list :lists="serviceList"
                          v-show="$route.params.type == 1" @load="listLoad" @refresh="refreshData"></azm-ranking-list>
      </mu-slide-left-transition>
      <mu-slide-right-transition>
        <azm-ranking-list :lists="CardItemList"
                          v-show="$route.params.type == 2" @load="listLoad" @refresh="refreshData"></azm-ranking-list>
      </mu-slide-right-transition>
    </section>
  </div>
</template>

<script>
  import { DateInput, Button, Menu } from 'muse-ui'
  import Avatar from '../../components/avatar/index.vue'
  import resultsDateFilter from '../../view-render/results-date-filter.vue'
  import rankingList from './ranking-list.vue'

  import { XInput, PopupPicker, Actionsheet, dateFormat } from 'vux'
  import { mapState } from 'vuex'
  export default {
    components: {
      [rankingList.name]: rankingList,
      [resultsDateFilter.name]: resultsDateFilter,
      [Avatar.name]: Avatar
    },
    data(){
      let type = this.$route.params.type || 0
      return {
        tabActive: type > 0 ? type - 1 : 0,
        dateTime: [],
        serviceList: [],
        CardItemList: [],
        text: '店铺综合排名：第3名'
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        AchievementRuank: state => state.ApiService.AchievementRuank,
        resultsDateFilter: state => state.vux.resultsDateFilter
      })
    },
    watch: {},
    created() {
      this.refreshData()
    },
    methods: {
      refreshData({p = 1} = {}){
        let that = this;
        let start_time = dateFormat(this.resultsDateFilter.start_time, 'YYYY-MM-DD');
        let end_time = dateFormat(this.resultsDateFilter.end_time, 'YYYY-MM-DD');
        let type = this.resultsDateFilter.type;
        let status = this.$route.params.type;
        if (type === 0) {
          type = 2
        }
        this.$store.dispatch('ApiService/AchievementRuank', {type, start_time, end_time, status, p}).finally(res => {
          if (res.status === 1) {
            let type = that.$route.params.type
            let list = that.AchievementRuank[type]
            if (type == 1) {
              that.serviceList = list
            } else if (type == 2) {
              that.CardItemList = list
            }
          }
        })
      },
      resultsDateFilterChange(e){
        this.refreshData()
        console.log(e)
      },
      resultsDateFilterCancel(e){
        console.log(e)
      },
      tabsChange(e){
        this.refreshData()
        console.log(e)
      },
      listLoad(e){

      },

    }
  }
</script>

<style lang="less" scoped>
  .azm-results-ranking {
    .azm-tabs {
      width: 100%;
      background-color: #fff;
      color: #282828;
    }
    .mu-tab {
      font-size: 32/2px;
      color: #171F24;
      font-weight: 500;
    }
    section {
      position: relative;
      .azm-ranking-list {
        position: relative;
        top: 0;
        left: 0;
        &.mu-slide-left-transition-leave-active, &.mu-slide-right-transition-leave-active {
          position: absolute;
        }
      }

    }
  }

</style>
