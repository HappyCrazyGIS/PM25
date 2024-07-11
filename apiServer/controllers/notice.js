// 导入数据库连接对象
const db = require("../db")
// 导入配置信息
const { debug, info, token } = require("../config")

/**
 * 获取公告函数
 */
exports.getNotice = (req, res) => {
  const { page, size } = req.query
  // console.log(page, size)
  // 计算偏移量
  const offset = (page - 1) * size

  let total = 0
  let sql = "select * from gg_notice"
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    total = results.length

    sql = `SELECT notice_id,notice_title,notice_content,notice_time,username FROM gg_notice,gg_user where gg_notice.user_id = gg_user.user_id order by notice_time desc limit ${offset},${size}`
    db.query(sql, (err, results) => {
      // console.log(results)
      if (err) {
        return res.send({ status: 1, message: err })
      }
      res.send({
        status: 0,
        message: "查询成功！",
        data: results,
        total: total,
      })
    })
  })
}

/**
 * 添加公告函数
 */
exports.addNotice = (req, res) => {
  const { title, content, user_id } = req.body
  // console.log(title, content, user_id)
  let sql = `insert into gg_notice (notice_title,notice_content,user_id) values('${title}','${content}',${user_id})`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "发布失败！" })
    }
    res.send({
      status: 0,
      message: "发布成功！",
    })
  })
}
