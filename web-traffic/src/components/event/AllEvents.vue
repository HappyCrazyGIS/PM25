<template>
  <div class="all-container">
    <el-menu-item index="6-4" @click="handleOpen">所有事件</el-menu-item>
    <el-dialog
      class="event-dialog"
      v-model="dialogVisible"
      width="80%"
      align-center
      append-to-body
      @open="handleAll"
      @close="handleClose"
    >
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="User" name="first">
          <template #label>
            <el-button type="success">事件列表</el-button>
          </template>
          <EventTable :eventData="eventList"></EventTable>
          <div class="demo-pagination-block" style="margin-top: 30px">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[2, 5, 10, 20]"
              background
              layout="total, sizes,prev, pager, next,  jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              hide-on-single-page
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Config">
          <template #label>
            <el-button type="success">事件统计图</el-button>
          </template>
          <el-row>
            <el-col :span="10">
              <div class="card">
                <div class="home">
                  <v-chart class="vuechart" :option="echPie" />
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="card">
                <div class="home">
                  <v-chart class="vuechart_" :option="echLine" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue"
import EventTable from "./child/EventTable.vue"
import { useEcharts, queryAll } from "../Hooks/useEcharts"
import { format } from "../Hooks/format"
const dialogVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
let eventList = ref([])
const activeName = ref("first")
let echPie = ref(null)
let echLine = ref(null)
let service = {
  name: "guanggu",
  layerId: 2,
}
// 点击事件,打开弹框
const handleOpen = () => {
  dialogVisible.value = true
}
// 打开弹框的回调
let timer = null
const handleAll = () => {
  queryAll()
  getAllEvents()
  timer = setTimeout(() => {
    const { dataPie, dataLine } = useEcharts()
    echPie.value = dataPie.value
    echLine.value = dataLine.value
  }, 200)
}
const handleClose = () => {
  clearTimeout(timer)
}
// 请求数据
const getAllEvents = () => {
  Query.queryLineByRectangle({
    page: currentPage.value - 1,
    size: pageSize.value,
    service,
    callback: (res) => {
      // console.log(res)
      const result = format(res)
      eventList.value = result.SFEleArray
      total.value = res.TotalCount
    },
  })
}
// 改变条数回调
const handleSizeChange = (size) => {
  // console.log(size)
  pageSize.value = size
  getAllEvents()
}
// 改变页码回调
const handleCurrentChange = (page) => {
  // console.log(page)
  currentPage.value = page
  getAllEvents()
}
</script>
<style>
@import "../../assets/styles/card.css";
.event-dialog.el-dialog {
  background: #e8e8e8;
  min-height: 50%;
}
.event-dialog .el-tabs {
  min-height: 420px;
}
.event-dialog .el-dialog__body {
  padding-top: 10px;
}
.event-dialog .el-button {
  margin-bottom: 10px;
}
.event-dialog .el-row .vuechart {
  padding-top: 15px;
  height: 400px;
  width: 400px;
}
.event-dialog .el-row .vuechart_ {
  padding-top: 15px;
  height: 400px;
  width: 600px;
}
</style>
