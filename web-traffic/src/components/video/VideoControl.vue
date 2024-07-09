<template>
  <el-menu-item index="5" @click="activeDraw">视频监控</el-menu-item>
  <el-dialog
    class="video-dialog"
    v-model="dialogVisible"
    title="摄像头"
    width="30%"
    align-center
    center
    draggable
    @close="handleClose"
  >
    <el-table
      :data="dataVideo"
      stripe
      style="width: 100%; user-select: none"
      fit
      border
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#909399',
        height: '50px',
      }"
    >
      <el-table-column
        align="center"
        prop="AttValue[1]"
        label="编号"
        width="140"
      />
      <el-table-column align="center" prop="AttValue[2]" label="位置" />
    </el-table>
    <div class="card">
      <video src="/video/video_1.mp4" controls width="350" height="300"></video>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue"
import { useMap } from "../../stores/useMap"
import { createLayer, clearLayer } from "../Hooks/createLayer"
import { ElMessage } from "element-plus"
import EventBus from "../../Bus/event"
const store = useMap()
const dialogVisible = ref(false)
// 摄像头数据
let dataVideo = ref(null)
// 数据源
let source = ref(null)
let draw = ref(null)
// 激活画笔
const activeDraw = () => {
  store.removeDraw()
  draw.value = createDraw({
    source: source.value,
    handleDrawEnd: handleDraw,
  })
  store.map.value.addInteraction(draw.value)
  store.draw = draw.value
  EventBus.emit("removeDraw")
}
//关闭的回调
const handleClose = () => {
  clearLayer(store.map.value)
}
// 画笔回调
const handleDraw = (e) => {
  // console.log(e.feature.getGeometry().getCoordinates())
  const position = e.feature.getGeometry().getCoordinates()
  const service = {
    name: "guanggu",
    layerId: 3,
  }
  Query.queryClick({
    position,
    service,
    callback: (res) => {
      // console.log(res)
      if (res.SFEleArray.length != 0) {
        var format = new Zondy.Format.PolygonJSON()
        //将MapGIS要素JSON反序列化为ol.Feature类型数组
        var features = format.read(res)
        const layer = createLayer(features)
        store.map.value.addLayer(layer)
        dataVideo.value = res.SFEleArray
        dialogVisible.value = true
      } else {
        ElMessage({
          message: "查询无结果,请重试",
          type: "error",
          offset: 70,
          duration: 1400,
        })
      }
    },
  })
}
</script>
<style>
.video-dialog {
  background: #e8e8e8;
}
.video-dialog .el-table .el-table__body {
  color: #4682b4;
  font-weight: 400;
}
.video-dialog video {
  display: block;
  border-radius: 20px;
  margin: 0 auto;
}
.video-dialog .card {
  margin: 20px auto 0;
  padding: 20px;
  width: 350px;
  border-radius: 30px;
  background: #e0e0e0;
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
}
</style>
