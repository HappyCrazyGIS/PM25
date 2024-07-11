import { useMap } from "../../stores/useMap"
const store = useMap()
let output
let sketch
let measureTooltip
let listener
let measureTooltipEle
// 画笔结束的回调
export const handleDrawEnd = (e) => {
  measureTooltip.setOffset([10, -15])
  sketch = null
  //置空测量工具提示框对象
  measureTooltipEle = null
  // 删除事件侦听器
  ol.Observable.unByKey(listener)
}
// 画笔开始的回调
export const handleDrawStart = (e) => {
  createMeasureTooltip() //创建测量工具提示框
  sketch = e.feature //绘制的要素
  var tooltipCoord = e.coordinate // 绘制的坐标
  //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
  listener = sketch.getGeometry().on("change", function (evt) {
    var geom = evt.target //绘制几何要素
    if (geom instanceof ol.geom.Polygon) {
      output = formatArea(geom) //面积值
      tooltipCoord = geom.getInteriorPoint().getCoordinates() //坐标
    } else if (geom instanceof ol.geom.LineString) {
      output = formatLength(geom) //长度值
      tooltipCoord = geom.getLastCoordinate() //坐标
    }
    //将测量值设置到测量工具提示框中显示
    measureTooltipEle.innerHTML = output
    measureTooltip.setPosition(tooltipCoord)
  })
}
// 创建测量数值框
const createMeasureTooltip = () => {
  if (measureTooltipEle) {
    measureTooltipEle.parentNode.removeChild(measureTooltipEle)
  }
  measureTooltipEle = document.createElement("div")
  measureTooltipEle.className = "measureTooltipEle"
  measureTooltip = new ol.Overlay({
    element: measureTooltipEle,
    offset: [0, -15],
    positioning: "bottom-center",
  })
  store.map.value.addOverlay(measureTooltip)
}
// 输出长度
const formatLength = (line) => {
  var length
  var sphere = new ol.Sphere()
  // if (geodesicCheckbox.checked) {
  //若使用测地学方法测量
  var sourceProj = store.map.value.getView().getProjection() //地图数据源投影坐标系
  length = sphere.getLength(line, { projection: sourceProj, radius: 6378137 })
  let output
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km" //换算成KM单位
  } else {
    output = Math.round(length * 100) / 100 + " " + "m" //m为单位
  }
  return output //返回线的长度
}
// 面积输出
const formatArea = (polygon) => {
  var area
  var sphere = new ol.Sphere()
  //若使用测地学方法测量
  //地图数据源投影坐标系
  var sourceProj = store.map.value.getView().getProjection()
  //将多边形要素坐标系投影为EPSG:4326
  var geom = polygon.clone().transform(sourceProj, "EPSG:4326")
  area = Math.abs(
    sphere.getArea(geom, { projection: sourceProj, radius: 6378137 })
  )
  //获取面积
  let output
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>" //换算成KM单位
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>" //m为单位
  }
  return output //返回多边形的面积
}
export const removeOverlay = () => {
  // console.log(store.map.value.getOverlays())
  store.map.value.getOverlays().clear()
}
