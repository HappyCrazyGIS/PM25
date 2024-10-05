<template>
  <div id="tracksMapBox">
    <div id="toolBox">
      <!-- 启动位置追踪和轨迹绘制 -->
      <el-button @click="start">开始</el-button>

      <!-- 停止位置追踪和 WebSocket -->
      <el-button @click="stopTrackingHandler">结束</el-button>

      <!-- 暂停或继续位置追踪 -->
      <el-button @click="toggleTrackingHandler">暂停/继续</el-button>

      <!-- 切换历史记录显示 -->
      <el-button @click="changeShowHistory">历史记录</el-button>
    </div>
    <div id="historyBox" v-if="showHistory">
      <div class="navTop">
        <div class="userImg">
          <img src="" alt="">
        </div>
        <div >
          <select v-model="calculateOptions" class="custom-select">
            <!-- 设置四个选项年月周日 -->
            <option label="年" value="year"></option>
            <option label="月" value="month"></option>
            <option label="周" value="week"></option>
            <option label="日" value="day"></option>
          </select>
        </div>
      </div>
      <div v-for="(record, index) in calculateRecords" :key="record.date" class="contentBox">
        <TrackCalculateItem :records="record" @trackSelected="handleTrackSelection"></TrackCalculateItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,watch } from 'vue';
import { initWebSocket, startTracking, stopTracking, toggleTracking } from '../tracks/websocketManager.js';  // 导入 WebSocket 管理功能
import { calculateSummary } from '../tracks/historyList/tooljs/dataGroupBy';  // 导入历史记录汇总计算功能
import TrackCalculateItem from './historyList/trackCalculateItem.vue'
import {records,tracksbyid} from './historyList/tooljs/records'
let calculateOptions = ref('month');  // 存储历史记录计算选项
let map = null;  // 存储 Leaflet 地图实例
let polyline = null;  // 存储轨迹折线
let watchId = null;  // 保存 geolocation 监听 ID
let calculateRecords = ref()
// 根据轨迹id获得的轨迹数据
let tracks = ref()
// 控制历史记录显示的标志
let showHistory = ref(false);
let showFlag = ref(false)
let calcuteFlag = ref(false)
// 切换历史记录显示状态的函数
const changeShowHistory = () => {
  showHistory.value = !showHistory.value;
  if (showHistory.value){//如果是点击历史记录那就需要重新加载数据。
    fetchRecordsData()
    calculateRecords.value = calculateSummary(records,calculateOptions.value)
    console.log(calculateRecords.value)
  }
};
// 修改统计方式的话不需要重新请求数据，只需要重新计算即可
watch(calculateOptions,(newVal,oldVal)=>{
  calculateRecords.value = calculateSummary(records,newVal)
  // console.log(calculateRecords.value)
})


const fetchRecordsData = () => {
  //请求获取数据
  console.log('数据请求成功')
}

// 存储用户的初始位置，确定地图的中心点
const originLocation = ref([0, 0]);

/**
 * 获取用户初始位置的函数
 */
const getInitLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        originLocation.value = [position.coords.latitude, position.coords.longitude];
        resolve(originLocation.value);
      },
      (error) => {
        console.error('获取位置失败:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * 更新轨迹折线函数
 * @param {Array} latLon 新的经纬度
 */
const updatePolyline = (latLon) => {
  if (polyline) {
    polyline.addLatLng(latLon);  // 将新点添加到折线中
  }
};

// 初始化地图和 WebSocket
onMounted(async () => {
  try {
    await getInitLocation();
    console.log('originLocation', originLocation.value);

    // 初始化地图，使用 OpenStreetMap 瓦片图层
    map = L.map('tracksMapBox').setView(originLocation.value, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 初始化空折线用于绘制轨迹
    polyline = L.polyline([], { color: 'red', weight: 5, opacity: 0.8 }).addTo(map);

    // 初始化 WebSocket 连接
    initWebSocket();
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
});

/**
 * 开始位置追踪和轨迹绘制
 */
const start = () => {
  startTracking();  // 启动 WebSocket 的位置追踪

  // 启动 Geolocation 监听位置变化，更新轨迹
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const latLon = [position.coords.latitude, position.coords.longitude];
      updatePolyline(latLon);  // 更新轨迹折线
    },
    (error) => {
      console.error('位置获取失败:', error);  // 打印错误信息
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }  // 高精度模式
  );
};

/**
 * 暂停或继续位置追踪和轨迹绘制
 */
const toggleTrackingHandler = () => {
  toggleTracking();  // 切换 WebSocket 的暂停/继续

  if (watchId) {
    navigator.geolocation.clearWatch(watchId);  // 暂停位置追踪
    watchId = null;
    console.log('位置追踪已暂停');
  } else {
    start();  // 恢复位置追踪
    console.log('位置追踪已恢复');
  }
};

/**
 * 停止位置追踪并关闭 WebSocket
 */
const stopTrackingHandler = () => {
  stopTracking();  // 停止 WebSocket 位置追踪

  if (watchId) {
    navigator.geolocation.clearWatch(watchId);  // 停止位置监听
    watchId = null;
    console.log('位置追踪已结束');
  }
};

// 处理 TrackCalculateItem 的点击事件
const handleTrackSelection = (track) => {
  console.log('Clicked track:', track);
  // 首先发起请求，根据id和用户的id获取到这个轨迹的详细信息
  // let trackDetail = records.find((item) => item.id === track.id);
  tracks.value = tracksbyid
  // 然后根据这个信息绘制到地图上
  const coordinates = tracks.value.coordinates.map(coord => [coord.latitude, coord.longitude]);
  // 使用 Leaflet 在地图上绘制轨迹
  const polyline = L.polyline(coordinates, { color: 'blue' }).addTo(map);
  // 调整地图视野，使其适应轨迹范围
  map.fitBounds(polyline.getBounds());
};
</script>

<style scoped lang="scss">
#tracksMapBox {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: rgb(255, 255, 255);

  #toolBox {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    background-color: rgba(255, 255, 255,0);
    bottom: 10px;
    left: 10px;
    height: 120px;
    width: 120px;
    z-index: 1000;
    button {
      background-color: rgb(114, 250, 118);
      margin: 2px;
      height: 40px;
      width: 120px;
    }
  }

  #historyBox {
    overflow: auto;
    position: absolute;
    //帮我补充
    border:1px solid #ffffff;
    border-radius: 1%;
    background-color: rgb(255, 255, 255);
    height: 500px;
    width: 300px;
    bottom: 150px;
    left: 10px;
    z-index: 1000;
    .navTop{
      border-radius: 2%;
      padding-left:5px;
      padding-right:5px;
      background-color: rgb(250, 250, 250);
      height:40px;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .userImg{
        width:35px;
        height:35px;
        border-radius: 50%;
        background-color: rgb(255, 157, 0);
      }
      .custom-select {
        background-color: rgb(250, 250, 250);
        border: none;
        width:40px;
        height:30px;
      }
    }


  }
}


</style>
