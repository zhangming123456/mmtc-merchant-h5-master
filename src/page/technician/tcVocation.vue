<template>
  <div class="t-tcVocation">
    <div>
      <div v-for="(items,index) in vocationList" :key="index" class="t-label" @click="activeFun(items)">
        <span :class="{blue: category_title1.id===items.id}"> {{items.title}}</span>
        <img v-show="category_title1.id===items.id" src="../../assets/cooperation-icon/checked_2.png" alt="">
      </div>
    </div>

    <div class="t-bottom">
      <div @click="doCancel">取消</div>
      <div @click="gotoManage($event)">确定</div>
    </div>
  </div>
</template>

<script>
import { Row, Col, Cell, CellGroup, Icon } from "vant";
import { mapState } from "vuex";

export default {
  components: {},
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  data() {
    return {
      vocationList: [],
      ins: "",
      category_title1: ""
    };
  },
  watch: {},
  created() {
    this.getTechnicianMajor();
  },

  methods: {
    activeFun: function(items) {
      this.category_title1 = items;
    },

    // 获取技师职称
    getTechnicianMajor() {
      this.$store.dispatch("ApiService/getTechnicianMajor", {}).then(res => {
        console.log(res);
        if (1 === res.status) {
          this.vocationList = res.info;
        }
      });
    },

    // 点击确认
    gotoManage(e) {
      var that = this;
      that.tcProductData.category_title1 = that.category_title1;
      this.$router.back();
    },

    // 点击取消返回
    doCancel() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang='less'>
.t-tcVocation {
  .t-label {
    height: 90/2px;
    background-color: #ffffff;
    border-bottom: solid 1px #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #282828;
    font-size: 32/2px;
    padding-left: 30/2px;
    padding-right: 30/2px;
    box-sizing: border-box;
    .blue {
      color: #3d70f7;
      font-size: 32/2px;
    }
    > img {
      width: 35/2px;
      height: 35/2px;
    }
  }

  .t-bottom {
    height: 100/2px;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    > div:first-child {
      width: 50%;
      height: 100%;
      background-color: #ffffff;
      border-top: solid 1px #e5e5e5;
      color: #666666;
      font-size: 36/2px;
      line-height: 100/2px;
      text-align: center;
    }
    > div:last-child {
      width: 50%;
      height: 100%;
      font-size: 36/2px;
      color: #ffffff;
      background-image: linear-gradient(90deg, #35abfe 0%, #3d70f7 100%),
        linear-gradient(#3d70f7, #3d70f7);
      background-blend-mode: normal, normal;
      line-height: 100/2px;
      text-align: center;
    }
  }
}
</style>
