<template>
  <div class="NavbarCon-container">
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="queryGgWay">实时路况</el-menu-item>
      <el-menu-item index="2" v-if="tokenStore.type == 'common'"
        ><Notice></Notice
      ></el-menu-item>
      <el-menu-item
        index="3"
        @click="roadDialog = true"
        v-if="tokenStore.type == 'common'"
        >报告路况</el-menu-item
      >
      <NavbarTraffic
        v-if="tokenStore.type == 'traffic' || tokenStore.type == 'admin'"
      ></NavbarTraffic>
      <el-sub-menu index="4">
        <template #title>工具箱</template>
        <Measure></Measure>
        <ExportPic></ExportPic>
      </el-sub-menu>
    </el-menu>
    <div class="traffic-signs" v-if="nowTrafficeFlag">
      <button style="background-color: #34b000">通畅</button>
      <button style="background-color: #fecb00">缓慢</button>
      <button style="background-color: #8e0e0b">拥堵</button>
    </div>
    <report-road
      :roadDialog="roadDialog"
      @toggle="roadDialog = false"
    ></report-road>
    <div class="removeDraw" @click="removeDraw" v-if="flag">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="清除画笔"
        placement="bottom-start"
      >
        <i class="iconfont icon-huabi"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup>
import NavbarTraffic from "./NavbarTraffic.vue"
import ReportRoad from "../../../components/event/ReportRoad.vue"
import Measure from "../../../components/Toolbox/Measure.vue"
import ExportPic from "../../../components/Toolbox/ExportPic.vue"
import { queryTrafficWay } from "./Hooks/queryTrafficWay"
import { ref } from "vue"
import { useMap } from "../../../stores/useMap"
import Notice from "../../../components/Notice/Notice.vue"
import { useToken } from "../../../stores/useToken"
import EventBus from "../../../Bus/event"
//清除测量图层
import { clearLayer } from "../../../components/Hooks/activeDraw"
import { removeOverlay } from "../../../components/Hooks/measure"
EventBus.on("removeDraw", (val = false) => {
  flag.value = true
  clearMeasureLayer.value = val
})
// 控制清除画笔按钮
let flag = ref(false)
// 控制清除测量图层
let clearMeasureLayer = ref(false)
// 控制实时路况的显隐
let nowTrafficeFlag = ref(false)
let roadDialog = ref(false)
const store = useMap()
const tokenStore = useToken()
/* 查询gg实时路况 */
const queryGgWay = () => {
  queryTrafficWay(nowTrafficeFlag, store.map)
}
// 清除画笔
const removeDraw = () => {
  store.removeDraw()
  // 清除测量图层
  if (clearMeasureLayer.value) {
    clearLayer()
    removeOverlay()
  }
  flag.value = false
}
</script>
<style scoped>
.el-menu {
  max-width: 772px;
  height: 65px;
  box-sizing: border-box;
  background: #e8e8e8;
  font-weight: 700;
  font-size: 16px;
}
.traffic-signs {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}
.traffic-signs button {
  width: 50px;
  height: 25px;
  color: white;
  border: 0;
  margin-left: 10px;
}
.removeDraw {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  position: fixed;
  top: 16%;
  right: 70px;
  background: rgba(0, 60, 136, 1);
  border-radius: 5px;
}
.removeDraw:hover {
  background: #3f72af;
}
.removeDraw .icon-huabi {
  font-size: 25px;
  color: #fff;
}
</style>
