//导入axios，封装axios实例，设置请求拦截器和响应拦截器，然后设置url，传入参数，访问高德地图api，获取数据
import axios from 'axios'
import { useToken } from '../stores/useToken'
const tokenStore = useToken()

const instance = axios.create({
  timeout: 5000
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // console.log('请求成功拦截');
    config.headers.Authorization = tokenStore.token
    return config
  },
  (error) => {
    // console.log('请求失败拦截');
    console.log(error)
    return Promise.reject(error)
  }
)

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { authorization } = response.headers
    if (authorization) {
      tokenStore.setToken(authorization)
    }
    // console.log("响应成功拦截");
    return response
  },
  (error) => {
    // console.log("响应失败拦截");
    if (error.response.status == 401) {
      tokenStore.setToken('')
      location.href = '/not-found'
    }
    console.log(error)
    return Promise.reject(error)
  }
)

export default instance