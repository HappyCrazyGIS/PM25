export const format = (res) => {
  res.SFEleArray.forEach((item) => {
    if (item.AttValue[7] == 0) {
      item.AttValue[7] = "待处理"
    } else if (item.AttValue[7] == 1) {
      item.AttValue[7] = "已处理"
    } else {
      item.AttValue[7] = "已忽略"
    }
  })
  return res
}
