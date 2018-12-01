<template>
  <div class="t-client-clientLabel">
    <swipeout>
      <swipeout-item transition-mode="follow" :disabled="+item.del_type === 1 && +item.edit_type === 1" v-for="(item, index) in tagList" :key="index">
        <div slot="right-menu">
          <swipeout-button :width="50" @click.native="deleteClick(item,index)" v-if="+item.del_type !== 1" type="primary">
            <img src="../../assets/client/delete.png" alt="">
          </swipeout-button>
          <swipeout-button :width="50" @click.native="editTages(item,index)" v-if="+item.edit_type !== 1" type="warn">
            <img src="../../assets/client/edit-square.png" />
          </swipeout-button>
        </div>
        <div class="swipeout-item-box" @click="activeFun(item)" slot="content" :class="{'vux-1px-t': index !== 0}">
          <span>{{ item.tag }}</span>
          <img v-show="clProductData.tag&& clProductData.tag.id===item.id" src="../../assets/client/checkedBox.png" />
        </div>
      </swipeout-item>
    </swipeout>
  </div>

</template>

<script>
import { isMerchantH5 } from "../../libs/util";
import { mapState } from "vuex";
import {
  GroupTitle,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  XButton
} from "vux";

export default {
  components: {
    GroupTitle,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XButton
  },
  computed: {
    ...mapState({
      clProductData: state => state.clProduct.clProductData
    })
  },
  inject: ["isMerchantH5", "appRefresh", "$$$setNarBar"],
  data() {
    return {
      isMerchantH5,
      disabled: false,
      show3: false,
      tagList: [],
      show: false,
      tag: {}
    };
  },
  watch: {},
  created() {
    this.$$$setNarBar({
      rightIcon: "add-o",
      rightBtn: this.addTages
    });
    this.refresh();
    //      this.getTag()
    this.$store.commit("System/setNarBarFun", { callback: this.refresh });
  },
  methods: {
    /**
     * 刷新数据
     * @param query
     */
    refresh({ query } = {}) {
      let that = this;
      if (query) {
        if (+query.status === 1 && query.data && query.data.id) {
          that.tagList.push(query.data);
          that.$vux.toast.show({
            text: query.msg || "添加成功",
            type: "success",
            isShowMask: true
          });
        } else if (+query.status === 0) {
          that.$vux.toast.show({
            text: query.msg || "添加失败",
            type: "cancel",
            isShowMask: true
          });
        }
      } else {
        this.getTag();
      }
    },
    // 选择标签
    activeFun: function(item) {
      if (this.clProductData.tag && this.clProductData.tag.id !== item.id) {
        this.clProductData.tag = item;
        this.$router.back();
      }
    },

    // 获取标签
    getTag() {
      let that = this;
      let member_id = this.$route.query.member_id;
      this.$store.dispatch("ApiService/getTag", { member_id }).finally(res => {
        console.log(res);
        if (1 === res.status) {
          that.tagList = res.info;
        } else {
          that.$toast.error(res.msg);
        }
      });
    },

    // 新增标签
    addTages() {
      let that = this;
      this.$vux.confirm.prompt("", {
        title: "新增标签",
        onCancel() {},
        onConfirm(e) {
          let tag = e;
          that.$store.dispatch("ApiService/getsetTag", { tag }).finally(res => {
            if (tag.length > 5) {
              that.$toast.error("标签字数不能超过5个");
              return;
            }
            if (1 === res.status && res.info.id) {
              that.tagList.push(res.info);
              that.$vux.toast.show({
                text: res.msg || "添加成功",
                type: "success",
                isShowMask: true
              });
            } else if (res.status === 0) {
              that.$vux.toast.show({
                text: res.msg || "添加失败",
                type: "cancel",
                isShowMask: true
              });
            }
          });
        }
      });
    },
    // 编辑标签
    editTages(item) {
      let that = this;
      this.$vux.confirm.setInputValue(item.tag);
      var id = item.id;
      this.$vux.confirm.prompt("", {
        title: "编辑标签",
        onCancel() {},
        onConfirm(e) {
          let tag = e;
          that.$store
            .dispatch("ApiService/setEditTag", { tag, id })
            .finally(res => {
              if (tag.length > 5) {
                that.$toast.error("标签字数不能超过5个");
                return;
              }
              if (1 === res.status) {
                item.tag = e;
                that.$forceUpdate();
                that.$vux.toast.show({
                  text: res.msg || "修改成功",
                  type: "success",
                  isShowMask: true
                });
              } else if (res.status === 0) {
                that.$vux.toast.show({
                  text: res.msg || "修改失败",
                  type: "cancel",
                  isShowMask: true
                });
              }
            });
        }
      });
    },

    // 删除标签
    deleteClick(item, index) {
      let that = this;
      console.log(item, 44444444444);
      let id = item.id;
      this.$store.dispatch("ApiService/getDelTag", { id }).then(res => {
        console.log(res);
        if (1 === res.status) {
          that.tagList.splice(index, 1);
        } else {
          that.$vux.toast.show({
            text: res.msg,
            type: "cancel",
            isShowMask: true
          });
        }
      });
    }
  }
};
</script>

<style scoped lang='less'>
.t-client-clientLabel {
  .vux-swipeout {
    margin-top: 20/2px;

    .vux-swipeout-item {
      .swipeout-item-box {
        padding: 12px 15px;
      }
      .vux-swipeout-content {
        position: relative;
        img {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translate(0, -50%);
          width: 30/2px;
          height: 30/2px;
        }
      }
      .vux-swipeout-button-box {
        .vux-swipeout-button-primary {
          background: #f25643;
          position: relative;
          img {
            width: 45/2px;
            height: 45/2px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -22/2px;
            margin-top: -22/2px;
          }
        }
        .vux-swipeout-button-warn {
          background: #2d81e4;
          position: relative;
          img {
            width: 45/2px;
            height: 45/2px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -22/2px;
            margin-top: -22/2px;
          }
        }
      }
    }
  }
}
</style>

<style lang='less'>
.t-client-clientLabel {
  .vux-swipeout {
    .vux-swipeout-item {
      .vux-swipeout-button-box {
        .vux-swipeout-button-primary {
          width: 90/2px;
        }
      }
    }
  }
}

.vux-confirm {
  .vux-x-dialog {
    .weui-dialog {
      width: 630/2px;
      height: 450/2px;
      border-radius: 20/2px;
      .weui-dialog__hd {
        font-size: 34/2px;
        color: #171f24;
        margin-bottom: 30/2px;
      }
      .vux-prompt {
        .vux-prompt-msgbox {
          border-bottom: 1px solid #e5e5e5;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          text-align: center;
        }
      }
      .weui-dialog__ft:after {
        border: 0;
      }
      .weui-dialog__ft {
        display: flex;
        margin-top: 30px;
        .weui-dialog__btn_default {
          height: 80/2px;
          border: 0;
          font-size: 32/2px;
          color: #2d81e4;
          border: 1px solid #2d81e4;
          border-radius: 10/2px;
          text-align: center;
          display: block;
          line-height: 80/2px;
          margin-left: 30px;
          margin-right: 30px;
        }
        .weui-dialog__btn_primary {
          height: 80/2px;
          border: 0;
          font-size: 32/2px;
          color: #ffffff;
          background: #2d81e4;
          border-radius: 10/2px;
          text-align: center;
          display: block;
          line-height: 80/2px;
          margin-right: 30px;
        }
      }
    }
  }
}
</style>


