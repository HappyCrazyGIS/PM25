import instance from "./outServeRequest.js"

// 访问高德地图api，获取数据;v3有polyline，v5没有
const url = '/amap/v3/direction/'
const key = '0be76c3b029584a7348ac50192f4f765'
export function getRoute(routeOpt,originCoor,destinationCoor,) {
  let routeUrl = ''
  if (routeOpt === 'integrated') {
    //后面两个city的值是城市的adcode
    routeUrl = `${url}/transit/${routeOpt}?&key=${key}&origin=${originCoor.lng},${originCoor.lat}&destination=${destinationCoor.lng},${destinationCoor.lat}&city=110000&cityd=110000`
  } else {
    routeUrl = `${url}${routeOpt}?&key=${key}&origin=${originCoor.lng},${originCoor.lat}&destination=${destinationCoor.lng},${destinationCoor.lat}`
  }
  return routeUrl
}

export function getRouteData(routeOpt,originCoor,destinationCoor) {
  const routeUrl = getRoute(routeOpt,originCoor,destinationCoor)
  return instance.get(routeUrl)
}


// 坐标系转换服务
// 输入参数为数组，数组第一个元素为经度，第二个元素为纬度
export function getCoorTransform(originCoorbatch) {
  // 将数组转换为字符串
  const locations = originCoorbatch
    .map((coor, index) => {
      const coorStr = coor
      if (index % 2 === 1 && index !==0 && index !== originCoorbatch.length - 1) {
        return `${coorStr}|`
      }
      if(index === originCoorbatch.length - 1) {
        return `${coorStr}`
      }
      else {
        return `${coorStr},`
      }
    })
    .join('')
  //去掉最后一个|符号
  const url = `/amap/v3/assistant/coordinate/convert?key=${key}&locations=${locations}&coordsys=gps`
  return instance.get(url)
}