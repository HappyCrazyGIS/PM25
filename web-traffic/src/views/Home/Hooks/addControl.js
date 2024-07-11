export const addControl_ = () => {
  // 实现比例尺控件
  const scaleLineControl = new ol.control.ScaleLine({
    //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
    units: "metric",
  })
  //实例化ZoomSlider控件并加载到地图容器中
  const zoomslider = new ol.control.ZoomSlider()
  //  鼠标位置控件
  const mousePositionControl = new ol.control.MousePosition({
    //坐标格式
    coordinateFormat: ol.coordinate.createStringXY(4),
    //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
    projection: "EPSG:4326",
    //坐标信息显示样式类名，默认是'ol-mouse-position'
    className: "custom-mouse-position",
    //显示鼠标位置信息的目标容器
    target: document.getElementById("mouse-position"),
    //未定义坐标的标记
    undefinedHTML: "&nbsp;",
  })
  //实例化鹰眼控件（OverviewMap）,自定义样式的鹰眼控件
  const overviewMapControl = new ol.control.OverviewMap({
    //鹰眼控件样式（see in overviewmap-custom.html to see the custom CSS used）
    className: "ol-overviewmap ol-custom-overviewmap",
    //鹰眼中加载同坐标系下不同数据源的图层
    //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
    collapseLabel: "\u00BB",
    //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
    label: "\u00AB",
    //初始为展开显示方式
    collapsed: false,
    view: new ol.View({
      projection: "EPSG:4326",
      minZoom: 8,
      maxZoom: 18,
    }),
  })
  return [
    scaleLineControl,
    zoomslider,

    mousePositionControl,
    overviewMapControl,
  ]
}
