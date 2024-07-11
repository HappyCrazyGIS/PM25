// 导入数据库连接对象
const db = require("../db")
// 导入配置信息
const { debug, info } = require("../config")

/**
 * 报告路况
 */
exports.handleReportRoad = async (req, res) => {
  const { id, type, mark, address, date, describe } = req.body
  const sql = `insert into gg_event(user_id,event_type,event_addr,event_mark,event_time,event_desc) values(${id},'${type}','${address}','${mark}','${date}','${describe}')`
  const [rows] = await db.promise().query(sql)
  if (rows.affectedRows == 1) {
    res.send(info(0, "报告路况成功", ""))
  }
}
/**
 * 获取路况信息
 */
exports.getRoadInfo = async (req, res) => {
  const { page = 1, size = 5, type } = req.query
  // 计算偏移量
  const offset = (page - 1) * size
  if (type == null) {
    let sql = `select * from gg_event where event_status!=2 order by event_id desc limit ${offset},${size}`
    const [rows] = await db.promise().query(sql)
    if (rows.length != 0) {
      sql = `select count(event_id)as total from gg_event where event_status <>2 `
      const [result] = await db.promise().query(sql)
      const { total } = result[0]
      res.send(info(0, "获取成功", { total, rows }))
    }
  } else {
    let sql = `select * from gg_event where event_status!=2 and event_type like'%${type}%' order by event_id desc limit ${offset},${size}`
    const [rows] = await db.promise().query(sql)
    if (rows.length != 0) {
      sql = `select count(event_id)as total from gg_event where event_status <>2 and event_type like'%${type}%'`
      const [result] = await db.promise().query(sql)
      const { total } = result[0]
      res.send(info(0, "获取成功", { total, rows }))
    } else {
      res.send(info(0, "查询无数据", { total: 0 }))
    }
  }
}
/**
 * 修改信息
 */
exports.updateInfo = async (req, res) => {
  const { id, status } = req.body
  const sql = `update gg_event set event_status=${status} where event_id=${id}`
  try {
    const [rows] = await db.promise().query(sql)
    if (rows.affectedRows == 1) {
      res.send(info(0, "状态已修改", ""))
    }
  } catch (err) {
    res.send(info(1, "数据库执行错误", debug ? err : ""))
  }
}
