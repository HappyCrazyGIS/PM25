<template>
  <div class="pic-container">
    <el-menu-item index="4-3" @click="handleClick">导出图片</el-menu-item>
  </div>
</template>
<script setup>
import { useMap } from "../../stores/useMap"
const store = useMap()
const handleClick = () => {
  store.removeDraw()
  store.map.value.once("postcompose", function (event) {
    var canvas = event.context.canvas
    canvas.toBlob(function (blob) {
      saveAs(blob, "map.png")
    })
  })
  store.map.value.renderSync()
}
</script>
<style scoped></style>
