<template>
  <mu-container class="azm-login-index azm-navBar-top">
    <mu-form ref="form" :model="validateForm" class="mu-demo-form">
      <mu-form-item label="用户名" help-text="帮助文字" prop="username" :rules="usernameRules">
        <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="密码" prop="password" :rules="passwordRules">
        <mu-text-field prop="password" v-model="validateForm.password"
                       :action-icon="visibility ? 'visibility_off' : 'visibility'"
                       :action-click="() => (visibility = !visibility)"
                       :type="visibility ? 'text' : 'password'"></mu-text-field>
      </mu-form-item>
      <mu-form-item prop="isAgree" :rules="argeeRules">
        <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
      </mu-form-item>
      <mu-form-item>
        <mu-button color="primary" @click="submit">提交</mu-button>
        <mu-button @click="clear">重置</mu-button>
      </mu-form-item>
    </mu-form>
  </mu-container>
</template>

<script>
  import { mapState } from 'vuex'
  import { Checkbox } from 'muse-ui'

  export default {
    components: {
      [Checkbox.name]: Checkbox
    },
    data () {
      return {
        message: '',
        usernameRules: [
          {validate: (val) => !!val, message: '必须填写用户名'},
          {validate: (val) => val.length >= 3, message: '用户名长度大于3'}
        ],
        passwordRules: [
          {validate: (val) => !!val, message: '必须填写密码'},
          {validate: (val) => val.length >= 6 && val.length <= 16, message: '密码长度大于6小于16'}
        ],
        argeeRules: [{validate: (val) => !!val, message: '必须同意用户协议'}],
        validateForm: {
          username: '',
          password: '',
          isAgree: false
        },
        visibility: false
      }
    },
    computed: {
      ...mapState({})
    },
    inject: ["appRefresh", 'isMerchantH5', '$$$setNarBar'],
    created () {
      this.$$$setNarBar({
        lowerLine: false,
        style: {
          background: "rgb(66, 133, 244)",
          color: "#fff"
        }
      });
    },
    methods: {
      submit () {
        let that = this;
        let validateForm = that.validateForm;
        this.$refs.form.validate().then((result) => {
          console.log('form valid: ', result);
          if (result) {
            that.$ajax.login({username: validateForm.username, password: validateForm.password}).finally(res => {
              if (res.status === 1) {
                let info = res.info
                if (+info.data.step === 0) {

                } else {
                  let id = info.data.id
                  switch (+info.data.step) {
                    case 1:
                      that.$router.replace({path: '/merchant_addshop', query: {id}})
                      break;
                    case 2:
                      that.$router.replace({path: '/merchant_attestinfo', query: {id}})
                      break;
                    default:
                      that.$router.replace({path: '/merchant_schedule', query: {id}})
                      break;
                  }
                }
              }
            })
          }
        });
      },
      clear () {
        this.$refs.form.clear();
        this.validateForm = {
          username: '',
          password: '',
          isAgree: false
        };
      }
    }
  }
</script>

<style scoped lang="less">
  .azm-login-index {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .mu-demo-form {
      width: 100%;
      max-width: 460px;
    }
  }
</style>
<style lang="less">
  .azm-login-index {
  }
</style>
