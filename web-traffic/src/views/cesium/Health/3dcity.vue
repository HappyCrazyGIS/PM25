<template>
  <div ref="cesiumContainer" class="container">
    <div class="right-overlay">
      <NavbarCon></NavbarCon>
    </div>
  </div>
</template>

<script setup lang="ts">
// window.CESIUM_BASE_URL = '/static/cesium'
import NavbarCon from './Home/child/NavbarCon.vue';
import { onMounted, ref } from 'vue'
import {
  Cartesian3,
  createOsmBuildingsAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  Globe
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const cesiumContainer = ref(null)

onMounted(async () => {
  if (cesiumContainer.value) {
    // 异步加载 token
    const response = await fetch('../../../../cesium_token.json')
    const data = await response.json()
    console.log(data.token)
    Ion.defaultAccessToken = data.token

    // 创建 Cesium 视图
    const viewer = new Viewer(cesiumContainer.value, {
      // 配置项
      terrain: Terrain.fromWorldTerrain()
    })

    // 示例配置
    viewer.camera.flyTo({
      //经纬度和高度
      destination: Cartesian3.fromDegrees(116.3910, 39.900, 400),
      orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-15.0)
      }
    })

    // 在 viewer 初始化之后添加建筑物图层
    const osmBuildings = await createOsmBuildingsAsync();
    viewer.scene.primitives.add(osmBuildings);
  }
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  position: relative; /* 确保子元素可以相对于此元素定位 */
  z-index: 0; /* 确保子元素在此元素之上 */
  display: flex; /* 使用 flexbox 布局 */
  align-items: center; /* 垂直居中 */
}

.right-overlay {
  position: absolute;
  left: 0.1vw;
  width: 200px; /* 或者你需要的宽度 */
  background-color: rgba(222, 230, 226, 0.5); /* 半透明黑色，你可以根据需要调整颜色和透明度 */
  z-index: 1; /* 设置一个比 .container 元素更大的 z-index 值 */
}
</style>
