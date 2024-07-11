/* 
  实现要素[点,线,面]的删除
*/
function DeleteFeature({ fids, service, docName }) {
  var deleteService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {
      ip: "localhost",
      port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
    }
  )
  deleteService.deletes(fids, onPntSuccess(docName))
}

//删除点要素回调函数
function onPntSuccess(docName) {
  return function (result) {
    if (result) {
      alert("删除点要素成功!")
      docName.refresh()
    } else {
      alert("删除点要素失败!")
    }
  }
}
