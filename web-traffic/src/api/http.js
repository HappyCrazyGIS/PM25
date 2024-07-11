import instance from "../request/index"

export default function http({
  url = {},
  method = "post",
  data = {},
  params = {},
  headers = {},
}) {
  return instance({
    url,
    method,
    data,
    params: params,
    headers,
  })
}
