<template>
  <div class="container">
    <el-card>
      <div class="card-top">
        <el-button
          type="primary"
          @click="dialogFormVisible = !dialogFormVisible"
        >
          <el-icon><CirclePlus /></el-icon>
          &nbsp;添加用户
        </el-button>
        <div>
          <el-input
            v-model="inputSearch"
            class="inputSearch"
            placeholder="请输入搜索关键字"
            prefix-icon="Search"
            @change="handleSearch"
          />
          <el-button type="primary" @click="resetSearch"
            ><el-icon><Refresh /></el-icon>&nbsp;重置</el-button
          >
        </div>
      </div>
      <!-- 表格 -->
      <el-table :data="searchResult.length ? searchResult : tableData">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="type" label="用户类型" width="180" />
        <el-table-column prop="onlinestatus" label="账号状态" width="180">
          <template #default="scope">
            <el-switch
              v-model="scope.row.onlinestatus"
              :active-value="1"
              :inactive-value="0"
              @change="switchToggle(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- 表格操作栏 -->
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              :type="scope.row.type == 'common' ? 'success' : 'info'"
              plain
              @click="handleChange(scope.row)"
              ><el-icon :size="18">
                <Upload v-if="type == 'common'" />
                <Download v-else />&nbsp; </el-icon
              >{{ type == "common" ? "升级" : "降级" }}
            </el-button>
            <el-button type="warning" plain @click="handleOpenDialog(scope.row)"
              ><el-icon><Edit /></el-icon>&nbsp; 修改</el-button
            >
            <el-button type="danger" plain @click="handleDelete(scope.row)"
              ><el-icon><Delete /></el-icon>&nbsp;删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="card-foot">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 14]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchResult.length ? searchTotal : total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增用户/修改用户Dialog对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="id ? '修改用户信息' : '添加用户'"
      width="400px"
      @close="handleCloseDialog"
    >
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item style="margin: 0 0 -10px 228px">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateAdd(ruleFormRef)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 确认删除用户Dialog对话框 -->
    <el-dialog
      v-model="centerDialogVisible"
      width="400px"
      align-center
      @close="handleCloseDialog"
    >
      <span>确认删除该用户？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDialogDelete">
            删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue"
import http from "../../../api/http"
import { ElMessage } from "element-plus"

let tableData = ref([]) //所有用户数据
let type = ref("common") //用户身份
let searchResult = ref([]) //搜索结果
let inputSearch = ref("") //搜索框数据
let currentPage = ref(1) //当前页
let pageSize = ref(10) //单页显示数据条数
let total = ref(0)
let searchTotal = ref(0)
let dialogFormVisible = ref(false)
let centerDialogVisible = ref(false)
let ruleFormRef = ref()
let id = ref(null) //操作行的用户id
const ruleForm = ref({
  username: "", //操作行的用户名
  password: "", //操作行的用户密码
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
//接收父组件的值
const props = defineProps({
  flag: {
    type: String,
  },
})
//监听props
watchEffect(async () => {
  type.value = props.flag
  let res = await http({
    url: "users/getUser",
    method: "get",
    params: {
      type: type.value,
      page: currentPage.value,
      size: pageSize.value,
    },
  })
  if (res.data.status === 0) {
    tableData.value = res.data.data
    total.value = res.data.total
  }
})
//获取用户信息
const getData = async () => {
  let res = await http({
    url: "users/getUser",
    method: "get",
    params: {
      type: type.value,
      page: currentPage.value,
      size: pageSize.value,
    },
  })
  if (res.data.status === 0) {
    tableData.value = res.data.data
    total.value = res.data.total
  }
}
//更改用户身份（升级/降级）
const handleChange = async (row) => {
  let id = row.user_id
  let type = row.type == "common" ? "traffic" : "common"
  let res = await http({
    url: "users/changeUser",
    data: {
      id,
      type,
    },
  })
  let message = row.type == "common" ? "升级成功！" : "降级成功！"
  if (res.data.status === 0) {
    getData()
    ElMessage({
      message,
      type: "success",
      duration: 1000,
    })
  }
}
//打开更新用户信息对话框
const handleOpenDialog = (row) => {
  id.value = row.user_id
  ruleForm.value.username = row.username
  // ruleForm.value.password = row.password
  dialogFormVisible.value = !dialogFormVisible.value
}
// 更新用户信息/添加用户
const handleUpdateAdd = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // console.log(id.value)
      /* 根据时候存在用户id来判断是执行新增功能还是更新功能 */
      if (id.value) {
        //修改用户信息
        let res = await http({
          url: "users/updateUser",
          data: {
            id: id.value,
            username: ruleForm.value.username,
            password: ruleForm.value.password,
          },
        })
        if (res.data.status === 0) {
          getData()
          dialogFormVisible.value = false
          ElMessage({
            message: "修改成功！",
            type: "success",
            duration: 1000,
          })
        }
      } else {
        //新增用户
        let res = await http({
          url: "users/addUser",
          data: {
            username: ruleForm.value.username,
            password: ruleForm.value.password,
            type: type.value,
          },
        })
        if (res.data.status === 0) {
          getData()
          dialogFormVisible.value = false
          ElMessage({
            message: "添加成功！",
            type: "success",
            duration: 1000,
          })
        }
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
//确认是否删除用户
const handleDelete = (row) => {
  centerDialogVisible.value = !centerDialogVisible.value
  id.value = row.user_id
}
//删除用户
const handleDialogDelete = async () => {
  let res = await http({
    url: "users/deleteUser",
    data: {
      id: id.value,
    },
  })
  if (res.data.status === 0) {
    getData()
    centerDialogVisible.value = false
    ElMessage({
      message: "删除用户成功！！",
      type: "success",
      duration: 1000,
    })
  }
}
//切换登录状态
const switchToggle = async (row) => {
  let id = row.user_id
  let onlinestatus = row.onlinestatus
  let res = await http({
    url: "users/toggleUser",
    data: {
      id,
      onlinestatus,
    },
  })
  if (res.data.status === 0) {
    ElMessage({
      message: "切换状态成功！",
      type: "success",
      duration: 1000,
    })
  }
}
//关闭dialog对话框
const handleCloseDialog = () => {
  id.value = null
  ruleForm.value.username = ""
  ruleForm.value.password = ""
}
//搜索
const handleSearch = async () => {
  let keyword = inputSearch.value
  if (keyword) {
    let res = await http({
      url: "users/searchUser",
      method: "get",
      params: {
        keyword,
        type: type.value,
        page: currentPage.value,
        size: pageSize.value,
      },
    })
    if (res.data.status == 0) {
      searchTotal.value = res.data.total
      searchResult.value = res.data.data
    }
  } else {
    resetSearch()
  }
}
//重置搜索
const resetSearch = () => {
  searchResult.value = []
  inputSearch.value = ""
  searchTotal.value = 0
}
//单页显示数据条数变化
const handleSizeChange = (size) => {
  getData()
}
//当前页码变化
const handleCurrentChange = (page) => {
  getData()
}
</script>
<style scoped>
.card-top {
  width: 840px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.inputSearch {
  width: 220px;
  margin-right: 10px;
}
.card-foot {
  margin-top: 10px;
}
</style>
