<template>
  <div class="track-item">
    <div class="track-calcu">{{ records.date }}</div>
    <div class="track-info">
      <span>{{ records.distance }}公里</span>
      <span>{{ records.duringTime }}小时</span>
      <span>{{ records.exposureDose }}µm</span>
    </div>
    <div v-for="item in records.records" :key="item.id" class="track-item-container">
      <TrackItem :tracks="item" @click="handClick(item)"></TrackItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps,defineEmits } from 'vue';
import TrackItem from './trackItem.vue'
const props = defineProps({
  records: Object
})

//定义自定义事件，点击之后触发自定义事件
const emit = defineEmits(['trackSelected']);
// 处理 TrackItem 的点击事件
const handClick = (track) => {
  // console.log('Clicked track:', track);
  // 你可以在这里处理点击事件，并传递轨迹数据给父组件，或者触发地图上的绘制逻辑
  // emit 事件到父组件，或者执行其他逻辑
  emit('trackSelected', track);
};


</script>

<style scoped>
/* 样式调整 */
.track-item {
  margin:3px;
  background-color: #f5fcfc;
  padding: 10px; /* 减少 padding */
  border-radius: 8px;
  margin-bottom: 10px; /* 减少 margin */
  border: 1px solid #ddd;
}

.track-calcu {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px; /* 减少 margin */
}

.track-info {
  margin-bottom: 10px; /* 减少 margin */
  display: flex;
  gap: 5px; /* 减少 gap */
}

.track-info span {
  background-color: #e6f7ff;
  padding: 3px 5px; /* 减少 padding */
  border-radius: 5px;
}

.track-item-container {

  padding: 5px; /* 减少 padding */
  margin-bottom: 0; /* 减少 margin */

}
</style>