<template>
  <div class="sign-in">
    <div class="wrapper">
      <div class="wrapper-sign-in">
        <h1 class="wrapper-sign-in-title">Đăng nhập vào Goodreads</h1>
        <m-button classIcon="fa-brands fa-amazon" hoverBgrColor="#f5d47a"
          >Đăng nhập với Amazon</m-button
        >
        <div class="m-t-16"></div>
        <m-button classIcon="fa-brands fa-apple" hoverBgrColor="#f5d47a"
          >Đăng nhập với Apple</m-button
        >
        <div class="m-t-16"></div>
        <m-button classIcon="fa-brands fa-google" hoverBgrColor="#f5d47a"
          >Đăng nhập với Google</m-button
        >
        <div class="m-t-16"></div>
        <m-button
          @click="loginEmail"
          hoverBgrColor="#58371F"
          backgroundColor="#382110"
          color="#fff"
          hoverColor="#fff"
          >Đăng nhập với Email</m-button
        >
      </div>
    </div>
    <sup class="sub-footer">© 2024 Goodreads Inc</sup>
    <div class="tfooter"></div>
  </div>
</template>
<script>
import MButton from '@/components/MButtonCustom.vue'

export default {
  name: 'SignIn',
  components: { MButton },
  data() {
    return {}
  },
  methods: {
    loginEmail() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url(./account.css);
</style>
