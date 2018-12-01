/
<template>
  <div class="t-tcDetails">
    <div class="t-tcName">
      <span>技师姓名</span>
      <!-- <input type="text" placeholder="输入姓名" v-model="tcProductData.username"> -->
        <x-input type='text' v-model="tcProductData.username" placeholder="输入姓名"
                 :show-clear="false" :max="7"></x-input>
    </div>
    <div class="t-experience">
      <span>工作经验</span>
      <div>
        <!-- <input type='number' placeholder="请输入技师工作年限" v-model="tcProductData.working_year"> -->
        <x-input type='tel' v-model="tcProductData.working_year" placeholder="请输入技师工作年限" pattern="\d*"
                 :show-clear="false" :max="2"></x-input>
      </div>
      <span>年</span>
    </div>

    <div class="t-gender">
      <span>性别</span>
      <van-radio-group v-model="tcProductData.sex">
        <van-radio name="0">
          <span v-if="tcProductData.sex==='0'" class="hue">女</span>
          <span v-else>女</span>
        </van-radio>
        <van-radio name="1">
          <span v-if="tcProductData.sex==='1'" class="hue">男</span>
          <span v-else>男</span></van-radio>
      </van-radio-group>
    </div>
    <div class="t-tcPhoto">
      <span>技师头像</span>
      <div>
        <div class="t-tcimage">
          <vue-core-image-upload style="width:100%;  height: 100%;" ref="imgUpload" :class="['btn', 'btn-primary']"
                                 inputOfFile="_file_" :crop="false"
                                 :data="{}"
                                 :multiple="false" :credentials="true" :max-file-size="1024*1024*6"
                                 :compress="30" :isXhr="isXhr" :url="url" @imageuploaded="imageuploaded"
                                 @imagechanged="imagechanged"
                                 @errorhandle="errorhandle" @imageuploading="imageuploading">
                <azm-avatar :src="tcProductData.avatar" shape="round"></azm-avatar>
            </vue-core-image-upload>
        </div>
        <img src="../../assets/cooperation-icon/add_arrow.png" alt="">
      </div>
    </div>
    <div class="t-vocation">
      <van-cell title="所属行业" is-link to="/technician_tcVocation">
        <span class="text333" v-if="tcProductData.category_title1.title">{{tcProductData.category_title1.title}}</span>
        <span v-else>设置</span>
      </van-cell>
    </div>
    <div class="t-vocation">
      <van-cell title="技师职称" is-link to="/technician_tcSpecialty">
        <span class="text333" v-if="tcProductData.type_name">{{tcProductData.type_name}}</span>
        <span v-else>设置</span>
      </van-cell>
    </div>

    <div class="t-skilled">
      <div class="t-skilledTitle">
        <span>擅长领域</span>
        <span>最多5个</span>
      </div>
      <div class="t-label">
        <div class="t-addLabel" @click="gotoAddLabel">+</div>
        <div class="t-labelContnet" v-for="(item,index) in tcProductData.tags" :key='index'>
          <span class="text333" v-if="item">{{item}}</span>
          <img @click="deleteLabel(index)" src="../../assets/cooperation-icon/delete.png" alt="">
        </div>
      </div>
    </div>

    <div class="t-introduce">
      <span>技师简介</span>
      <mu-container>
        <mu-text-field solo v-model="tcProductData.intro" placeholder="写下简介，可以包含职业/活动经验，服务艺人等~" multi-line :rows="3"
                       :max-length="120"></mu-text-field>
        <br/>
      </mu-container>
    </div>

    <div class="t-bottom">
      <div @click="doDelete">删除</div>
      <div @click=" doSubmit">提交</div>
    </div>
  </div>
</template>

<script>
import {
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Field,
  CheckboxGroup,
  Checkbox,
  Icon
} from "vant";
import { XInput, Group } from "vux";
import VueCoreImageUpload from "vue-core-image-upload";
import Avatar from "../../components/avatar/index.vue";
import config from "../../libs/config";
import { mapState } from "vuex";
export default {
  components: {
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Avatar.name]: Avatar,
    XInput,
    Group,
    VueCoreImageUpload
  },
  computed: {
    ...mapState({
      tcProductData: state => state.tcProduct.tcProductData
    })
  },
  data() {
    return {
      value: "",
      category_title: "",
      typeName: "",
      id: "",
      message: "",
      covers: "",
      isXhr: true,
      loading: null,
      url: config.upImageUrl
    };
  },
  watch: {},
  created() {
    this.getTechnicianInfo();
    this.$nextTick(function() {
      let $ = this.$azm.Zepto;
      let dom = $("input[type='file']");
      if (this.$device.isAndroid) {
        dom.attr("accept", "image/*");
        if (this.$device.isWechat || window.mmtc_environment == 2) {
          dom.attr("capture", "camera");
        } else {
          dom.removeAttr("capture");
        }
      } else {
        dom.attr("accept", "image/jpg,image/jpeg,image/png,image/gif");
        dom.removeAttr("capture");
      }
    });
  },
  methods: {
    // 技师头像上传
    imageuploaded(res) {
      console.log(res, "imageuploaded");
      this.loading && this.loading.close();
      try {
        let long_url = res.info;
        if (res.status === 1) {
          this.$toast.message("上传成功");
          this.tcProductData.avatar = long_url;
        } else {
          this.$toast.error(JSON.stringify(res.info) || "上传失败");
        }
      } catch (err) {
        this.$toast.error("上传失败");
      }
    },
    imageuploading(e) {
      console.log(e, "imageuploading");
      this.loading = this.$loading({
        text: "上传中。。。"
      });
    },
    imagechanged(e) {
      console.log(e, "imagechanged");
    },
    errorhandle(e) {
      console.log(e, "errorhandle");
      this.$toast.error(e);
    },
    // 删除技师标签
    deleteLabel(index) {
      this.tcProductData.tags.splice(index, 1);
    },

    // 限制擅长领域的长度
    astrictLabel() {},

    // 获取技师详情
    getTechnicianInfo() {
      let that = this;
      var id = this.$route.query.id;
      if (!that.$route.meta.keepAlive2) return;
      that.tcProductData.avatar = "";
      that.tcProductData.username = "";
      that.tcProductData.working_year = "";
      that.tcProductData.category_title1 = "";
      that.tcProductData.type_name = "";
      that.tcProductData.tags = [];
      that.tcProductData.intro = "";
      that.tcProductData.sex = "";
      if (id) {
        this.$store
          .dispatch("ApiService/getTechnicianInfo", { id })
          .then(res => {
            console.log(res);
            if (1 === res.status) {
              let that = this;
              var tagsLength = res.info.tags;
              let label = [];
              for (let v of tagsLength) {
                label.push(v.title);
              }
              that.tcProductData.avatar = res.info.avatar;
              that.tcProductData.username = res.info.username;
              that.tcProductData.working_year = res.info.working_year;
              that.tcProductData.category_title1 = res.info.category_title1;
              that.tcProductData.category_title = res.info.category_title;
              that.tcProductData.type_name = res.info.type_name;
              that.tcProductData.tags = that.util.unique(label);
              that.tcProductData.intro = res.info.intro;
              that.tcProductData.sex = res.info.sex;
            }
          });
      }
    },

    // 新增技师喝编辑技师
    doSubmit() {
      let that = this;
      let tcProductData = this.tcProductData;
      var tagsLength = that.tcProductData.tags.length;
      if (tagsLength > 5) {
        this.$toast.warning("擅长领域不能超过5个哦~");
        return;
      }
      if (!tcProductData.username) {
        this.$toast.warning("技师姓名不能为空");
        return;
      }
      if (!tcProductData.working_year) {
        this.$toast.warning("技师工作年限不能为空");
        return;
      }
      if (!tcProductData.category_title1) {
        this.$toast.warning("所属行业不能为空");
        return;
      }
      if (!tcProductData.type_name) {
        this.$toast.warning("技师职称不能为空");
        return;
      }
      if (!tcProductData.intro) {
        this.$toast.warning("技师简介不能为空");
        return;
      }
      if (!tcProductData.avatar) {
        this.$toast.warning("技师头像不能为空");
        return;
      }
      var username = that.tcProductData.username;
      var working_year = that.tcProductData.working_year;
      var technician_category = that.tcProductData.category_title1.id;
      var type_name = that.tcProductData.type_name;
      var intro = that.tcProductData.intro;
      var tags = [];
      var sex = that.tcProductData.sex;
      var avatar = that.tcProductData.avatar;
      var id = this.$route.query.id;
      for (let v of that.tcProductData.tags) {
        tags.push({ title: v });
      }

      let data = {
        username,
        technician_category,
        type_name,
        intro,
        tags,
        working_year,
        sex,
        avatar
      };
      if (id) {
        data.id = id;
      }
      this.$store
        .dispatch("ApiService/getTechnicianSave", data)
        .finally(res => {
          if (1 === res.status) {
            this.$router.back();
          } else {
            that.$toast.error(res.msg);
          }
        });
    },

    // 删除技师
    doDelete() {
      let that = this;
      var id = that.$route.query.id;
      if (id) {
        this.$confirm("确定删除技师？", "提示", {}).then(({ result }) => {
          if (result) {
            console.log(111111111111111);
            var id = this.$route.query.id;
            var shop_id = this.$route.query.shop_id;
            this.$store
              .dispatch("ApiService/getTechnicianDel", { id, shop_id })
              .then(res => {
                console.log(res);
                if (1 === res.status) {
                  this.$router.back();
                }
              });
          } else {
            this.$router.back();
          }
        });
      } else {
        this.$router.back();
      }
    },

    // 跳转到添加技师标签
    gotoAddLabel() {
      let that = this;
      var labelLength = that.tcProductData.tags.length;

      if (labelLength < 5) {
        this.$router.push({
          path: "/technician_tcAddlabel"
        });
      } else {
        this.$toast.warning("标签最多五个哦~");
      }
    }
  }
};
</script>

<style scoped lang='less'>
.t-tcDetails {
  .t-tcName {
    width: 100%;
    height: 90/2px;
    background-color: #ffffff;
    border-top: solid 1px #eeeeee;
    display: flex;
    align-items: center;
    padding-left: 30/2px;
    box-sizing: border-box;
    span {
      font-size: 32/2px;
      color: #6f7578;
      width: 90px;
      // margin-right: 42/2px;
      display: block;
    }
    input {
      flex: 1;
      height: 100%;
      border: 0;
      font-size: 30/2px;
    }
  }

  .t-experience {
    width: 100%;
    height: 90/2px;
    background-color: #ffffff;
    border-top: solid 1px #eeeeee;
    display: flex;
    align-items: center;
    padding-left: 30/2px;
    font-size: 32/2px;
    padding-right: 30/2px;
    justify-content: space-between;
    box-sizing: border-box;
    span:first-child {
      font-size: 32/2px;
      color: #6f7578;
      width: 90px;
    }
    div {
      flex: 1;
      height: 100%;
      width: 100%;
      // input {
      //   height: 100%;
      //   border: 0;
      //   font-size: 30/2px;
      //   width: 92%;
      // }
    }
    .t-year {
      color: #282828;
      font-size: 32/2px;
    }
  }

  .t-gender {
    padding-left: 30/2px;
    font-size: 32/2px;
    display: flex;
    width: 100%;
    height: 90/2px;
    background-color: #ffffff;
    border-top: solid 1px #eeeeee;
    align-items: center;
    span {
      width: 90px;
      color: #6f7578;
    }
  }

  .t-tcPhoto {
    width: 100%;
    height: 90/2px;
    background-color: #ffffff;
    border-top: solid 1px #eeeeee;
    font-size: 32/2px;
    color: #6f7578;
    padding-left: 30/2px;
    padding-right: 30/2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      .t-tcimage {
        width: 71/2px;
        height: 71/2px;
        border-radius: 50%;
        margin-right: 20/2px;
      }
      .image {
        width: 71/2px;
        height: 71/2px;
        border-radius: 50%;
        margin-right: 20/2px;
      }
      > img:last-child {
        width: 15/2px;
        height: 25/2px;
      }
    }
  }

  .t-vocation {
    border-top: solid 1px #eeeeee;
    font-size: 32/2px;
  }

  .t-skilled {
    padding-top: 30/2px;
    padding-bottom: 10px;
    padding-right: 30/2px;
    padding-left: 30/2px;
    background-color: #ffffff;
    margin-top: 24/2px;

    .t-skilledTitle {
      display: flex;
      justify-content: space-between;
      > span:first-child {
        font-size: 32/2px;
        color: #6f7578;
      }
      > span:last-child {
        font-size: 30/2px;
        color: #999999;
      }
    }

    .t-label {
      height: auto;
      margin-top: 30/2px;
      display: flex;
      flex-wrap: wrap;
      .t-addLabel {
        width: 86/2px;
        height: 41/2px;
        color: #ff4919;
        border-radius: 5/2px;
        text-align: center;
        line-height: 41/2px;
        border: solid 1px #ff4919;
        font-size: 28/2px;
        display: inline-block;
        margin-right: 30/2px;
        margin-bottom: 15/2px;
      }
      .t-labelContnet {
        display: inline-block;
        font-size: 28/2px;
        border: solid 1px #ff4919;
        border-radius: 5/2px;
        height: 41/2px;
        padding-left: 22/2px;
        padding-right: 22/2px;
        color: #ff4919;
        margin-right: 30/2px;
        position: relative;
        line-height: 40/2px;
        margin-bottom: 15/2px;

        > img {
          position: absolute;
          right: -7px;
          top: -8px;
          width: 30/2px;
          height: 30/2px;
        }
      }
    }
  }

  .t-introduce {
    margin-top: 24/2px;
    margin-bottom: 132/2px;
    background-color: #ffffff;
    padding: 30/2px;
    height: 334/2px;
    box-sizing: border-box;
    position: relative;
    > span {
      color: #6f7578;
      font-size: 32/2px;
    }
    .t-textLentgh {
      right: 30/2px;
      bottom: 10/2px;
      position: absolute;
    }
  }

  .t-bottom {
    width: 100%;
    height: 132/2px;
    background-color: #ffffff;
    border: solid 1px #eeeeee;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    > div:first-child {
      width: 179/2px;
      height: 72/2px;
      border-radius: 5/2px;
      border: solid 1px #ff4919;
      font-size: 34/2px;
      color: #ff4919;
      text-align: center;
      line-height: 72/2px;
      margin-right: 30/2px;
      margin-left: 330/2px;
    }
    > div:last-child {
      width: 179/2px;
      height: 72/2px;
      background-color: #ff4919;
      border-radius: 5/2px;
      border: solid 1px #ff4919;
      font-size: 34/2px;
      color: #ffffff;
      text-align: center;
      line-height: 72/2px;
    }
  }
}
</style>


<style lang="less">
.t-tcDetails {
  .t-gender {
    .van-radio-group {
      display: flex;
      height: 100%;
      align-items: center;
      .van-radio {
        margin-right: 85/2px;
        display: flex;
        align-items: center;
        height: 100%;

        .hue {
          color: #ff4919;
        }
        .van-radio__label {
          // line-height: 2;
          color: #999999;
          // height: 27px;
          &:active {
            color: #ff4919;
          }
        }

        .van-icon-checked {
          color: #ff4919;
        }
      }
    }
  }
  .t-vocation {
    .van-cell {
      font-size: 32/2px;
      .van-cell__value {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        .text333 {
          color: #333333;
        }
        > span {
          color: #999999;
          font-size: 30/2px;
        }
      }
      .van-cell__title {
        color: #6f7578;
      }
    }
  }
  .t-introduce {
    .container {
      padding: 0;
      margin-top: -20px;
      .mu-input {
        width: 100%;
        font-size: 30/2px;
        height: 130px;
      }
    }
  }

  .t-tcName {
    .vux-x-input {
      padding: 0;
      height: 100%;
      font-size: 30/2px;
    }
  }

  .t-experience {
    .vux-x-input {
      padding: 0;
      width: 92%;
    }
  }
}
</style>
