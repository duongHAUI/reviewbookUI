<template>
  <div class="sign-in">
    <div class="wrapper">
      <div class="wrapper-sign-in">
        <h1 class="wrapper-sign-in-title">Đăng ký tài khoản</h1>
        <MInput
          textField="Họ tên"
          v-model="user.fullname"
          :required="true"
          placeholder="Họ tên"
          name="fullname"
          ref="fullname"
          :tabIndex="1"
          :rules="[rules.NOT_EMPTY, `${rules.MAX_LENGTH}|100`]"
          :errorMsg="errorMsgObject?.fullname"
          @message-error-input="handleBindMessageInput"
        />
        <div class="m-t-16"></div>
        <MInput
          textField="Email"
          v-model="user.email"
          :required="true"
          placeholder="Email"
          name="Email"
          ref="Email"
          :tabIndex="2"
          :rules="[rules.NOT_EMPTY, rules.HAS_FORMAT, `${rules.MAX_LENGTH}|100`]"
          :errorMsg="errorMsgObject?.Email"
          @message-error-input="handleBindMessageInput"
        />
        <div class="m-t-16"></div>
        <MInput
          textField="Mật khẩu"
          v-model="user.password"
          :required="true"
          placeholder="Mật khẩu"
          name="password"
          ref="password"
          type="password"
          :tabIndex="2"
          :rules="[rules.NOT_EMPTY, `${rules.MIN_LENGTH}|6`, `${rules.MAX_LENGTH}|20`]"
          :errorMsg="errorMsgObject?.password"
          @message-error-input="handleBindMessageInput"
        />
        <div class="m-t-16"></div>
        <MInput
          textField="Nhập lại mật khẩu"
          v-model="user.comfirm_password"
          :required="true"
          placeholder="Nhập lại mật khẩu"
          name="comfirm_password"
          ref="comfirm_password"
          type="Password"
          :tabIndex="2"
          :rules="[rules.NOT_EMPTY, `${rules.MIN_LENGTH}|6`, `${rules.MAX_LENGTH}|20`]"
          :errorMsg="errorMsgObject?.comfirm_password"
          @message-error-input="handleBindMessageInput"
        />
        <div class="m-t-16"></div>
        <m-button
          @click="registerSubmit"
          hoverBgrColor="#58371F"
          backgroundColor="#382110"
          color="#fff"
          hoverColor="#fff"
          >Đăng ký</m-button
        >
        <div class="m-t-12"></div>
        <div class="a-divider a-divider-break"><h5 aria-level="5">Đã có tài khoản?</h5></div>
        <div class="m-t-12"></div>
        <m-button @click="login">Đăng nhập</m-button>
      </div>
    </div>
    <sup class="sub-footer">© 2024 Goodreads Inc</sup>
    <div class="tfooter"></div>
  </div>
</template>

<script>
import MInput from '@/components/input/MInput.vue'
import MButton from '@/components/MButtonCustom.vue'
import mixinForm from '@/mixins/mixinForm.js'
import resources from '@/common/resource'
import baseApi from '@/api/baseApi'
import msEnum from '@/common/enum'
export default {
  name: 'MLogin',
  mixins: [mixinForm],
  components: {
    MInput,
    MButton
  },
  data() {
    return {
      user: {},
      rules: resources.FORM_RULES
    }
  },
  methods: {
    async registerSubmit() {
      try {
        this.$state.isMask()
        if (!this.checkValidateFormSubmit()) {
          return
        }
        this.$state.isMask()
        const res = await new baseApi('User').create(this.user)
        if (!res.ErrorCode) {
          localStorage.setItem('token', res.Data.Token)
          this.$state.setUser(res.Data.User)
          this.$router.push('/')
        }
      } catch (error) {
        console.log(error)
        var res = error?.response?.data
        // Kiểm tra lỗi validate
        if (res?.ErrorCode == msEnum.ERROR_RESPONSE.BADREQUEST) {
          for (const key in res.MoreInfo) {
            this.errorMsgObject[key] = res.MoreInfo[key]
            this.errorMessage = res.MoreInfo[key]
            this.firstInputNameError = key
            this.errorMsgObjectInput = this.errorMsgObject
          }
        }
      }
      this.$state.unMask()
    },
    login() {
      this.$router.push('/login')
    },
    customValidate() {
      if (!this.errorMsgObject.comfirm_password) {
        if (this.user.comfirm_password != this.user.password) {
          this.errorMsgObject.comfirm_password = 'Mật khẩu nhập lại không khớp.'
        }
      }
    }
  }
}
</script>

<style scoped>
@import url(./account.css);
.a-divider-break {
  text-align: center;
  position: relative;
  top: 2px;
  padding-top: 1px;
  margin-bottom: 14px;
  line-height: 0;
}
.a-divider.a-divider-break h5 {
  line-height: 1;
  font-size: 12px;
  color: #1e1915;
  font-weight: 400;
  z-index: 2;
  position: relative;
  display: inline-block;
  background-color: #fff;
  padding: 0 8px 0 7px;
}
.a-divider.a-divider-break:after {
  content: '';
  width: 100%;
  background-color: transparent;
  display: block;
  height: 1px;
  border-top: 0.1rem solid #767676;
  position: absolute;
  top: 50%;
  margin-top: -1px;
  z-index: 1;
}
</style>
