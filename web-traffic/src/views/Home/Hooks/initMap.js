import { onMounted, ref } from "vue"
import { FlyTo } from "./flyTo"
export const initMap = () => {
  let map = ref(null)
  onMounted(() => {
    const key = "4fb848e7353ebbd1b02413025f907a42"
    const TiandiMap_vec = new ol.layer.Tile({
      title: "天地图矢量图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
          key,
        wrapX: false,
        crossOrigin: "Anonymous",
      }),
    })
    const TiandiMap_cva = new ol.layer.Tile({
      title: "天地图矢量注记图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
          key,
        crossOrigin: "Anonymous",
      }),
    })
    const TianDiMap_img = new ol.layer.Tile({
      title: "天地图影像图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" +
          key,
        wrapX: false,
        crossOrigin: "Anonymous",
      }),
    })
    /* 天地图影像注记图层 */
    const TianDiMap_cia = new ol.layer.Tile({
      title: "天地图影像注记图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" +
          key,
        wrapX: false,
        crossOrigin: "Anonymous",
      }),
    })
    // 组合成组,底图+注记
    /* 矢量+注记 */
    const vecLayergroup = new ol.layer.Group({
      layers: [TiandiMap_vec, TiandiMap_cva],
    })
    /* 影像+注记 */
    const imgLayergroup = new ol.layer.Group({
      layers: [TianDiMap_img, TianDiMap_cia],
      visible: false,
    })
    map.value = new ol.Map({
      target: "map",
      // layers: [TianDiMap_img, TianDiMap_cia, TiandiMap_vec, TiandiMap_cva],
      layers: [imgLayergroup, vecLayergroup],
      view: new ol.View({
        center: [114, 30],
        zoom: 6,
        projection: "EPSG:4326",
      }),
    })
  })
  return { map }
}
