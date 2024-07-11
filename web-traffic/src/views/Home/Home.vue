<template>
  <header>
    <el-row style="user-select: none">
      <el-col :span="4"><Logo></Logo></el-col>
      <el-col :span="13"><NavbarCon></NavbarCon></el-col>
      <el-col :span="5"> <Search></Search></el-col>
      <el-col :span="1"><UserInfo></UserInfo></el-col>
    </el-row>
  </header>

  <div class="icon" @click="reset">
    <i class="iconfont icon-dingwei"></i>
  </div>
  <div class="control">
    <img src="/images/矢量.jpg" alt="" id="shiliang" @click="isShow(false)" />
    <img src="/images/影像.jpg" alt="" id="yingxiang" @click="isShow(true)" />
  </div>
  <div id="map">
    <div id="mouse-position"></div>
  </div>
  <LayerDirectory
    v-if="tokenStore.type == 'traffic' || tokenStore.type == 'admin'"
  ></LayerDirectory>
</template>
<script setup>
/* 引入子组件导航栏 */
import Logo from "./child/Logo.vue"
import NavbarCon from "./child/NavbarCon.vue"
import Search from "./child/Search.vue"
import UserInfo from "./child/UserInfo.vue"
/* 初始化地图 */
import { initMap } from "./Hooks/initMap"
import { FlyTo } from "./Hooks/flyTo"
// 导入各个控件
import { addControl_ } from "./Hooks/addControl"
// 切换map
import { toggleMap } from "./Hooks/toggleMap"
// 导入数据图层
import { addDataMap } from "./Hooks/addDataMap"
// 导入目录树组件
import LayerDirectory from "./child/LayerDirectory.vue"
import { nextTick } from "vue"
import { useMap } from "../../stores/useMap"
import { useToken } from "../../stores/useToken"
const { map } = initMap()
const store = useMap()
const tokenStore = useToken()
store.setMap(map)
// 复位
const reset = () => {
  const view = map.value.getView()
  FlyTo({ view })
}
// 切换图层
const isShow = (flag) => {
  toggleMap(map.value, flag)
}
nextTick(() => {
  // 飞行视角
  setTimeout(() => {
    reset()
    // // 加载数据图层
    const gg_layer = addDataMap()
    store.setggMap(gg_layer.value)
    map.value.addLayer(gg_layer.value)
    // 添加各个控件
    const control = addControl_()
    control.forEach((item) => {
      map.value.addControl(item)
    })
  }, 1000)
})
</script>
<style scoped>
@import url("@/assets/styles/control.css");
#map {
  width: 100vw;
  height: 100vh;
  position: relative;
}
header {
  width: 100%;
  background: #e8e8e8;
  position: fixed;
  top: 0;
  z-index: 100;
}
</style>
