<template>
  <div class="line-container">
    <el-menu-item index="4-1" @click="openMeasureLine">距离测量</el-menu-item>
    <el-menu-item index="4-2" @click="openMeasureArea">面积测量</el-menu-item>
  </div>
</template>
<script setup>
import { useMap } from "../../stores/useMap"
import { activeDraw, clearLayer } from "../Hooks/activeDraw"
import { handleDrawStart, handleDrawEnd } from "../Hooks/measure"
import EventBus from "../../Bus/event"
const store = useMap()
// 开启测量
const openMeasureLine = () => {
  // 清除画笔
  store.removeDraw()
  // clearLayer()
  // 打开清除画笔
  EventBus.emit("removeDraw", true)
  activeDraw(store.map.value, "LineString", handleDrawStart, handleDrawEnd)
}
const openMeasureArea = () => {
  // 清除画笔
  store.removeDraw()
  // clearLayer()
  // 打开清除画笔
  EventBus.emit("removeDraw", true)
  activeDraw(store.map.value, "Polygon", handleDrawStart, handleDrawEnd)
}
</script>
<style>
.measureTooltipEle {
  position: relative;
  background: #3fc1c9;
  border-radius: 4px;
  color: #fff;
  border: 1px solid white;
  padding: 4px 8px;
  opacity: 0.9;
  white-space: nowrap;
  z-index: 999;
}
.measureTooltipEle:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
  border-top-color: #3f72af;
}
</style>
