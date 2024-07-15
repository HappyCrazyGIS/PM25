<template>
  <div ref="cesiumContainer" class="container"></div>
</template>

<script setup lang="ts">
// window.CESIUM_BASE_URL = '/static/cesium'
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
}
</style>
