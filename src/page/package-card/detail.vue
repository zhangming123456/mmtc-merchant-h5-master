<template>
  <div class="azm-package-card-detail">
    <header>
      <div class="azm-card-info" :style="cardStyle">
        <div class="azm-card-info-img">
          <azm-avatar :src="info.cover" :height="433/2" mode="aspectFill" type="img"></azm-avatar>
          <p class="azm-card-name azm-ellipsis">{{info.card_name}}</p>
          <p class="azm-card-subtitle azm-ellipsis">{{info.card_title}}</p>
          <p class="azm-card-type azm-ellipsis">{{info.card_type_name}}</p>
          <p class="azm-card-validity-period azm-ellipsis">
            <span>有效期：</span>
            <template v-if="info.day_type==1">
              <span>{{info.date_start}} - {{info.date_end}}</span>
            </template>
            <span v-else>{{info.effective}}天</span>
          </p>
        </div>
        <mu-flex class="azm-card-info-box" justify-content="start">
          <mu-flex fill>
            <div class="w100 clearfix">
              <p class="azm-card-name azm-ellipsis clearfix">
                <span>套卡</span>
                <span>{{info.card_name}}</span>
              </p>
              <p class="azm-card-price clearfix">
                <span class="azm-price">￥{{info.price | money_filter}}</span>
                <span class="azm-market-price">￥{{info.market_price | money_filter}}</span>
                <span class="azm-discount">{{info.price / info.market_price | discount_filter}}折</span>
                <span class="azm-use-type">{{info.use_type}}</span>
              </p>
            </div>
          </mu-flex>
          <mu-flex class="azm-light" @click="share">
            <div>
              <i class="iconfont icon-erweima"></i>
              <p>分享</p>
            </div>
          </mu-flex>
        </mu-flex>
      </div>
    </header>
    <mu-tabs class="azm-tabs vux-1px-t vux-1px-b" :value.sync="active" indicator-color="#2D81E4" inverse color="#2D81E4"
             center fullWidth @change="tabsChange">
      <mu-tab ripple class="azm-tab vux-1px-r">
        <div>项目清单</div>
      </mu-tab>
      <mu-tab ripple class="azm-tab">
        <div>套卡详情</div>
      </mu-tab>
    </mu-tabs>
    <!--项目详情-->
    <section v-if="active === 1">
      <!--使用说明-->
      <van-cell-group class="azm-description marTop12">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>使用说明</div>
          </div>
        </van-cell>
        <van-cell class="azm-description-box" v-if="info.explain && info.explain.length">
          <p v-for="item in info.explain">{{item}}</p>
        </van-cell>
      </van-cell-group>
      <!--可选项目-->
      <van-cell-group class="azm-intro marTop12">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>图文详情</div>
          </div>
        </van-cell>
        <van-cell v-if="info.intro">
          <div class="azm-intro-box" v-html="info.intro"></div>
        </van-cell>
      </van-cell-group>
    </section>
    <!--项目清单-->
    <section v-else>
      <!--可用项目-->
      <van-cell-group class="azm-available marTop12" v-if="availableItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>可用项目</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in availableItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.num}}</p>
              <p class="azm-money azm-ellipsis">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
          </van-cell>
        </template>
      </van-cell-group>
      <!--可选项目-->
      <van-cell-group class="azm-optional marTop12" v-if="optionalItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>可选项目（{{optionalItem.length}}选1）</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in optionalItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.num}}</p>
              <p class="azm-money azm-ellipsis">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
            <!--<div class="azm-mask">-->
            <!--<span>已删除</span>-->
            <!--</div>-->
          </van-cell>
        </template>
      </van-cell-group>
      <!--赠送项目-->
      <van-cell-group class="azm-optional marTop12" v-if="giftItem.length>0">
        <van-cell class="azm-title" ripple>
          <div class="azm-best-selling-title">
            <div>赠送项目</div>
          </div>
        </van-cell>
        <template v-for="(item,index) in giftItem">
          <van-cell class="azm-cell-item" :is-link="false" center>
            <div class="azm-img" slot="icon">
              <azm-avatar :aspectRatio="1" :src="item.cover"></azm-avatar>
            </div>
            <div class="azm-available-value">
              <p class="azm-title azm-ellipsis">{{item.title}}</p>
              <p class="azm-num azm-ellipsis">{{item.num}}</p>
              <p class="azm-money azm-ellipsis">
                <span class="azm-price">￥{{item.price | money_filter}}</span>
                <span class="azm-market-price">￥{{item.market_price | money_filter}}</span>
              </p>
            </div>
          </van-cell>
        </template>
      </van-cell-group>
    </section>

    <mu-flex class="azm-footer" v-if="!isShow">
      <mu-flex fill>
        <div class="grid-cell grid-cell-left">
          <mu-button class="azm-btn" :disabled="info.status == 2" flat large textColor="#2D81E4" fullWidth
                     @click.native="azmSwitch(+info.status)">
            <span v-if="info.status == 2">待发布</span>
            <span v-else-if="info.status == 1">下架</span>
            <span v-else>上架</span>
          </mu-button>
        </div>
      </mu-flex>
      <mu-flex fill>
        <div class="grid-cell grid-cell-right">
          <mu-button flat textColor="#fff" large class="azm-btn" fullWidth @click.native="onConfirm">编辑
          </mu-button>
        </div>
      </mu-flex>
    </mu-flex>
    <img class="azm-footer-img" v-else src="../../assets/azm_footer_img.png" alt="" @click="imgWarning">
  </div>
</template>

<script>
  import Avatar from "../../components/avatar/index.vue";
  import { CellGroup, Cell } from "vant";
  import { mapState } from "vuex";

  export default {
    components: {
      [Avatar.name]: Avatar,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell
    },
    data () {
      return {
        message: "",
        info: {},
        cardStyle: {},
        active: 0,
        QRcode: "",
        isShow: true,
        availableItem: [],
        optionalItem: [],
        giftItem: []
      };
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", "isMerchantH5"],
    created () {
      let isShow = this.$route.query.isShow;
      if (+isShow === 1) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.refresh();
    },
    methods: {
      refresh () {
        let that = this;
        let card_id = that.$route.query.card_id;
        this.$store.dispatch("ApiService/getPackageCardDetail", {card_id}).finally(res => {
          if (res.status === 1 && that.util.isEmptyObject(res.info)) {
            let data = res.info;
            that.info = data.info;
            if (data.item0) {
              that.availableItem = data.item0;
            }
            if (data.item1) {
              that.optionalItem = data.item1;
            }
            //            赠送
            if (data.item2) {
              that.giftItem = data.item2;
            }
          }
        });
      },
      tabsChange () {
      },
      azmSwitch (status) {
        let that = this;
        let card_id = this.info.card_id;
        if (card_id && +status !== 2) {
          let txt = "确定要上架？",
            _status = 1;
          if (+status === 1) {
            txt = "确定要下架？";
            _status = 0;
          }
          that.$confirm(txt, "提示", {type: "warning"}).then(({result}) => {
            if (result) {
              that.$store
                .dispatch("ApiService/setOrderCardUpDown", {
                  card_id,
                  status: _status
                })
                .finally(res => {
                  if (res.status === 1) {
                    if (+status === 1) {
                      that.info.status = 0;
                      that.$toast.message("下架成功");
                    } else if (+status === 0) {
                      that.info.status = 1;
                      that.$toast.message("上架成功");
                    }
                  } else {
                    that.$toast.error(res.msg || "操作失败");
                  }
                });
            } else {
              this.$toast.message("点击了取消");
            }
          });
        }
      },
      onConfirm () {
        let that = this;
        let card_id = that.info.card_id;
        if (!card_id) return;
        that.util.Native.editCard({card_id}, "alert").finally(res => {
        });
      },
      async share () {
        let that = this;
        let card_id = that.info.card_id;
        let status = that.info.status;
        if (!card_id) return;
        if (status != 1) {
          that.$toast.message("已下架状态，不能分享~");
          return;
        }
        if (that.isShow) {
          that.$toast.message("预览模式，不能分享~");
          return;
        }
        console.log(this.$device.isWechat && !this.isMiniWechat, "分享标题");
        if (that.isMerchantH5) {
          this.util.Native.shareCardQRcode({card_id}, "downApp").finally(
            res => {
              if (res.status === 203) {
              }
            }
          );
        } else {
          if (!that.QRcode) {
            await that.$ajax.getShopCardShareImg({card_id: 55}).finally(res => {
              if (res.status === 1) {
                that.QRcode = that.util.absUrl(res.info.path);
              } else {
                that.$toast.error("获取图片失败");
              }
            });
          }
          if (that.QRcode && this.$device.isWechat && !this.isMiniWechat) {
            that.$wechat.previewImage({
              current: that.QRcode,
              urls: [that.QRcode]
            });
          } else if (that.QRcode) {
            that.$vant.ImagePreview([that.QRcode]);
          }
        }
      },
      imgWarning () {
        this.$toast.warning("用户端预览状态，不能使用功能");
      }
    }
  };
</script>

<style scoped lang="less">
  .azm-package-card-detail {
    padding-bottom: 75px;
    header {
      position: relative;
      box-sizing: border-box;
      padding: 15px;
      .azm-card-info {
        width: 100%;
        min-height: 433/2px;
        background-color: #fff;
        overflow: hidden;
        border-radius: 5px;
        .azm-card-info-img {
          height: 433/2px;
          position: relative;
          > p {
            position: absolute;
            color: #fff;
            width: 100%;
            left: 0;
            box-sizing: border-box;
            padding-left: 15px;
            &.azm-card-name {
              font-size: 32px;
              line-height: 45px;
              top: 14px;
            }
            &.azm-card-subtitle {
              font-size: 14px;
              line-height: 20px;
              top: 127/2px;
            }
            &.azm-card-type {
              color: #fff;
              font-size: 24px;
              line-height: 67/2px;
              bottom: 73/2px;
            }
            &.azm-card-validity-period {
              font-size: 12px;
              line-height: 1;
              bottom: 10px;
            }
          }
        }
        .azm-card-info-box {
          box-sizing: border-box;
          padding: 15px 0 15px 15px;
          .azm-card-name {
            line-height: 45/2px;
            span {
              &:nth-child(1) {
                line-height: 1;
                display: inline-block;
                margin-right: 15px;
                box-sizing: border-box;
                padding: 4px 8px;
                background-color: #f25643;
                color: #fff;
                border-radius: 2px;
                font-size: 12px;
              }
              &:nth-child(2) {
                color: #333;
                font-size: 32/2px;
                font-weight: 500;
              }
            }
          }
          .azm-card-price {
            line-height: 53/2px;
            .azm-price {
              font-size: 19px;
              color: #ff7a00;
              font-weight: 500;
              margin-right: 6px;
            }
            .azm-market-price {
              text-decoration: line-through;
              font-size: 13px;
              color: #6f7578;
            }
            .azm-discount {
              line-height: 1;
              display: inline-block;
              margin-right: 10px;
              box-sizing: border-box;
              padding: 2px 2px;
              color: #ff7a00;
              border: 1px solid #ff7a00;
              border-radius: 2px;
              font-size: 11px;
            }
            .azm-use-type {
              font-size: 13px;
              color: #6f7578;
            }
          }
          .azm-light {
            width: 119/2px;
            height: 100%;
            text-align: center;
            border-left: 1px solid #e5e5e5;
            > div {
              text-align: center;
              width: 100%;
              .iconfont {
                color: #aab2b7;
                font-size: 35/2px;
                line-height: 1;
              }
              p {
                margin-top: 6px;
                color: #6f7578;
                font-size: 13px;
                line-height: 37/2px;
              }
            }
          }
        }
      }
    }
    .azm-tabs {
      background-color: #fff;
    }
    section {
      .azm-description,
      .azm-available,
      .azm-optional,
      .azm-intro {
        .azm-title {
          position: relative;
          .azm-best-selling-title {
            position: relative;
            padding-left: 15px;
            &:after {
              position: absolute;
              top: 50%;
              left: 0;
              content: " ";
              width: 3px;
              height: 14px;
              background: #2d81e4;
              border-radius: 4px;
              transform: translate(0, -50%);
            }
          }
        }
      }
      .azm-available,
      .azm-optional {
        .azm-cell-item {
          position: relative;
          .azm-img {
            width: 83px;
          }
          .azm-mask {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.1);
            width: 100%;
            height: 100%;
            z-index: 10;
            span {
              position: absolute;
              bottom: 15px;
              right: 15px;
              color: #f25643;
            }
          }
        }
        .azm-available-value {
          box-sizing: border-box;
          padding-left: 15px;
          .azm-title {
            line-height: 45/2px;
            font-size: 32/2px;
            color: #333;
          }
          .azm-num {
            margin-top: 4px;
            line-height: 33/2px;
            font-size: 12px;
            color: #666;
          }
          .azm-money {
            margin-top: 12px;
            line-height: 53/2px;
            font-size: 12px;
            color: #999;
            .azm-unit {
              color: #ff7a00;
            }
            .azm-price {
              font-size: 14px;
              color: #ff7a00;
            }
            .azm-market-price {
              font-size: 12px;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
        > li {
          background-color: #fff;
        }
      }
      .azm-description {
        .azm-description-box {
          font-size: 13px;
          color: #666666;
          line-height: 25px;
        }
      }
    }
    .azm-footer {
      position: fixed;
      width: 100%;
      bottom: 0;
      box-sizing: border-box;
      padding: 15px;
      background-color: #f8f8f8;
      .grid-cell {
        width: 100%;
        text-align: center;
        padding: 0 7.5px;
        .azm-btn {
          width: 100%;
        }
      }
      .grid-cell-right {
        .azm-btn {
          background-color: #2d81e4;
        }
      }
      .grid-cell-left {
        .azm-btn {
          border: 1px solid #2d81e4;
        }
        .disabled {
          &.azm-btn {
            border-color: rgba(0, 0, 0, 0.38);
          }
        }
      }
    }
    .azm-footer-img {
      width: 100%;
      height: auto;
      position: fixed;
      bottom: 0;
    }
  }
</style>
<style lang="less">
  .azm-package-card-detail {
    .mu-tab-link-highlight {
      max-width: 20%;
      left: 15%;
    }
  }
</style>
