<template>
    <div class="t-tcSepecialty">
        <div class="t-fill">
            <span>填写职称：</span>
            <!-- <input type="text" name="name" id="" placeholder="直接填写或选择下列推荐标签" v-model="type_name"> -->
            <x-input type='text' v-model="type_name" placeholder="直接填写或选择下列推荐标签" :show-clear="false" :max="7"></x-input>

        </div>

        <div class="t-tags">
            <div class="t-tagsTitle">
                <span></span>
                <span>推荐专业</span>
            </div>
            <div  v-for="(item,index) in categoryList " :key="index" class="t-label" @click="clickLabel(item)">{{item.title}}</div>
        </div>
        <div class="t-submit" @click="getSubmit">提交</div>
    </div>
</template>

<script>
import { XInput } from "vux";
import { mapState } from "vuex";
export default {
  components: {
    XInput
  },
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  data() {
    return {
      categoryList: [],
      name: "",
      type_name: ""
    };
  },
  watch: {},
  created() {
    this.getTechnicianCategory();
  },
  methods: {
    clickLabel(item) {
      let that = this;
      var title = item.title;
      that.type_name = title;
    },

    // 获取技师类别
    getTechnicianCategory() {
      let that = this;
      this.$store.dispatch("ApiService/getTechnicianCategory", {}).then(res => {
        console.log(res);
        if (1 === res.status) {
          that.categoryList = res.info;
        }
      });
    },

    // 点击提交
    getSubmit() {
      let that = this;
      that.tcProductData.type_name = that.type_name;
      this.$router.back();
    }
  }
};
</script>

<style scoped lang='less'>
.t-tcSepecialty {
  .t-fill {
    height: 90/2px;
    background-color: #ffffff;
    border-top: solid 1px #eeeeee;
    border-bottom: solid 1px #eeeeee;
    display: flex;
    padding-left: 30/2px;
    padding-right: 30/2px;
    align-items: center;
    > span {
      font-size: 32/2px;
      color: #282828;
    }
    > input {
      width: 70%;
      height: 100%;
      font-size: 30/2px;
      border: 0;
    }
  }
  .t-tags {
    margin-left: 30/2px;
    margin-top: 80/2px;
    .t-tagsTitle {
      display: flex;
      align-items: center;
      font-size: 32/2px;
      color: #282828;
      > span:first-child {
        width: 6/2px;
        height: 23/2px;
        background-color: #ff4919;
        border-radius: 2px;
        margin-right: 14/2px;
      }
    }
    .t-label {
      line-height: 52/2px;
      text-align: center;
      height: 56/2px;
      border-radius: 5/2px;
      border: solid 1px #999999;
      padding-left: 30/2px;
      padding-right: 30/2px;
      display: inline-block;
      margin-right: 20/2px;
      margin-top: 20/2px;
    }
  }

  .t-submit {
    height: 100/2px;
    background-image: linear-gradient(90deg, #35abfe 0%, #3d70f7 100%),
      linear-gradient(#3d70f7, #3d70f7);
    background-blend-mode: normal, normal;
    width: 100%;
    font-size: 36/2px;
    color: #ffffff;
    text-align: center;
    line-height: 100/2px;
    position: fixed;
    bottom: 0;
  }
}
</style>



<style  lang='less'>
.t-fill {
  .vux-x-input {
    padding: 0;
    height: 100%;
    font-size: 30/2px;
    width: 70%;
  }
}
</style>
