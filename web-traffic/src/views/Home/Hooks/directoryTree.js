import { ref,onMounted } from "vue"

let treeData = ref([])
var ip = "localhost"
var ip = 6163
var mapName = "guanggu"

var mapService = new Zondy.Service.GetMapInfoService({
  //设置GIS数据服务器IP
  ip,
  //设置端口号
  port,
  //地图的名称
  mapName,
})
mapService.GetMapInfo(getMapInfoSuccess)
function getMapInfoSuccess(data) {
  console.log(data.name)
  if (data.name) {
    getInfo(data.name)
  }
}
const getInfo = (docName) => {
  // 获取该地图文档下所有图层信息
  var docCatalog = new Zondy.Catalog.MapDoc({
    ip,
    port,
    docName,
    // mapIndex: 0,
  })
  //调用getLayersInfo函数，获取地图文档中所有图层相关信息，在回调函数中处理结果
  docCatalog.getLayersInfo(getListSuccessTest)
  // 获取该地图文档下所有图层信息成功的回调
  function getListSuccessTest(data) {
    // console.log(data.value)
    treeData.value = data.value
  }
}
