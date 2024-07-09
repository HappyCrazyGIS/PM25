<template>
  <div class="container">
    <!-- <div @click="TrafficDialogFlag = !TrafficDialogFlag">发布公告</div> -->
    <div @click="handleClick">发布公告</div>
    <el-dialog
      v-model="TrafficDialogFlag"
      :append-to-body="true"
      width="600"
      @close="handleDialogClose"
      draggable
    >
      <template #header="{ titleClass }">
        <div class="my-header">
          <h4 :class="titleClass">发布公告</h4>
        </div>
      </template>
      <div
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #eee;
          height: 290px;
        "
      >
        <div
          style="
            font-size: 16px;
            margin-bottom: 20px;
            margin-top: 10px;
            font-weight: 600;
            margin-left: -350px;
          "
        >
          受影响区域及联系电话
        </div>
        <el-table
          :data="dataList"
          height="220"
          style="width: 400px"
          align="center"
        >
          <el-table-column prop="AttValue[4]" label="区域名称" width="200" />
          <el-table-column
            prop="AttValue[5]"
            label="联系电话"
            width="180"
            align="center"
          />
        </el-table>
      </div>
      <el-form label-width="120px" style="margin-top: 20px">
        <el-form-item label="公告标题">
          <el-input v-model="input" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input
            v-model="textarea"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TrafficDialogFlag = false">取消</el-button>
          <el-button type="primary" @click="handleSend"> 发布 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { nextTick, ref } from "vue"
import { ElMessage } from "element-plus"
import { useToken } from "../../stores/useToken"
import { useMap } from "../../stores/useMap"
import http from "../../api/http"

const storeMap = useMap()
const tokenStore = useToken()
let TrafficDialogFlag = ref(false)
let dataList = ref([])
let input = ref("")
let textarea = ref("")
let draw = ref(null)
let ClipLayer = ref()
let clipName = ref()

/* 1、创建画布 */
let source = new ol.source.Vector({ wrapX: false })
let layer = new ol.layer.Vector({ source })
nextTick(() => {
  storeMap.map.value.addLayer(layer)
})
//点击发布公告按钮的处理函数
const handleSend = async () => {
  let res = await http({
    url: "notice/addNotice",
    data: {
      title: input.value,
      content: textarea.value,
      user_id: tokenStore.id,
    },
  })
  if (res.data.status === 0) {
    ElMessage({
      message: "公告发布成功！",
      type: "success",
      duration: 1000,
    })
    TrafficDialogFlag.value = false
  }
}
//关闭Dialog对话框时的回调函数
const handleDialogClose = () => {
  storeMap.map.value.removeLayer(ClipLayer.value)
  source.clear()
  storeMap.map.value.removeInteraction(draw.value)
  draw.value = null
  input.value = ""
  textarea.value = ""
  dataList.value = []
}
//点击导航栏发布公告事件处理函数
const handleClick = () => {
  if (!draw.value) {
    draw.value = createDraw({
      type: "LineString",
      source,
      handleDrawEnd: handleDraw,
    })
    storeMap.map.value.addInteraction(draw.value)
  }
}
const handleDraw = (result) => {
  var pointObj = new Array()
  for (
    let i = 0;
    i < result.feature.getGeometry().getCoordinates().length;
    i++
  ) {
    var pointGeo = new Zondy.Object.Point2D(
      result.feature.getGeometry().getCoordinates()[i][0],
      result.feature.getGeometry().getCoordinates()[i][1]
    )
    pointObj.push(pointGeo)
  }
  var gArc = new Zondy.Object.Arc(pointObj)
  //构成线的折线
  var gAnyLine = new Zondy.Object.AnyLine([gArc])
  //设置线要素的几何信息
  var gline = new Zondy.Object.GLine(gAnyLine)
  //设置要素的几何信息
  var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })
  //设置属性结构
  var regAttStr = new Zondy.Object.CAttStruct({
    FldName: ["ID", "面积", "周长", "LayerID"],
    FldNumber: 4,
    FldType: ["FldLong", "FldDouble", "FldDouble", "FldLong"],
  })
  //实例化CAttDataRow类
  var values = [0, 62.566714, 50.803211, 0]
  var valuesRow = new Zondy.Object.CAttDataRow(values, 1)
  //实例化FeatureBuffBySingleRing类，设置要素缓冲分析必要参数，输出分析结果到缓冲分析结果图层
  var featureBufBySR = new Zondy.Service.FeatureBuffBySingleRing({
    ip: "localhost",
    port: 6163,
    //设置要素缓冲分析左半径
    leftRad: 0.002,
    //设置要素缓冲分析右半径
    rightRad: 0.002,
  })
  /*设置缓冲分析参数*/
  //设置几何信息
  featureBufBySR.sfGeometryXML = JSON.stringify([fGeom])
  //设置属性结构
  featureBufBySR.attStrctXML = JSON.stringify(regAttStr)
  //设置属性值
  featureBufBySR.attRowsXML = JSON.stringify([valuesRow])
  //设置追踪半径
  featureBufBySR.traceRadius = 0.0001
  //设置缓冲结果的名称以及存放地址
  featureBufBySR.resultName =
    "gdbp://MapGisLocal/wuhan/ds/buffer/sfcls/bufferresult" + Date.now()
  //调用Zondy.Service.AnalysisBase基类的execute方法执行要素缓冲分析，AnalysisSuccess为回调函数。
  // startPressBar()
  featureBufBySR.execute(bufferSuccess, "post", false, "json")
}
/**
 * 缓冲区分析成功回调函数，执行裁剪分析
 * @param {object} result 缓冲区分析结果对象
 */
function bufferSuccess(result) {
  var clspath = result.results[0].Value
  clipName.value =
    "gdbp://MapGisLocal/wuhan/ds/clip/sfcls/clipresult" + Date.now()
  //实例化ClipByLayer类
  var clipParam = new Zondy.Service.ClipByLayer({
    ip: "localhost",
    port: 6163,
    //源简单要素类的URL
    srcInfo1: "gdbp://MapGisLocal/wuhan/sfcls/居民区",
    //裁剪框简单要素类的URL
    srcInfo2: clspath,
    //设置结果URL
    desInfo: clipName.value,
    infoOptType: 0,
  })
  //调用基类的execute方法，执行图层裁剪分析。AnalysisSuccess为结果回调函数
  clipParam.execute(clipSuccess, "post", false, "json")
}
function clipSuccess(result) {
  // console.log(result.results[0].Value)
  // new Zondy.Service.Catlog.CatalogServiceBase.getLayerInfo(gdbpUrl,onSuccess)
  ClipLayer.value = new Zondy.Map.GdbpLayer("", [clipName.value], {
    ip: "localhost",
    port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089,
  })
  storeMap.map.value.addLayer(ClipLayer.value)
  queryClipLayer()
}
function queryClipLayer() {
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
  //创建一个用于查询的矩形
  var geomObj = new Zondy.Object.Rectangle(71.97, 10.5, 138.575, 55.79)
  //实例化查询参数对象
  var queryParam = new Zondy.Service.QueryByLayerParameter(clipName.value, {
    geometry: geomObj,
    resultFormat: "json",
    rule: rule,
    struct: queryStruct,
  })
  //设置查询分页号
  queryParam.pageIndex = 0
  //设置查询要素数目
  queryParam.recordNumber = 1000
  //实例化地图文档查询服务对象
  var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
    ip: "localhost",
    port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
  })

  //执行查询操作，querySuccess为查询回调函数
  queryService.query(queryClipSuccess)
}
function queryClipSuccess(result) {
  dataList.value = result.SFEleArray
  TrafficDialogFlag.value = !TrafficDialogFlag.value
}
</script>
<style scoped></style>
