<template>
  <el-form class="login" ref="ruleFormRef" :rules="rules" :model="ruleForm">
    <div class="avatar-box" style="background: #fff">
      <img src="/images/traffic1.png" alt="" />
    </div>
    <div class="title-container">
      <h1 class="title">光谷智慧交通</h1>
    </div>
    <el-form-item prop="username">
      <el-input
        v-model="ruleForm.username"
        placeholder="Username"
        autocomplete="off"
        clearable
        prefix-icon="UserFilled"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        placeholder="Password"
        autocomplete="off"
        show-password
        :prefix-icon="ruleForm.password ? 'Lock' : 'Unlock'"
      />
    </el-form-item>
    <el-form-item>
      <el-button class="form-btn" type="primary" @click="onSubmit(ruleFormRef)"
        >登 录</el-button
      >
      <div class="footer" @click="goRegUser">没有账号？去注册</div>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useToken } from "../../stores/useToken"
import http from "../../api/http"
import { ElMessage } from "element-plus"

const tokenStore = useToken()
const router = useRouter()
const ruleFormRef = ref()
const ruleForm = ref({
  username: "",
  password: "",
})
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
})
//点击登录
const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await http({
        url: "users/login",
        data: {
          username: ruleForm.value.username,
          password: ruleForm.value.password,
        },
      })
      if (res.data.status === 0) {
        router.push("/home")
        tokenStore.setId(res.data.data.user_id)
        tokenStore.setUsername(res.data.data.username)
        tokenStore.setType(res.data.data.type)
        // tokenStore.setToken(res.data.token)
        ElMessage({
          message: "欢迎来到光谷智慧交通！",
          type: "success",
          duration: 1000,
        })
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
//跳转注册
const emit = defineEmits(["send"])
const goRegUser = () => {
  emit("send", false)
}
</script>
<style scoped>
.login {
  height: 320px;
}
.avatar-box {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: -45px;
  margin-left: -40px;
  overflow: hidden;
}
.avatar-box img {
  position: relative;
  top: -10px;
  left: -10px;
  width: 100px;
  height: 100px;
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
  color: #fff;
  /* padding: 8px 20px; */
  margin-top: 10px;
  height: 40px;
  font-size: 20px;
  border-radius: 21px;
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
