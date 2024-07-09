<template>
  <el-dialog
    v-model="dialogVisible"
    width="70%"
    align-center
    center
    :show-close="false"
    @open="handleOpen"
  >
    <div class="form">
      <input
        class="input"
        placeholder="Type your keyword"
        required=""
        v-model="keyword"
        type="text"
        @keyup.enter="handleFind"
      />
      <span class="input-border"></span>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; margin-top: 25px"
      fit
      height="370"
      border
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#909399',
        height: '60px',
      }"
    >
      <el-table-column
        align="center"
        prop="user_id"
        label="用户ID"
        width="100"
      />
      <el-table-column
        align="center"
        prop="event_type"
        label="事件类型"
        width="100"
      />
      <el-table-column align="center" prop="event_addr" label="事件地址" />
      <el-table-column align="center" prop="event_mark" label="建筑标识" />
      <el-table-column
        sortable
        align="center"
        prop="event_time"
        label="发生时间"
        width="180"
      />
      <el-table-column
        align="center"
        prop="event_desc"
        label="事件描述"
        width="180"
      />
      <el-table-column align="center" label="操作" width="150">
        <template #default="scope">
          <span v-if="scope.row.event_status == 1" style="color: #303133"
            >通过审核</span
          >
          <div v-else>
            <el-button
              type="success"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              >通过</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >忽略</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleEmit">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </span>
    </template>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[2, 5, 10, 20]"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        hide-on-single-page
      />
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watchEffect } from "vue"
import { getRoadInfo, updateInfo } from "../../request/eventHttp"
import { ElMessage, ElMessageBox } from "element-plus"
let tableData = ref([])
let keyword = ref("") //搜索框内容
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
// 控制弹框
let dialogVisible = ref(false)
let props = defineProps({
  roadShow: {
    type: Boolean,
    required: true,
  },
})
/* 子传父 */
const emit = defineEmits(["toggle"])
const handleEmit = () => {
  emit("toggle")
}
// 监听父传子传值
watchEffect(() => {
  dialogVisible.value = props.roadShow
})
const handleConfirm = () => {
  emit("toggle")
  tableData.value = []
}
// 打开弹框回调
const handleOpen = () => {
  if (tableData.value.length == 0) {
    getEvent()
  }
}
// 请求数据的方法
const getEvent = async (keyword = null) => {
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    type: keyword,
  }
  const { data } = await getRoadInfo(params)
  // console.log(data)
  total.value = data.result.total
  tableData.value = data.result.rows
}
// 改变条数回调
const handleSizeChange = (size) => {
  // console.log(size)
  pageSize.value = size
  getEvent()
}
// 改变页码回调
const handleCurrentChange = (page) => {
  // console.log(page)
  currentPage.value = page
  getEvent()
}
// 修改数据
const updateStatus = async (row, status, msg) => {
  const { data } = await updateInfo({
    id: row.event_id,
    status,
  })
  if (data.code == 0) {
    // console.log(data)
    row.event_status = status
    ElMessage({
      message: msg,
      type: "success",
      offset: 70,
      duration: 1600,
    })
  }
}
// 通过
const handleEdit = (index, row) => {
  // console.log(row)
  const status = 1
  updateStatus(row, status, "已通过")
}
// 忽略
const handleDelete = (index, row) => {
  ElMessageBox.confirm("确定删除吗,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const status = 2
      updateStatus(row, status, "已删除")
      getEvent()
    })
    .catch(() => {
      ElMessage({
        message: "已取消删除",
        type: "info",
        offset: 70,
        duration: 1600,
      })
    })
}
// 搜素框
const handleFind = () => {
  if (keyword.value) {
    getEvent(keyword.value)
    keyword.value = ""
  } else {
    ElMessage({
      message: "请输入事件类型",
      type: "warning",
      offset: 70,
      duration: 1600,
    })
  }
}
</script>
<style scoped>
@import "../../assets/styles/input.css";
.el-dialog:deep(.el-table) {
  margin-top: 25px;
}
:deep(.el-table__body) {
  color: #4682b4;
  font-weight: normal;
}
:deep(.el-pagination) {
  margin-top: 15px;
  justify-content: flex-end;
}
:deep(.el-input__wrapper) {
  margin-left: 10px;
}
:deep(.el-table__row) {
  height: 65px;
}
</style>
