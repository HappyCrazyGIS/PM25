//查询成功回调
export const querySuccess = (result) => {
  //初始化Zondy.Format.PolygonJSON类
  var format = new Zondy.Format.PolygonJSON()
  //将MapGIS要素JSON反序列化为ol.Feature类型数组
  var features = format.read(result)

  result.SFEleArray.forEach((item, index) => {
    //车流量
    let num = item.AttValue[4]

    //配色
    let color = "#34b000"
    if (num <= 1500 && num > 1000) {
      color = "#fecb00"
    } else if (num > 1500) {
      color = "#8e0e0b"
    }

    //样式
    let styles = new ol.style.Style({
      //边线样式
      stroke: new ol.style.Stroke({
        color: color,
        width: 8,
      }),
    })

    //给要素分别添加样式
    features[index].setStyle(styles)
  })
  return features
}
