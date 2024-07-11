<template>
  <div class="container">
    <div @click="dialogTableVisible = true">查看公告</div>
    <el-dialog
      v-model="dialogTableVisible"
      width="50%"
      @close="handleDialogClose"
      @open="handleDialogOpen"
      :append-to-body="true"
    >
      <template #header="{ titleClass }">
        <div class="my-header">
          <h1 :class="titleClass">公告</h1>
        </div>
      </template>
      <div class="box">
        <div class="notice_list">
          <el-table
            class="list_table"
            :data="noticeData"
            @row-click="handleRowClick"
            :highlight-current-row="highlightFlag"
          >
            <el-table-column
              property="notice_title"
              width="150"
              align="center"
            />
            <el-table-column
              property="notice_time"
              width="190"
              align="center"
            />
          </el-table>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :pager-count="5"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="notice_detail">
          <h2>{{ showTitle ? showTitle : noticeData[0].notice_title }}</h2>
          <div class="notice_content">
            &nbsp;&nbsp;{{
              showContent ? showContent : noticeData[0].notice_content
            }}
          </div>
          <div class="notice_username">
            发布者：{{ showUsername ? showUsername : noticeData[0].username }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import http from "../../api/http"

let dialogTableVisible = ref(false) //控制Dialog弹框的显隐
let noticeData = ref([]) //公告数据
let showContent = ref("") //当前公告内容
let showTitle = ref("") //当前公告标题
let showUsername = ref("") //当前公告发布者
let currentPage = ref(1) //当前页
let pageSize = ref(5) //一页的数据个数
let small = ref(true) //是否使用小型分页样式
let background = ref(false) //是否为分页按钮添加样式
let disabled = ref(false) //是否禁用分页
let total = ref(0) //数据总个数
let highlightFlag = ref(true)

onMounted(() => {
  getNotice()
})
//打开dialog对话框的回调
const handleDialogOpen = () => {
  getNotice()
}
//清空缓存数据
const clearInfo = () => {
  showContent.value = ""
  showTitle.value = ""
  showUsername.value = ""
}
//获取公告
const getNotice = async () => {
  let res = await http({
    url: "notice/getNotice",
    method: "get",
    params: {
      page: currentPage.value,
      size: pageSize.value,
    },
  })
  if (res.data.status === 0) {
    noticeData.value = res.data.data
    total.value = res.data.total
  }
}
//行点击事件
const handleRowClick = (row) => {
  showTitle.value = row.notice_title
  showContent.value = row.notice_content
  showUsername.value = row.username
}
//当前页变化事件
const handleCurrentChange = (page) => {
  currentPage.value = page
  clearInfo()
  getNotice()
}
//dialog对话框关闭时的回调
const handleDialogClose = () => {
  clearInfo()
}
</script>
<style scoped>
.container .el-dialog {
  min-width: 680px;
}
.box {
  display: flex;
  min-width: 640px;
  min-height: 240px;
}
.notice_list {
  display: inline-block;
  width: 340px;
  margin-top: -20px;
}
.notice_list .list_table {
  margin-bottom: 10px;
}
.notice_list >>> .el-table__row > td {
  /* 去掉行内边框 */
  border: none;
}
.notice_list >>> .el-table_1_column_1 .cell {
  color: #111;
  font-size: 16px;
  font-weight: 400;
}
.notice_list >>> .el-table_1_column_2 .cell {
  color: #aaa;
  font-size: 12px;
}
.notice_detail {
  display: inline-block;
  margin-left: 40px;
  margin-top: -40px;
  /* min-width: 380px; */
  width: 100%;
  position: relative;
}
.notice_detail .notice_content {
  margin-top: 20px;
}
/* .container >>> .el-dialog__body {
  padding-top: 0;
} */
.notice_username {
  position: absolute;
  right: 20px;
  bottom: 0;
}
</style>
