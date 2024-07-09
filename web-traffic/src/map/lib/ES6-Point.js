/**
 * @param {Array} position 经纬度
 * @param {Array }attr [
 * {type:"string",key:"name","value":"李四"}，
 * {type:"int",key:"id",value:1001}
 * ]  需要和mapgis数据库中的字段映射
 * @param {object}service {name,layerId}  name是IG Server服务的名称,layerId添加点要素所在的图层
 * @param {string} docName 矢量地图文档的名称
 */
/* insert into fun_Point values("李四",1001) */
/* insert into fun_Point (name,id) values("李四",1001) */
class Point {
  /* 查询 */
  static queryByGeom({ position, service, callback }) {
    /* 1、确定查询几何位置 */
    //创建一个用于查询的点形状
    var pointObj = new Zondy.Object.Point2D(position[0], position[1]) //查询点的位置
    //设置查询点的搜索半径
    pointObj.nearDis = 0.001
    /* 1-1、确定查询结构 */
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    })
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    })
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name, //服务名称
      service.layerId, //要素所在图层
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(callback)
  }
  /* 增加的方法 */
  static addPoint({
    lnglat,
    attr = [],
    fldName = [],
    color,
    service,
    callback,
  }) {
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
}
