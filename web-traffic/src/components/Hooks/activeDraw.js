import { ref } from "vue"
import { useMap } from "../../stores/useMap"
const store = useMap()
let source
let layer
export const activeDraw = (map, type, handleDrawStart, handleDrawEnd) => {
  if (!source) {
    source = new ol.source.Vector({
      wrapX: false,
    })
    layer = new ol.layer.Vector({
      source,
      style: new ol.style.Style({
        //图层样式
        fill: new ol.style.Fill({
          color: "rgba(63,193,201, 0.5)", //填充颜色
        }),
        stroke: new ol.style.Stroke({
          color: "#3fc1c9", //边框颜色
          width: 4, // 边框宽度
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    })
    map.addLayer(layer)
  }
  let draw = ref(null)
  draw.value = createDraw({
    source,
    type: type,
    handleDrawStart,
    handleDrawEnd,
  })
  map.addInteraction(draw.value)
  store.draw = draw.value
}
export const clearLayer = () => {
  if (source) {
    source.clear()
    store.map.value.removeLayer(layer)
  }
}
