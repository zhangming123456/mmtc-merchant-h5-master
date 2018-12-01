<template>
    <div class="t-tcAddlabel">
        <div class="t-labelContent">
            <!-- <input type="text" placeholder="例：“美甲美睫”“皮肤管理”等领域标签。" v-model="tags"> -->
            <x-input type='text' v-model="tags" placeholder="例：“美甲美睫”“皮肤管理”等领域标签。" :show-clear="false" :max="7"></x-input>
            
        </div>
        <div class="t-affirm" @click="getSubmit">
            确定
        </div>
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
      tags: ""
    };
  },
  watch: {},
  created() {},
  methods: {
    // 点击确认
    getSubmit() {
      let that = this;
      let flag = false;
      let text = that.util.trim(that.tags);
      for (let v of that.tcProductData.tags) {
        if (v === text) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        that.tcProductData.tags.push(that.tags);
        this.$router.back();
      } else {
        that.$toast.error("标签重复~");
      }
    }
  }
};
</script>

<style scoped lang='less'>
.t-tcAddlabel {
  .t-labelContent {
    width: 680/2px;
    height: 468/2px;
    background-color: #ffffff;
    padding: 30/2px;
    box-sizing: border-box;
    text-align: center;
    margin: 0 auto;
    border-radius: 10/2px;
    margin-top: 60/2px;
    > input {
      border: 0;
      width: 100%;
      font-size: 30/2px;
    }
  }

  .t-affirm {
    width: 680/2px;
    height: 100/2px;
    background-image: linear-gradient(90deg, #35abfe 0%, #3d70f7 100%),
      linear-gradient(#3d70f7, #3d70f7);
    background-blend-mode: normal, normal;
    border-radius: 10/2px;
    margin: 0 auto;
    margin-top: 50/2px;
    color: #ffffff;
    font-size: 36/2px;
    text-align: center;
    line-height: 100/2px;
  }
}
</style>

<style lang='less'>
.t-labelContent {
  .vux-x-input {
    padding: 0;
    font-size: 30/2px;
  }
}
</style>

