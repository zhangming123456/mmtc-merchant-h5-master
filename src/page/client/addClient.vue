<template>
  <div class="t-client-addClient">
    <group class="t-clientForm">
      <x-input title='客户名' placeholder="请输入客户的姓名" :max="6" v-model="clProductData.username"
               text-align="right"></x-input>
      <x-input title='手机号码' is-type="china-mobile" :max="11" type="tel" v-model="clProductData.telephone"
               placeholder="请输入客户的手机号码" text-align="right"></x-input>
      <popup-picker title="性别" :data="sexList" :show-name="true" :columns="1" v-model="clProductData.sex"
                    @on-show="onShow" @on-hide="onHide" @on-change="onChange"></popup-picker>
      <cell title="生日" is-link @click.native="birthdayDateTime(clProductData.birthday)">
        <span class="birthdayColor" v-if="clProductData.birthday">{{clProductData.birthday}}</span>
        <span v-else>请选择客户的生日</span>
      </cell>
      <cell is-link link="/client_clientLabel" title="客户标签">
        <template v-if="clProductData.tag && clProductData.tag.id">
          <span class="tagColor">{{clProductData.tag.tag}}</span>
        </template>
        <span v-else>请选择客户的标签</span>
      </cell>
      <x-input title='工作单位' v-model="clProductData.company" placeholder="请输入客户的工作单位" text-align="right"></x-input>
      <x-input title='职位' v-model="clProductData.position" placeholder="请输入客户的职位" text-align="right"></x-input>
      <x-input title='联系地址' v-model="clProductData.address" placeholder="请输入客户的联系地址" text-align="right"></x-input>
      <div class="t-demand">
        <span>特殊需求</span>
        <x-textarea :max="150" placeholder="请输入客户的特殊需求" autosize text-align="right" v-model="clProductData.special"
                    @on-focus="onEvent('focus')" @on-blur="onEvent('blur')">
        </x-textarea>
      </div>
    </group>

    <div class="t-doSubmit" @click="doSubmit">确认</div>
  </div>
</template>

<script>
  import { isMerchantH5 } from "../../libs/util";
  import { mapState } from "vuex";
  import {
    XInput,
    XTextarea,
    PopupPicker,
    XButton,
    XSwitch,
    Group,
    Cell,
    dateFormat
  } from "vux";

  export default {
    components: {
      Group,
      Cell,
      PopupPicker,
      XInput,
      XButton,
      XTextarea
    },
    computed: {
      ...mapState({
        clProductData: state => state.clProduct.clProductData
      })
    },
    data () {
      return {
        isMerchantH5,
        sexList: [
          {
            name: "女",
            value: "0"
          },
          {
            name: "男",
            value: "1"
          }
        ],
        format: function (value, name) {
          return `${value[0]}:${value[1]}`;
        }
      };
    },
    watch: {},
    created () {
      this.getCustomerInfo();
    },

    methods: {
      // 获取客户信息
      getCustomerInfo () {
        let id = this.$route.query.id;
        let that = this;
        if (id) {
          this.$store.commit("vux/setNavigationBarTitle", {
            title: "客户信息修改"
          });

          this.$store
            .dispatch("ApiService/getCustomerInfo", {id})
            .finally(res => {
              if (1 === res.status) {
                if (res.info.username) {
                  that.clProductData.username = res.info.username;
                }
                if (res.info.telephone) {
                  that.clProductData.telephone = res.info.telephone;
                }
                if (res.info.birthday) {
                  that.clProductData.birthday = res.info.birthday;
                }
                if (res.info.sex) {
                  that.clProductData.sex = [res.info.sex + ""];
                }
                if (res.info.tag) {
                  that.clProductData.tag = res.info.tag;
                }

                if (res.info.position) {
                  that.clProductData.position = res.info.position;
                }
                if (res.info.company) {
                  that.clProductData.company = res.info.company;
                }
                if (res.info.address) {
                  that.clProductData.address = res.info.address;
                }
                if (res.info.special) {
                  that.clProductData.special = res.info.special;
                }
              } else {
                that.$toast.warning(res.msg);
              }
            });
        } else {
          that.clProductData.username = "";
          that.clProductData.telephone = "";
          that.clProductData.sex = ["0"];
          that.clProductData.birthday = "";
          that.clProductData.tag = {};
          that.clProductData.company = "";
          that.clProductData.position = "";
          that.clProductData.address = "";
          that.clProductData.special = "";
        }
      },

      // 新增客户||修改客户
      doSubmit () {
        let that = this;
        let regExp = that.util.regExp;
        let username = that.clProductData.username;
        let birthday = that.clProductData.birthday;
        let company = that.clProductData.company;
        let position = that.clProductData.position;
        let special = that.clProductData.special;
        let telephone = that.clProductData.telephone;
        let address = that.clProductData.address;

        let tag = that.clProductData.tag;
        let sex = that.clProductData.sex[0];
        let member_id = this.$route.query.member_id;
        let id = this.$route.query.id;

        if (!username) {
          this.$toast.warning("客户名字不能为空~");
          return;
        }
        if (!regExp.isPhone(telephone)) {
          this.$toast.warning("客户手机号不能为空~");
          return;
        }
        let data = {
          username,
          birthday,
          company,
          position,
          special,
          telephone,
          tag: tag.id,
          sex,
          address
        };
        if (id) {
          data.id = id;
        }
        this.$store.dispatch("ApiService/grtSetCustomer", data).finally(res => {
          if (1 === res.status) {
            that.$router.back();
          } else {
            that.$toast.error(res.msg);
          }
        });
      },

      // 客户生日选择器
      birthdayDateTime (val) {
        let that = this;
        let toDay = dateFormat(new Date(), "YYYY-MM-DD");
        this.$vux.datetime.show({
          value: val, // 其他参数同 props
          confirmText: "确认",
          cancelText: "取消",
          endDate: toDay,
          minYear: 1700,
          onConfirm (value) {
            that.clProductData.birthday = value;
          }
        });
      },

      onChange (val) {
        console.log("val change", val);
      },

      onShow () {
        console.log("on show");
      },
      onHide (type) {
        console.log("on hide", type);
      },

      onEvent (event) {
        console.log("on", event);
      },

      onConfirm (value, index) {
        console.log(`当前值：${value}, 当前索引：${index}`);
        this.show = !this.show;
      }
    }
  };
</script>

<style scoped lang='less'>
  .t-client-addClient {
    .t-clientForm {
      width: 100%;
      box-sizing: border-box;
      .t-demand {
        padding-left: 30/2px;
        padding-right: 30/2px;
        box-sizing: border-box;
        border-top: 1px solid #e5e5e5;
        span {
          font-size: 28/2px;
          color: #333333;
        }
        .vux-x-textarea {
          padding: 0;
          margin-top: 15/2px;
        }
        .weui-cell:before {
          border: none;
        }
      }

      .weui-cells {
        .weui-cell {
          .weui-cell__ft {
            .birthdayColor {
              font-size: 28/2px;
              color: #333333;
            }
            .tagColor {
              font-size: 28/2px;
              color: #333333;
            }
          }
        }
      }
    }

    .t-doSubmit {
      background: #2d81e4;
      border-radius: 10/2px;
      width: 690/2px;
      height: 80/2px;
      font-size: 32/2px;
      color: #ffffff;
      position: fixed;
      bottom: 30/2px;
      line-height: 80/2px;
      text-align: center;
      margin-left: 30/2px;
    }
  }
</style>

<style lang='less'>
  .t-client-addClient {
    .t-clientForm {
      .weui-cell {
        font-size: 28/2px;
      }
      .vux-cell-box {
        font-size: 28/2px;
        .weui-cell_access .weui-cell__ft:after {
          width: 15/2px;
          height: 15/2px;
        }
        .weui-cell {
          .vux-cell-primary {
            .vux-popup-picker-select {
              .vux-cell-value {
                font-size: 28/2px;
                color: #333333;
              }
            }
          }
        }
      }
      .vux-x-input {
        font-size: 28/2px;
        .weui-cell__bd {
          color: #aab2b7;
          .weui-input {
            color: #333333;
          }
        }
      }
      .vux-datetime {
        font-size: 28/2px;
      }
    }
  }

  .dp-container {
    .dp-header {
      font-size: 28/2px;
      color: #2d81e4;
      .dp-item {
        font-size: 28/2px;
        color: #2d81e4;
      }
    }
  }

  .vux-popup-picker {
    background: #ffffff;
    .vux-popup-header {
      background: #ffffff;
      .vux-popup-header-left {
        font-size: 28/2px;
        color: #2d81e4;
      }
      .vux-popup-header-right {
        font-size: 28/2px;
        color: #2d81e4;
      }
    }
    .vux-popup-picker-container {
      background: #ffffff;
    }
    .vux-picker {
      .vux-flexbox {
        height: 210px;
      }
    }
  }
</style>

