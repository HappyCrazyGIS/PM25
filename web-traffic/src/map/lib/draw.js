/*
设置画笔的参数
source
type
geometryFunction
maxPoints

画笔的类型参数 
不需要额外设置(Point,LineString,Circle,Polygon)
需要额外设置  (Square,Retangle)
*/
/**
 * @param {string} source 画布
 * @param {string}  type 画笔的类型
 * @param {function}callback 绘制完成后的回调
 */
function createDraw({
  source,
  type = "Point",
  handleDrawStart,
  handleDrawEnd,
}) {
  let draw
  let geometryFunction = null
  let maxPoints = 0
  if (type == "Square") {
    type = "Circle"
    geometryFunction = ol.interaction.Draw.createRegularPolygon(4)
  } else if (type == "Rectangle") {
    type = "LineString"
    geometryFunction = function (coordinates, geometry) {
      if (!geometry) {
        //多边形
        geometry = new ol.geom.Polygon(null)
      }
      var start = coordinates[0]
      var end = coordinates[1]
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start],
      ])
      return geometry
    }
    maxPoints = 2
  }
  draw = new ol.interaction.Draw({
    source,
    type,
    geometryFunction,
    maxPoints,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(0, 117, 199, 0.6)",
      }),
      stroke: new ol.style.Stroke({
        color: "rgba(0, 117, 199)",
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: "rgba(0, 117, 199)",
        }),
      }),
    }),
  })
  if (handleDrawStart) {
    draw.on("drawstart", handleDrawStart)
  }
  if (handleDrawEnd) {
    draw.on("drawend", handleDrawEnd)
  }
  return draw
}
