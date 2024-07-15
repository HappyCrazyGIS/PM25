let heatmapSource = null
let heatmapLayer = null
export const createHeatmap = (map, showHeatmap, radius, blur) => {
  // showHeatmap.value = !showHeatmap.value
  // console.log(heatmapSource)

  if (showHeatmap) {
    // console.log(11)
    if (!heatmapSource) {
      // console.log(22)
      let service = {
        name: "guanggu",
        layerId: 2,
      }
      Query.queryLineByRectangle({
        service,
        callback: queryEventSuccess(map, radius, blur),
      })
    }
  } else {
    heatmapSource.clear()
    heatmapSource = null
  }
}
// 成功回调
const queryEventSuccess = (map, radius, blur) => {
  return (result) => {
    // console.log(result)
    var format = new Zondy.Format.PolygonJSON()
    var features = format.read(result)
    // console.log(features)
    for (var i = 0; i < features.length; i++) {
      features[i].set(
        "weight",
        parseFloat(result.SFEleArray[i].AttValue[2]) * 0.2
      )
    }
    if (!heatmapSource) {
      heatmapSource = new ol.source.Vector({
        wrapX: false,
      })
    }
    // 创建热力图对象
    heatmapLayer = new ol.layer.Heatmap({
      source: heatmapSource,
      radius: radius, //半径大小
      blur: blur, //模糊大小
    })

    map.addLayer(heatmapLayer)

    heatmapSource.addFeatures(features)
  }
}
export const setRadius = (value) => {
  heatmapLayer.setRadius(value)
}
export const setBlur = (value) => {
  heatmapLayer.setRadius(value)
}
