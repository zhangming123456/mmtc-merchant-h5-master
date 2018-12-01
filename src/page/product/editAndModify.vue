<template>
  <div class="azm-product-editAndModify">
    <van-cell-group>
      <van-field v-model="productData.title" label="产品名称" placeholder="产品名称（主标题）" clearable maxlength="10"/>
      <van-field v-model="productData.profile" label="副标题" placeholder="产品副标题" clearable maxlength="10"/>
      <div class="azm-money">
        <mu-row :gutter="true">
          <mu-col span="6">
            <mu-text-field label="门市价（门店标价）" class="w100 needsclick"
                           v-model="productData.market_price" :max-length="10"
                           prefix="￥" full-width type="text" @change="marketPriceChang" @input="marketPriceInput"
                           @blur="marketPriceChang" pattern="\d*">
            </mu-text-field>
          </mu-col>
          <mu-col span="6">
            <mu-text-field label="折扣价" class="w100 needsclick" v-model="productData.price" :max-length="10"
                           prefix="￥" full-width type="text" @change="priceChang" @input="priceInput"
                           @blur="priceChang" pattern="\d*">
            </mu-text-field>
          </mu-col>
        </mu-row>
      </div>
    </van-cell-group>
    <van-cell-group class="marTop12">
      <van-cell title="产品类型" is-link to="/product_category">
        <template v-if="productData.category_ids && productData.category_ids.length>0">
          <span v-for="(item,index) in productData.category_ids" :key="item.id"
                v-if="index < 3">{{item.title}}{{index !== 2 && productData.category_ids.length >= 3 ? '、' : ''}}</span>
          <!--<span>已完善</span>-->
        </template>
        <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
      </van-cell>
      <van-cell title="产品主图" is-link to="/product_covers">
        <template v-if="productData.cover && productData.cover.length>0">
          <azm-avatar width="28" :src="productData.cover[0]"></azm-avatar>
        </template>
        <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="marTop12">
      <van-field v-model="productData.service" label="服务内容" placeholder="一句话介绍" maxlength="16" clearable/>
      <van-field v-model="productData.service_char" label="服务特色" placeholder="可以填写特色或功效" maxlength="16" clearable/>
      <van-cell title="服务流程" is-link to="/product_process">
        <span v-if="productData.service_flow && productData.service_flow.length>0">已完善</span>
        <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
      </van-cell>
      <van-cell is-link to="/product_minutiae">
        <span slot="title">产品细节</span>
        <span slot="title" class="van-cell-title2">越完善度排名越高(选填)</span>
        <span v-if="minutiaeStatus === 5">已完善</span>
        <span v-else-if="minutiaeStatus > 0">部分填写</span>
        <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="marTop12 marBottom50">
      <van-cell is-link to="/product-activity">
        <span slot="title">参加活动</span>
        <span slot="title" class="van-cell-title2" v-if="!productData.is_valid">目前可参加拼团(选填)</span>
        <template v-if="productData.is_valid">
          <span class="azm-perfect-active" v-if="productData.group_price && productData.group_price>0">
            拼团特惠{{productData.group_num}}人团 ￥{{productData.group_price}}
          </span>
        </template>
        <span class="azm-perfect-active" v-else>
          <i class="iconfont icon-gantanhao azm-icon"></i>未完善
        </span>
      </van-cell>
    </van-cell-group>
    <div class="azm-footer" v-if="!isEdit">
      <mu-flex justify-content="end" class="">
        <mu-button flat textColor="#ff4919" small
                   @click.native="bindSubmit(0)">
          保存
        </mu-button>
        <mu-button flat textColor="#fff" small class="azm-shelf-btn"
                   @click.native="bindSubmit(1)">
          提交
        </mu-button>
      </mu-flex>
    </div>
    <mu-flex class="azm-append-footer azm-append-footer-fixed" v-else>
      <mu-button full-width textColor="#fff" @click.native="bindSubmit(1)">
        <span>提交</span>
      </mu-button>
    </mu-flex>
  </div>
</template>

<script>
  import { Field, CellGroup, Cell, Row, Col } from 'vant';
  import Avatar from '../../components/avatar/index.vue'
  import { mapState } from 'vuex'
  export default {
    components: {
      [Avatar.name]: Avatar,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    data(){
      return {
        message: '',
        isEdit: false,
        minutiaeStatus: 0
      }
    },
    computed: {
      ...mapState({
        $location: state => state.vux.$location,
        productData: state => state.product.productData
      })
    },
    watch: {
      productData: {
        handler: function (val, oldVal) {
          console.log(val, 'productData')
          let flag = 0
          if (val) {
            let obj = {
              intro: val.intro,
              label: val.label,
              item_brand: val.item_brand,
              taboo_crowd: val.taboo_crowd,
              other_instructions: val.other_instructions
            }
            for (let k in obj) {
              if (obj[k] && this.util.isArray(obj[k])) {
                obj[k].length > 0 && flag++
              } else if (obj[k]) {
                flag++
              }
            }
            this.minutiaeStatus = flag
          } else {
            this.minutiaeStatus = 0
          }

        },
        deep: true
      }
    },
    filters: {
      minutiae_filter(input){
        return false
      }
    },
    created(){
      this.$store.commit('product/resetProductData')
      this.isEdit = this.$route.query.isEdit ? true : false
      this.$nextTick(function () {
        let id = this.$route.query.id
        if (id) {
          this.getData(id)
        }
      })
    },
    methods: {
      getData(id){
        let that = this
        let $ = that.$azm.Zepto
        return this.$store.dispatch("ApiService/iteminfoSite", {id}).finally(res => {
          if (res.status === 1 && res.info) {
            let info = res.info
            this.$store.commit('product/coverProductData', {data: info})
          } else {

          }
        });
      },
      priceChang(){
        let productData = this.productData.price
        let market_price = this.productData.market_price
        let price = this.productData.price
        let isNumberOfNaN = this.util.isNumberOfNaN
        if (isNumberOfNaN(price)) {
          if (isNumberOfNaN(market_price) && +price > +market_price) {
            this.$toast.error('门市价不得小于折扣')
          }
          this.productData.price = Number(this.util.number_format(price))
        } else {
          this.$toast.error('门市价不得为空')
        }
      },
      marketPriceChang(){
        let productData = this.productData.price
        let market_price = this.productData.market_price
        let price = this.productData.price
        let isNumberOfNaN = this.util.isNumberOfNaN
        if (isNumberOfNaN(market_price)) {
          if (isNumberOfNaN(price) && +price > +market_price) {
            this.$toast.error('门市价不得小于折扣')
          }
          this.productData.market_price = Number(this.util.number_format(market_price))
        } else {
          this.$toast.error('折扣价不得为空')
        }
      },
      marketPriceInput(e){
        this.productData.market_price = this.util.number_filter(e);
      },
      priceInput(e){
        this.productData.price = this.util.number_filter(e);
      },
      /**
       * 过滤保存信息
       * @param obj
       * @returns {{covers: Array, service_flow: Array, nodes: string, label: Array, category_ids: Array, item_brand: Array, taboo_crowd: string, other_instructions: string, group_num: string, group_price: string, is_valid: boolean}}
       */
      getSaveData(obj = {}) {
        let that = this,
          util = that.util,
          data = that.productData,
          saveData = {
            title: data.title,
            profile: data.profile,
            market_price: data.market_price,
            price: data.price,
            service: data.service,
            service_char: data.service_char,
            cover: data.cover,
            service_flow: data.service_flow,
            intro: data.intro,
            label: data.label,
            category_ids: data.category_ids,
            item_brand: data.item_brand,
            taboo_crowd: data.taboo_crowd,
            other_instructions: data.other_instructions,
            group_num: data.group_num,
            group_price: data.group_price,
            start_time: data.start_time,
            end_time: data.end_time,
            note: data.note,
            isTheTerm: data.isTheTerm ? 1 : 0,
            is_valid: data.is_valid ? 1 : 0,
          }
        if (data.isTheTerm) {
          saveData.start_date = data.start_date;
          saveData.end_date = data.end_date;
          saveData.note = data.note;
        }
        if (saveData.category_ids && saveData.category_ids.length > 0) {
          let category_ids = [];
          for (let v of saveData.category_ids) {
            category_ids.push(v.id);
          }
          saveData.category_id = category_ids;
          delete saveData.category_ids;
        }
        saveData = {...obj, ...saveData};
        for (let k in saveData) {
          if (util.isString(saveData[k])) {
            saveData[k] = util.trim(saveData[k]);
          }
          if (util.isNumberOfNaN(saveData[k])) {
            saveData[k] = parseFloat(saveData[k]);
          }
        }
        return saveData;
      },
      bindSubmit(num){
        let that = this;
        try {
          let productData = that.productData,
            saveData = that.getSaveData();
          if (productData.id) {
            saveData.id = productData.id;
          }
          if (!saveData.title) {
            that.$toast.error("产品名称不能为空");
            return;
          }
          if (num === 0) {
            //提交
            saveData.isReview = num;
            that.saveFromData(saveData);
            return;
          }
          if (!saveData.profile) {
            that.$toast.error("副标题不能为空");
          } else if (+saveData.market_price <= 0 || +saveData.price <= 0) {
            that.$toast.error("价格不能少于0.01元");
          } else if (saveData.market_price < saveData.price) {
            that.$toast.error("折扣价不能大于门市价");
          } else if (saveData.group_price && saveData.price < saveData.group_price) {
            that.$toast.error("拼团价格不得大于折扣价格");
          } else if (!saveData.category_id || saveData.category_id.length === 0) {
            that.$toast.error("产品类别未完善");
          } else if (!saveData.cover || saveData.cover.length === 0) {
            that.$toast.error("产品主图未完善");
          } else if (!saveData.service) {
            that.$toast.error("服务内容不能为空");
          } else if (!saveData.service_char) {
            that.$toast.error("服务特色不能为空");
          } else if (!saveData.service_flow || saveData.service_flow.length === 0) {
            that.$toast.error("服务流程未完善");
          } else {
            //提交
            saveData.isReview = num;
            that.saveFromData(saveData);
          }
        } catch (e) {
          that.$toast.error("操作失败");
        }
      },
      saveFromData(data = {}){
        if (this.isSubmit) return;
        this.isSubmit = true;
        this.$vux.loading.show({
          text: "提交中..."
        })
        let that = this,
          p = this.$store.dispatch("ApiService/saveItemInfo", data),
          title = "保存";
        if (data.isReview === 1) {
          title = "提交";
        }
        p.finally(res => {
          that.$vux.loading.hide()
          that.isSubmit = false;
          if (res.status === 1) {
            that.$vux.toast.show({
              type: `success`,
              text: `${title}成功`,
              isShowMask: true,
              onHide(){
                that.$router.back();
              }
            })
          } else {
            that.$vux.toast.show({
              type: `success`,
              text: res.msg || `${title}失败`,
              isShowMask: true
            })
          }
        });
        return p;
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-product-editAndModify {
    .van-cell-title2 {
      margin-left: 12px;
      font-size: 12px;
      color: #999999;
    }
    .azm-perfect-active {
      color: #ff4919;
      font-size: 14px;
      .azm-icon {
        font-size: 14px;
        margin-right: 3px;
      }
    }
    .azm-money {
      padding: 0 15px;
      .mu-input {
        margin-bottom: 0;
      }
    }
    .azm-footer {
      position: fixed;
      bottom: 0;
      left: 0;
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
    .azm-append-footer {
      .mu-button {
        border-radius: 0;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #35abfe 0, #3d70f7 100%);
      }
    }
  }
</style>

<style lang="less">
  .azm-product-editAndModify {
    .mu-input.has-label .mu-input-label {
      top: 8px;
      position: absolute;
    }
    .mu-input-help {
      display: none;
    }
    .van-cell__title, .van-cell__value {
      flex: 3 3 auto;
    }
  }
</style>
