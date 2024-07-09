/**
 * @param {Array} lnglat  经纬度
 * @param {Array} attr [
 * {type:"string",key:"name","value":"李四"}，
 * {type:"int",key:"id",value:1001}
 * ]  需要和 mapgis 数据库中的字段映射
 * @param {Object} service {name,layerId} name是IG Server服务的名称，layerId是添加点要素所在的图层层级
 * @param {String} docName 矢量地图文档的名称
 */

function addPoint(lnglat, attr = [], fldName = [], color, service, callback) {
  /* 1、构建点要素 */
  var gpoint = new Zondy.Object.GPoint(lnglat[0], lnglat[1]) //createPoint();
  //设置当前点要素的几何信息
  var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
  //随机输出1~8之间的整数,作为新添加的要素的颜色号
  //描述点要素的符号参数信息
  var pointInfo = new Zondy.Object.CPointInfo({
    Angle: 0,
    Color: color,
    Space: 0,
    SymHeight: 5,
    SymID: 21,
    SymWidth: 5,
  })
  //设置当前点要素的图形参数信息
  var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
    InfoType: 1,
    PntInfo: pointInfo,
  })
  //设置添加点要素的属性信息
  var attValue = attr
  //创建一个要素
  var feature = new Zondy.Object.Feature({
    fGeom: fGeom,
    GraphicInfo: webGraphicInfo,
    AttValue: attValue,
  })
  //设置要素为点要素
  feature.setFType(1)
  /* 2、设置数据集 */
  //创建一个要素数据集
  var featureSet = new Zondy.Object.FeatureSet()
  //设置属性结构
  var cAttStruct = new Zondy.Object.CAttStruct({
    FldName: fldName,
    // FldName: attr.map((item) => item.key),
    FldNumber: attr.length,
    FldType: [],
    // FldType: attr.map((item) => item.type),
  })
  featureSet.AttStruct = cAttStruct
  //添加要素到要素数据集
  featureSet.addFeature(feature)

  //3、创建一个编辑服务类
  var editService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {
      ip: "localhost",
      port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
    }
  )
  //执行添加点要素功能
  editService.add(featureSet, callback)
}
