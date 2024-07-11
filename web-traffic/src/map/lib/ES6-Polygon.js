/* Polygon*/
const Polygon_STYLE = {
  EndColor: 1,
  FillColor: 26,
  FillMode: 0,
  OutPenWidth: 1,
  OverMethod: 0,
  PatAngle: 1,
  PatColor: 1,
  PatHeight: 1,
  PatID: 27,
  PatWidth: 1,
}
/**
 * @param {二维数组} position
 *
 */
class Polygon {
  static add({ position, attr = [], service, docName }) {
    var pointObj = []
    position[0].forEach((item) => {
      pointObj.push(new Zondy.Object.Point2D(item[0], item[1]))
    })
    console.log(pointObj)
    //设置区要素的几何信息
    var gArc = new Zondy.Object.Arc(pointObj)
    //构成区要素折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc])
    //构成区要素
    var gRegion = new Zondy.Object.GRegion([gAnyLine])
    //构成区要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] })
    var cRegionInfo = new Zondy.Object.CRegionInfo(Polygon_STYLE)
    //要素图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 3,
      RegInfo: cRegionInfo,
    })

    //设置区要素的属性信息
    var attValue = attr
    //创建一个新的区要素
    var newFeature = new Zondy.Object.Feature({
      AttValue: attValue,
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
    })
    newFeature.setFType(3)

    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet()
    var fldNumber = attr.length
    var fldType = []
    var fldName = []
    var cAttValue = new Zondy.Object.CAttStruct({
      FldNumber: fldNumber,
      FldType: fldType,
      FldName: fldName,
    })
    featureSet.AttStruct = cAttValue
    featureSet.addFeature(newFeature)
    //创建一个要素编辑服务对象
    var editDocFeature = new Zondy.Service.EditDocFeature(
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    editDocFeature.add(featureSet, this.onPloySuccess(docName))
  }
  static onPloySuccess(docName) {
    return function (data) {
      if (data.succeed) {
        alert("添加区要素成功！")
        docName.refresh()
      } else {
        alert("添加区要素失败！")
      }
    }
  }
}
