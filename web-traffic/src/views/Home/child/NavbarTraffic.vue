<template>
  <VideoControl></VideoControl>
  <el-sub-menu index="6">
    <template #title>事件管理</template>
    <BoxQuery></BoxQuery>
    <AddEvent></AddEvent>
    <AllEvents></AllEvents>
  </el-sub-menu>
  <el-sub-menu index="7">
    <template #title>事故多发地</template>
    <el-menu-item index="7-1" @click="queryAccidentArea(true)"
      >查看事故</el-menu-item
    >
    <el-menu-item index="7-2" @click="queryAccidentArea(false)"
      >取消查看</el-menu-item
    >
  </el-sub-menu>
  <el-menu-item index="8" @click="roadDrawer = true">路况信息</el-menu-item>
  <el-sub-menu index="9">
    <template #title>公告管理</template>
    <el-menu-item index="9-1"> <Notice></Notice> </el-menu-item>
    <el-menu-item index="9-2">
      <TrafficNotice></TrafficNotice>
    </el-menu-item>
  </el-sub-menu>
  <div class="slider-demo-block" v-if="sliderShow">
    <div class="radius">
      <span style="width: 80px; padding-right: 5px">热点半径</span>
      <el-slider
        v-model="radius"
        show-input
        :min="1"
        :max="40"
        @input="handleRadius"
      />
    </div>
    <div class="blur">
      <span style="width: 80px; padding-right: 5px">模糊尺寸</span>
      <el-slider
        v-model="blur"
        show-input
        :min="1"
        :max="40"
        @input="handleBlur"
      />
    </div>
  </div>
  <div class="dialog-box">
    <RoadInfo :roadShow="roadDrawer" @toggle="roadDrawer = false"></RoadInfo>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { useMap } from "../../../stores/useMap"
import VideoControl from "../../../components/video/VideoControl.vue"
import RoadInfo from "../../../components/event/RoadInfo.vue"
import AllEvents from "../../../components/event/AllEvents.vue"
import BoxQuery from "../../../components/event/BoxQuery.vue"
import AddEvent from "../../../components/event/AddEvent.vue"
import TrafficNotice from "../../../components/Notice/TrafficNotice.vue"
import Notice from "../../../components/Notice/Notice.vue"
import { createHeatmap, setRadius, setBlur } from "./Hooks/createHeatmap"
const store = useMap()
// 控制路况弹框
let roadDrawer = ref(false)
// 控制滑块显隐
let sliderShow = ref(false)
// 控制滑块
const radius = ref(10)
const blur = ref(10)
// 查询事故多发地,并创建热力图
const queryAccidentArea = (showHeatmap) => {
  sliderShow.value = showHeatmap
  createHeatmap(store.map.value, showHeatmap, radius.value, blur.value)
}
const handleRadius = () => {
  setRadius(radius.value)
}
const handleBlur = () => {
  setBlur(blur.value)
}
</script>
<style scoped>
.slider-demo-block {
  background: rgba(7, 24, 46, 0.8);
  /* height: 0px; */
  width: 350px;
  padding: 10px;
  position: fixed;
  top: 110px;
  right: 4%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  border-radius: 8px;
  user-select: none;
}
.radius,
.blur {
  font-size: 14px;
  color: #fff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.radius .el-slider,
.blur .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block :deep(.el-slider__input) {
  height: 25px;
  width: 100px;
}
.slider-demo-block :deep(.el-input-number__decrease),
.slider-demo-block :deep(.el-input-number__increase) {
  width: 24px;
}
</style>
