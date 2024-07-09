<template>
  <el-form class="reg-user" ref="ruleFormRef" :rules="rules" :model="ruleForm">
    <div class="avatar-box">
      <img src="../../../public/images/logo.JPG" alt="" />
    </div>
    <div class="title-container">
      <h1 class="title">光谷智慧交通</h1>
    </div>
    <el-form-item prop="username">
      <el-input
        placeholder="Username"
        v-model="ruleForm.username"
        autocomplete="off"
        clearable
        prefix-icon="UserFilled"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        placeholder="Password"
        v-model="ruleForm.password"
        autocomplete="off"
        show-password
        :prefix-icon="ruleForm.password ? 'Lock' : 'Unlock'"
      />
    </el-form-item>
    <el-form-item prop="repeatPassword">
      <el-input
        placeholder="RepeatPassword"
        v-model="ruleForm.repeatPassword"
        autocomplete="off"
        show-password
        :prefix-icon="ruleForm.repeatPassword ? 'Lock' : 'Unlock'"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="form-btn" @click="onSubmit(ruleFormRef)"
        >注 册</el-button
      >
      <div class="footer" @click="goLogin">已注册？去登录</div>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue"
import http from "../../api/http"
import { ElMessage } from "element-plus"

const ruleFormRef = ref()
const ruleForm = ref({
  username: "",
  password: "",
  repeatPassword: "",
})
// 自定义验证规则————重复密码
const validatePwd = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再输入一次密码！"))
  } else if (value !== ruleForm.value.password) {
    callback(new Error("两次密码不一致！"))
  } else {
    callback()
  }
}
//表单验证规则
const rules = ref({
  username: [
    { required: true, message: "用户名不可为空！", trigger: "blur" },
    { min: 1, max: 8, message: "用户名长度为1-8位！", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不可为空！", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度为6-18位！", trigger: "blur" },
  ],
  repeatPassword: [{ required: true, validator: validatePwd, trigger: "blur" }],
})
//点击注册
const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await http({
        url: "users/regUser",
        data: {
          username: ruleForm.value.username,
          password: ruleForm.value.password,
          repeatPassword: ruleForm.value.repeatPassword,
        },
      })
      if (res.data.status === 0) {
        ElMessage({
          message: "注册成功，请登录！",
          type: "success",
          duration: 1000,
        })
        goLogin()
      } else {
        ElMessage({
          message: res.data.message,
          type: "error",
          duration: 1000,
        })
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
//跳转登录
const emit = defineEmits(["send"])
const goLogin = () => {
  emit("send", true)
}
</script>
<style scoped>
.reg-user {
  height: 380px;
}
.avatar-box {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: -45px;
  margin-left: -40px;
}
.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.title-container .title {
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  margin: 22px auto;
  padding-top: 10px;
}
.login-container .form-btn {
  width: 270px;
  /* height: 30px; */
  color: #fff;
  /* padding: 8px 20px; */
  margin-top: 10px;
  font-size: 20px;
  border-radius: 21px;
  height: 40px;
  background-image: linear-gradient(
    to right,
    #e4afcb 0%,
    #b8cbb8 20%,
    #b8cbb8 40%,
    #e2c58b 60%,
    #c2ce9c 80%,
    #7edbdc 100%
  );
}
.login-container .footer {
  color: #fff;
  font-size: 12px;
  transition: all 0.5s;
  text-decoration: none;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 8px;
}
.footer:hover {
  color: #7edbdc;
}
</style>
