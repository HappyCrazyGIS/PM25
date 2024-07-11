import { ref } from "vue"
import { defineStore } from "pinia"

export const useMap = defineStore("Map", () => {
  let map = ref(null)
  let draw = ref(null)
  let ggMap = ref(null)
  function setMap(val) {
    map.value = val
  }
  function setggMap(val) {
    ggMap.value = val
  }
  // 清除画笔
  function removeDraw() {
    map.value.value.removeInteraction(draw.value)
  }
  return { map, setMap, ggMap, setggMap, draw, removeDraw }
})
