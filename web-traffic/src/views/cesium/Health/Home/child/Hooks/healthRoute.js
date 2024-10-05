// // Date: 2021-03-23
// // 引入AMap，配置key
// import AMap from "AMap"
// import AMapLoader from '@amap/amap-jsapi-loader'
import { nextTick } from 'vue'
import {
  getRouteData,
  getCoorTransform
} from '../../../../../../api/searchroute.js'
import gcoord from 'gcoord'
// import Cesium from 'cesium'
// 初始化地图，自动补全poi
export const initAutocomplete = (
  inputId,
  startPoint,
  endPoint,
  startCoor,
  endCoor
) => {
  // 延迟执行，确保DOM元素已经渲染
  nextTick(() => {
    AMap.plugin('AMap.AutoComplete', () => {
      const autoOptions = {
        input: inputId
      }
      const autoComplete = new AMap.Autocomplete(autoOptions)
      autoComplete.on('select', (e) => {
        console.log('select', e)
        if (inputId === 'tipinput1') {
          startPoint.value = e.poi.name
          startCoor.longitude = e.poi.location.lng
          startCoor.latitude = e.poi.location.lat
        } else {
          endPoint = e.poi.name
          endCoor.longitude = e.poi.location.lng
          endCoor.latitude = e.poi.location.lat
        }
      })
    })
  })
}
// 分批处理将别的坐标转换为高德地图的wgs84坐标
export const batchCoordinates = async (points, batch_size = 40) => {
  let pointsWGS84 = []
  for (let i = 0; i < points.length; i += batch_size) {
    let batchPoints = points.slice(i, i + batch_size)
    // console.log('batchPoints', batchPoints);
    // 假设getCoorTransform是一个异步函数，返回Promise
    const transformedPoints = await getCoorTransform(batchPoints)
    let coorArr = [] // 初始化coorArr
    // 检查transformedPoints是否为数组
    if (Array.isArray(transformedPoints)) {
      // 如果是数组，合并到pointsWGS84中
      pointsWGS84 = pointsWGS84.concat(transformedPoints)
    } else {
      let coorStr = transformedPoints.data.locations
      coorArr = coorStr.split(';').flatMap((coorStr) => {
        return coorStr.split(',').map(Number)
      })
      pointsWGS84 = pointsWGS84.concat(coorArr) // 确保在else块内部定义的coorArr在这里使用
    }
  }
  // console.log('pointsWGS84', pointsWGS84);
  return pointsWGS84 // 确保返回最终的结果
}
// 设置路径处理成WGS84坐标
export const setRoute = async (path) => {
  let positions = path.flatMap((pathItem) =>
    pathItem.polyline.split(';').map((pointString) => {
      const [longitude, latitude] = pointString.split(',').map(Number)
      return [longitude, latitude]
    })
  )
  let geojson = {
    type: 'LineString',
    coordinates: positions
  }
  gcoord.transform(geojson, gcoord.GCJ02, gcoord.WGS84)
  // 二维数组转换为一维数组
  let result = geojson.coordinates.flat()
  // return geojson.coordinates;
  // console.log('result', result)
  return result
}
