let source, drawLayer
let style = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 55],
    anchorOrigin: 'top-right',
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    offsetOrigin: 'top-right',
    // offset:[0,10],
    //图标缩放比例
    scale: 0.8,
    //透明度
    opacity: 0.75,
    //图标的url
    src: '/images/location.png'
  })
})
// 用于查询高亮显示
export const createLayer = (features) => {
  //实例化一个矢量图层drawLayerr用于高亮显示结果
  source = new ol.source.Vector({
    wrapX: false
  })
  source.addFeatures(features)
  drawLayer = new ol.layer.Vector({
    source: source,
    style: style
  })
  return drawLayer
}
export const clearLayer = (map) => {
  source.clear()
  map.removeLayer(drawLayer)
}
