<template>
  <el-button dark active-text-color="#ffd04b" background-color="#545c64" style="width: 64px" @click="isCollapse = !isCollapse">
    <el-icon v-if="isCollapse"><DArrowLeft /></el-icon>
    <el-icon v-else><DArrowRight /></el-icon>
  </el-button>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :collapse = isCollapse
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><CirclePlusFilled /></el-icon>
        <span>添加数据</span>
      </template>
        <el-menu-item index="1-1">PM2.5数据</el-menu-item>
        <el-menu-item index="1-2">tif数据</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><Loading /></el-icon>
      <span >PM2.5模拟</span>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><Position /></el-icon>
      <span>路径规划</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  DArrowRight,
  DArrowLeft,CirclePlusFilled,Loading,Position
} from '@element-plus/icons-vue'
const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

</script>


<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 400px; */
}
</style>