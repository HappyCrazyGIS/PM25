<template>
  <div class="query-container">
    <el-menu-item index="6-1" @click="activeDraw">拉框查询</el-menu-item>
    <el-dialog
      v-model="dialogVisible"
      width="80%"
      align-center
      append-to-body
      @close="handleClone"
    >
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
    </el-dialog>
  </div>
</template>
<script setup>
import EventTable from "./child/EventTable.vue"
import { nextTick, ref } from "vue"
import { useMap } from "../../stores/useMap"
import { format } from "../Hooks/format"
import EventBus from "../../Bus/event"
const store = useMap()
let dialogVisible = ref(false)
let eventList = ref([])
let geometry = ref(null)
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
let draw = ref(null)
let source = ref(null)
// 激活画笔
const activeDraw = () => {
  store.removeDraw()
  draw.value = createDraw({
    type: "Rectangle",
    source: source.value,
    handleDrawEnd: handleDraw,
  })
  store.map.value.addInteraction(draw.value)
  store.draw = draw.value
  EventBus.emit("removeDraw")
}
// 画笔回调
const handleDraw = (e) => {
  geometry.value = e.feature.getGeometry()
  queryInfo(geometry.value)
}
// 查询拉框范围的要素信息
const queryInfo = (geometry) => {
  let service = {
    name: "guanggu",
    layerId: 2,
  }
  Query.queryByGeom({
    size: pageSize.value,
    page: currentPage.value - 1,
    geometry,
    service,
    callback: (res) => {
      // console.log(res)
      const result = format(res)
      eventList.value = result.SFEleArray
      total.value = res.TotalCount
      dialogVisible.value = true
    },
  })
}
// 弹框关闭的回调
const handleClone = () => {
  source.value.clear()
}
// 改变条数回调
const handleSizeChange = (size) => {
  // console.log(size)
  pageSize.value = size
  queryInfo(geometry.value)
}
// 改变页码回调
const handleCurrentChange = (page) => {
  // console.log(page)
  currentPage.value = page
  queryInfo(geometry.value)
}
nextTick(() => {
  source.value = new ol.source.Vector({})
  var layer = new ol.layer.Vector({
    source: source.value,
  })
  store.map.value.addLayer(layer)
})
</script>
<style></style>
