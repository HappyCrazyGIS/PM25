<template>
  <div ref="cesiumContainer" class="container">
    <!-- 左边导航栏 -->
    <div class="right-overlay">
      <NavbarCon @updateParentData="handleUpdate"></NavbarCon>
    </div>
  </div>
  <!-- 右边路径规划 -->
  <div class="menu" v-if="showRouteSearch">
    <!-- <span class="menu_switch"></span> -->
    <el-input class="routeBox" v-model="startPoint" id="tipinput1"   placeholder="请输入起点" />
    <el-input class="routeBox" v-model="endPoint" id="tipinput2"   placeholder="请输入起点" />
    <el-select class="routeBox" v-model="drivingOption" placeholder="Select" >
    <el-option
      class="routeBox"
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"/>
    </el-select>
    <el-button @click="searchRoute" class="routeBoxBbutton">开始导航</el-button>
    <el-button @click="" class="routeBoxBbutton">污染分析</el-button>
  </div>
</template>

<script setup lang="ts">
// window.CESIUM_BASE_URL = '/static/cesium'
import NavbarCon from './Home/child/NavbarCon.vue';
import { onMounted, ref, nextTick} from 'vue'
import {
  Cartesian3,
  createOsmBuildingsAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  Color,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Roaming } from '../../../api/routeVisibility.js';
import {getRouteData,getCoorTransform} from '../../../api/searchroute.js'

import { setRoute, } from './Home/child/Hooks/healthRoute.js';
const options = ref([
  {value:'driving', label:'驾车'},
  {value:'walking', label:'步行'},
  {value:'bicycling', label:'骑行'},
  {value:'/electrobike', label:'电车'},
  {value:'integrated', label:'公交'}
])
const drivingOption = ref('driving')
// 存放 viewer 实例
const v = ref();
const routePoints = ref()
const cesiumContainer = ref(null)
const showRouteSearch = ref(false)
let startPoint = ref('')
let endPoint = ref('')
let startCoor = ref({
  lng: 116.322065,
  lat: 39.896243
})
let endCoor = ref({
  lng: 116.402048,
  lat: 39.925452
})
let roaming = ref()
const romOptions = ref({
  viewer: '', // viewer实例
  model: '../../../../public/cesiumtruck/CesiumMilkTruck.gltf',
  time: 50000,
  data: '',
  isPathShow: true,
  speed: 10,
});
onMounted(async () => {
  v.value = await initCesium()
})

// 初始化 Cesium
const initCesium = async () => {
  if (cesiumContainer.value) {
    // 异步加载 token
    const response = await fetch('../../../../public/tokenAndKey.json')
    const data = await response.json()
    // console.log(data.token)
    Ion.defaultAccessToken = data.cesiumtoken
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
    return viewer
  }
  return null
}

const initAutocomplete = (inputId) => {
  // 延迟执行，确保DOM元素已经渲染
      nextTick(() => {
        AMap.plugin('AMap.AutoComplete', () => {
          const autoOptions = {
            input: inputId
          };
          const autoComplete = new AMap.Autocomplete(autoOptions);
          autoComplete.on('select', (e) => {
            console.log('select', e)
            if (inputId === 'tipinput1') {
              // startPoint.value = e.poi.name;
              startCoor.value.lng = e.poi.location.lng;
              startCoor.value.lat = e.poi.location.lat;
              // startCity.value = e.poi.sdcode;
            } else {
              // endPoint.value = e.poi.name;
              endCoor.value.lng = e.poi.location.lng;
              endCoor.value.lat = e.poi.location.lat;
              // endCity.value = e.poi.adcode ;
            }
          });
        });
      });
};


const searchRoute = async () => {
  const RouteData = await getRouteData(
    drivingOption.value,
    startCoor.value,
    endCoor.value,
  )
  //paths中包含规划好的多条路线。
  let paths = RouteData.data.route.paths
  let path = paths[0].steps
  //路径数据加工处理
  let points = await setRoute(path)
  //绘制路径
  // 可视化路径并把相机移动到路径上空
  Routeline(points)
  //初始化模型
  romOptions.value.viewer = v.value
  romOptions.value.data = points
  console.log('看看结果有没有被修改',romOptions.value)
  // roaming.value = new Roaming(romOptions.value);
  // startRoaming()
}

// 开始漫游的按钮
const startRoaming = () => {
  roaming.value.init(romOptions.value);
}

// function pauseRoaming() {
//   roaming.value.pauseOrContinue(false);
// }

// function continueRoaming() {
//   roaming.value.pauseOrContinue(true);
// }

// function changeSpeed(newSpeed) {
//   roaming.value.changeRoamingSpeed(newSpeed);
// }

// function togglePathVisibility(visible) {
//   roaming.value.setRoamingPathVisibility(visible);
// }

// function toggleModelVisibility(visible) {
//   roaming.value.setRoamingModelVisibility(visible);
// }

// const roaming = new Roaming(v, romOptions);


const Routeline = (positionsWGS84) => {
  // positionsWGS84 = Cartesian3.fromDegreesArray(positionsWGS84)
  // for (let point of positionsWGS84){
  //   console.log(point instanceof Cartesian3)
  // }
  // 绘制路径
  // 移除之前的路径
  v.value.entities.removeAll();
  const entity = v.value.entities.add({
    name: 'daohangline',
    polyline: {
      positions: Cartesian3.fromDegreesArray(positionsWGS84),
      width: 5,
      material: Color.GREEN,
      clampToGround: true,
    }
  });
  // 显式指定飞行目标
  v.value.flyTo(entity, {
    duration: 3, // 飞行时间，单位为秒
    // 可以添加更多的飞行选项，如最大高度等
  });
}
//控制导航组件的显示与否，通过监听子组件的事件
const handleUpdate = async(newData) => {

  showRouteSearch.value = newData
  if (showRouteSearch.value){
    await initAutocomplete('tipinput1');
    await initAutocomplete('tipinput2');
  }
}



</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
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

.menu {
  position: fixed;
  overflow: visible;
  top: 50px;
  left: calc(100vw - 240px);
  width: 220px;
  height: 162px;
  background-color: rgba(255, 255, 255, 0.5);
  .routeBox {
    margin:5px 10px 4px 10px;
    width:200px;
  }
  .routeBoxBbutton{
    margin:2px 10px 2px 10px;
    width:90px;
  }
}
</style>
