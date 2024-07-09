/**
 * @param {Array[Array]} position 二维数组
 */
const Line_STYLE = {
  Color: 1,
  LinStyleID: 0,
  LinStyleID2: 19,
  LinWidth: 0.05,
  Xscale: 10,
  Yscale: 10,
}

class LineString {
  static add({ position, attr = [], service, docName }) {
    //构成线要素的点
    var pointObj = []
    position.forEach((item) => {
      pointObj.push(new Zondy.Object.Point2D(item[0], item[1]))
    })
    //构成折线的弧段
    var gArc = new Zondy.Object.Arc(pointObj)
    //构成线的折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc])
    //设置线要素的几何信息
    var gline = new Zondy.Object.GLine(gAnyLine)
    //设置要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })
    //设置添加线要素的图形参数信息
    var clineInfo = new Zondy.Object.CLineInfo(Line_STYLE) //设置线要素的图形参数信息
    //设置要素的图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 2,
      LinInfo: clineInfo,
    })
    //设置添加线要素的属性信息
    var attValue = attr

    //创建一个线要素
    var newFeature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
      AttValue: attValue,
    })
    //设置要素为线要素
    newFeature.setFType(2)
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet()
    var fldNumber = attr.length
    var fldName = []
    var fldType = []
    //创建属性结构设置对象
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: fldName,
      FldNumber: fldNumber,
      FldType: fldType,
    })
    //设置要素数据集的树形结构
    featureSet.AttStruct = cAttStruct
    //将添加的线要素添加到属性数据集中
    featureSet.addFeature(newFeature)
    //创建一个图层编辑对象
    var editLayerFeature = new Zondy.Service.EditDocFeature(
      "service,name",
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    editLayerFeature.add(featureSet, this.onLineSuccess(docName))
  }
  //添加线要素回调函数
  static onLineSuccess(docName) {
    return function (data) {
      if (data.succeed) {
        alert("添加线要素成功！")
        docName.refresh()
      } else {
        alert("添加线要素失败！")
      }
    }
  }
}
