<template>
  <div class="track-box">
    <!-- 左侧显示图标 -->
    <div class="trackBoxLeft">
      <el-icon> <EditPen/> </el-icon>
    </div>

    <!-- 右侧显示轨迹数据，上下结构 -->
    <div class="trackBoxRight">
      <div class="rightTop">
        <span>{{ tracks.activity_type }}</span>
        <span>{{ formattedStartTime }}</span>
      </div>
      <div class="rightBottom">
        <span>距离: {{ tracks.distance }} km</span>
        <span>时长: {{ tracks.duringTime }} 小时</span>
        <span>速度: {{ tracks.speed }}</span>
        <span>暴露剂量: {{ tracks.exposure_dose }} µm</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps,computed } from 'vue';
import { EditPen } from '@element-plus/icons-vue';  // 引入 Element Plus 图标组件

const props = defineProps({
  tracks: Object  // 接收传递的轨迹数据
});

// 使用 computed 计算格式化后的时间
const formattedStartTime = computed(() => {
  const [year, month, day] = props.tracks.start_time.split(' ')[0].split('-');
  const time = props.tracks.start_time.split(' ')[1];
  return `${month}月${day}日 ${time}`;
});
</script>

<style scoped>
/* 总容器设置 flex 布局，确保左边的图标和右边的数据并排 */
.track-box {
  display: flex;
  align-items: center;
  padding: 10px;
  border: none;
  background-color: rgb(209, 241, 225);
  border-radius: 8px;
  margin-bottom: 5px;
}

/* 左侧图标样式 */
.trackBoxLeft {
  margin-right: 15px;  /* 右边添加间距 */
}

/* 右侧数据的容器，flex 布局使其上下结构 */
.trackBoxRight {
  flex-grow: 1;  /* 右侧占满剩余空间 */
  display: flex;
  flex-direction: column;
}

.rightTop {
  display: flex;
  justify-content: space-between;  /* 左右分布，运动类型和开始时间 */
  margin-bottom: 10px;
  font-weight: bold;
}

.rightBottom {
  display: flex;
  gap: 10px;  /* 添加间隔 */
  flex-wrap: wrap;  /* 如果内容过长可以换行 */
}
</style>
