<template>
  <div class="track-item">
    <div class="track-calcu">{{ records.date }}</div>
    <div class="track-info">
      <span>{{ records.distance }}公里</span>
      <span>{{ records.duringTime }}小时</span>
      <span>{{ records.exposureDose }}µm</span>
    </div>
    <div v-for="item in records.records" :key="item.id" class="track-item-container">
      <TrackItem :tracks="item"></TrackItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import TrackItem from './trackItem.vue'
const props = defineProps({
  records: Object
})
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