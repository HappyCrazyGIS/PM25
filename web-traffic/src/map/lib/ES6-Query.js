/**
 * @param {object} geometry   是要素的几何信息（不是坐标） feature.getGeometry()
 */
class Query {
  /* 点击查询 */
  static queryClick({ page = 0, size = 5, position, service, callback }) {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //创建一个用于查询的点
    var geomObj = new Zondy.Object.Point2D(position[0], position[1])
    //设置查询点的搜索半径
    geomObj.nearDis = 0.001
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
      geometry: geomObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    })
    //设置查询分页号
    queryParam.pageIndex = page
    //设置查询要素数目
    queryParam.recordNumber = size
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(callback)
  }
  /* FID查询 */
  static queryByFID({ fid, service, callback }) {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      objectIds: fid,
      resultFormat: "json",
      struct: queryStruct,
    })
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(callback)
  }
  /* 属性查询 */
  static queryByAttr({ size, page, where, service, callback }) {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
    })
    //设置查询分页号
    queryParam.pageIndex = page
    //设置查询要素数目
    queryParam.recordNumber = size
    /* 1.确定查询参数 */
    queryParam.where = where //条件
    /* 2.调用查询服务 */
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(callback)
  }
  /* 通过要素的几何信息查询 */
  static queryByGeom({ size, page, geometry, service, callback }) {
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //创建一个用于查询的区,用交互式画笔创建的区查询
    var geomObj = new Zondy.Object.Polygon()
    geomObj.setByOL(geometry)
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
      geometry: geomObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    })
    //设置查询分页号
    queryParam.pageIndex = page
    //设置查询要素数目
    queryParam.recordNumber = size
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，callback为回调函数
    queryService.query(callback)
  }
  /* 通过 固定矩形 查询线要素 */
  static queryLineByRectangle({ service, page = 0, size = 60, callback }) {
    //创建一个用于查询的矩形
    let geomObj = new Zondy.Object.Rectangle(
      114.31682963928486,
      30.458659674748393,
      114.42863474841477,
      30.536055627717506
    )

    //初始化查询结构对象，设置查询结构包含几何信息
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
      geometry: geomObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    })
    //设置查询分页号
    queryParam.pageIndex = page
    //设置查询要素数目
    queryParam.recordNumber = size
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        ip: "localhost",
        port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
      }
    )
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(callback)
  }
}
