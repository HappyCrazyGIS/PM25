import { ElMessage } from "element-plus"
export const updatePoint = ({ service, res, type }) => {
  // var graphicInfo = new Zondy.Object.WebGraphicsInfo({
  //   InfoType: 1,
  // })
  // res.SFEleArray[0].graphicInfo = graphicInfo
  //设置添加点要素的属性信息
  res.SFEleArray[0].AttValue[7] = type
  //创建一个编辑服务类
  var editService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {
      ip: "localhost",
      port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
    }
  )
  editService.update(res, onPntSuccess)
}
//修改点要素回调函数
function onPntSuccess(data) {
  if (data.succeed) {
    ElMessage({
      message: "修改成功!",
      type: "success",
      offset: 70,
      duration: 1600,
    })
    //刷新图层
    // MapDocLayer.refresh();
  } else {
    ElMessage({
      message: "修改失败!",
      type: "error",
      offset: 70,
      duration: 1600,
    })
  }
}
