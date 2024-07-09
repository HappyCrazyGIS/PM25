import axios from "axios"
import http from "../api/http"
const url = "http://localhost:3000"
export const reportRoad = (params) => {
  // return axios.post(url + "/event/reportRoad", params)
  return http({
    url: "event/reportRoad",
    data: params,
  })
}
export const getRoadInfo = (params) => {
  // return axios(url + "/event/getEvent", { params: params })
  return http({
    url: "event/getEvent",
    method: "get",
    params: params,
  })
}
export const updateInfo = (params) => {
  // return axios.put(url + "/event/update", params)
  return http({
    method: "put",
    url: "event/update",
    data: params,
  })
}
