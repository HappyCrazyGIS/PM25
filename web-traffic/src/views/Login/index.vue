<template>
  <div class="login-container">
    <Login v-if="isShow" @send="onSendLogin"></Login>
    <RegUser v-else @send="onSendRegUser"></RegUser>
  </div>
</template>
<script setup>
import Login from "./Login.vue"
import RegUser from "./regUser.vue"
import { ref } from "vue"

let isShow = ref(true)

const onSendLogin = (val) => {
  isShow.value = val
}
const onSendRegUser = (val) => {
  isShow.value = val
}
</script>
<style>
/* 修改element样式 */
.login-container .el-form {
  width: 430px;
  /* min-height: 320px; */
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  text-align: center;
  position: fixed;
  margin: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
.login-container .el-form-item {
  width: 270px;
  margin: 20px auto;
}
.login-container .el-input {
  display: inline-block;
}
/* .el-input__inner { */
.login-container .el-input__wrapper {
  color: #fff;
  font-size: 18px;
  background-color: transparent;
  border: 0px;
  border-bottom: 2px solid #fff;
  border-radius: 0;
  box-shadow: 0 0 0 0;
  /* padding-left: 34px; */
  /* caret-color: #2f4f4f; */
}
.login-container .el-input__inner {
  color: white;
}
.login-container .el-input__inner:focus {
  color: white;
}
.login-container .el-input__inner:hover {
  border: 0 0 2px 0;
}
.login-container .el-input__wrapper:hover {
  box-shadow: 0 0 0 0;
  border-bottom: 2px solid #c0c4cc;
}
.login-container .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 0;
  border-bottom: 2px solid #409eff;
}
.login-container .el-form-item.is-error .el-input__wrapper {
  box-shadow: 0 0 0 0;
  border-bottom: 2px solid red;
}
.login-container .el-input__inner::placeholder {
  color: rgba(169, 169, 169, 0.7);
  font-size: 16px;
}
</style>
<style scoped>
.login-container {
  height: 100vh;
  background: url("../../../public/images/24hr-Earth_11.jpeg") no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
