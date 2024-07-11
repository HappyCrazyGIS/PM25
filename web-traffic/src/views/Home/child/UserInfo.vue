<template>
  <div class="user-container">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-sub-menu index="0">
        <template #title
          ><el-avatar
            :size="50"
            :src="
              tokenStore.avatar
                ? tokenStore.avatar
                : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
            @click="dialogAvatarVisible = !dialogAvatarVisible"
          />&nbsp;&nbsp;{{ tokenStore.username }}</template
        >
        <el-menu-item index="0-1">修改信息</el-menu-item>
        <el-menu-item v-if="tokenStore.type == 'admin'" index="0-2"
          >用户管理</el-menu-item
        >
        <el-menu-item index="0-3">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <!-- 上传头像 -->
    <el-dialog
      v-model="dialogAvatarVisible"
      title="上传头像"
      width="30%"
      @close="handleCloseAvatar"
    >
      <el-upload
        ref="uploadPic"
        class="avatar-uploader"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :show-file-list="false"
        list-type="picture"
        :limit="1"
      >
        <img
          style="width: 100px; height: 100px"
          v-if="showImg || tokenStore.avatar"
          :src="showImg ? showImg : tokenStore.avatar"
          class="avatar"
        />
        <el-icon v-else class="avatar-uploader-icon"
          ><el-icon><Plus /></el-icon
        ></el-icon>
      </el-upload>
      <div class="el-upload__tip">点击更换头像</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAvatarVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpload"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 我的信息 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="我的信息"
      width="400px"
      @close="handleCloseDialog"
    >
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="ruleForm.oldPassword"
            autocomplete="off"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="ruleForm.newPassword"
            autocomplete="off"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatNewPassword">
          <el-input
            v-model="ruleForm.repeatNewPassword"
            autocomplete="off"
            show-password
          />
        </el-form-item>
        <el-form-item style="margin: 0 0 -10px 228px">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate(ruleFormRef)">
            修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { useToken } from "../../../stores/useToken"
import { useRouter } from "vue-router"
import http from "../../../api/http"
import { ElMessage } from "element-plus"
const baseUrl = import.meta.env.VITE_BASE_URL
let router = useRouter()
const tokenStore = useToken()
let showImg = ref("") //头像
let fileList = ref([]) //头像列表
const uploadPic = ref(null)

let dialogAvatarVisible = ref(false)
let ruleFormRef = ref()
let dialogFormVisible = ref(false)
const ruleForm = ref({
  username: "", //用户名
  oldPassword: "", //旧密码
  newPassword: "", //新密码
  repeatNewPassword: "", //新密码
})

onMounted(() => {
  getAvatar()
})
//获取头像
const getAvatar = async () => {
  let id = tokenStore.id
  let res = await http({
    url: "users/getAvatar",
    method: "get",
    params: {
      id,
    },
  })
  if (res.data.status === 0 && res.data.data[0].avatar_url) {
    tokenStore.setAvatar(`${baseUrl}${res.data.data[0].avatar_url}`)
  }
}
//清除文件列表
const handleCloseAvatar = () => {
  uploadPic.value.clearFiles()
  showImg.value = ""
}
// 上传的文件改变时的回调,(在添加文件、上传成功和上传失败时都会被调用)
const handleAvatarChange = (file, files) => {
  fileList.value = []
  // console.log(file)
  showImg.value = URL.createObjectURL(file.raw)
  // console.log(files)
  fileList.value.push(file.raw)
}
// 上传头像
const handleUpload = async () => {
  const id = tokenStore.id
  // 创建表单对象
  const formData = new FormData()
  dialogAvatarVisible.value = false
  // 判断是否上传了图片，如果上传了图片，将图片存入到formData中
  if (fileList.value) {
    formData.append("avatar", fileList.value[0])
  }
  let res = await http({
    url: `users/uploadAvatar/${id}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  tokenStore.setAvatar(`${baseUrl}${res.data.data[0].avatar_url}`)
}
// 自定义验证规则————重复密码
const validatePwd = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再输入一次密码！"))
  } else if (value !== ruleForm.value.newPassword) {
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
  oldPassword: [
    { required: true, message: "密码不可为空！", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度为6-18位！", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "密码不可为空！", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度为6-18位！", trigger: "blur" },
  ],
  repeatNewPassword: [
    { required: true, validator: validatePwd, trigger: "blur" },
  ],
})
//下拉框选择事件
const handleSelect = (index) => {
  if (index === "0-1") {
    //修改信息弹框
    dialogFormVisible.value = !dialogFormVisible.value
    ruleForm.value.username = tokenStore.username
  } else if (index === "0-2") {
    //用户管理
    router.push("/user-management")
  } else if (index === "0-3") {
    //退出登录
    router.push("/login")
    tokenStore.setToken("")
    tokenStore.setUsername("")
    tokenStore.setType("")
    tokenStore.setId(null)
    tokenStore.setAvatar("")
    ElMessage({
      message: "退出成功！",
      type: "success",
      duration: 1000,
    })
  }
}
//修改信息
const handleUpdate = async (formEl) => {
  let id = tokenStore.id
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await http({
        url: "users/updateOwnInfo",
        data: {
          id,
          username: ruleForm.value.username,
          oldPassword: ruleForm.value.oldPassword,
          newPassword: ruleForm.value.newPassword,
          repeatNewPassword: ruleForm.value.repeatNewPassword,
        },
      })
      if (res.data.status === 0) {
        tokenStore.setUsername(ruleForm.value.username)
        dialogFormVisible.value = false
        ElMessage({
          message: "修改成功！",
          type: "success",
          duration: 1000,
        })
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
//关闭dialog对话框
const handleCloseDialog = () => {
  ruleForm.value.username = ""
  ruleForm.value.oldPassword = ""
  ruleForm.value.newPassword = ""
  ruleForm.value.repeatNewPassword = ""
}
</script>
<style scoped>
.el-menu {
  max-width: 772px;
  height: 65px;
  box-sizing: border-box;
  background: #e8e8e8;
}
.user-container {
  height: 100%;
}
.avatar-uploader {
  width: 140px;
  height: 140px;
  border: 1px dashed #eee;
  display: flex;
  justify-content: center;
}
.avatar-uploader-icon {
  font-size: 20px;
}
.user-container:deep(.el-menu--horizontal
    > .el-sub-menu
    .el-sub-menu__title):hover {
  background: #e8e8e8 !important;
}
.user-container:deep(.el-sub-menu.is-active) {
  --el-menu-active-color: none !important;
}
</style>
