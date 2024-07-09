const mysql = require("mysql2")
// 导入数据库配置信息
const { mysql: dbConfig } = require("../config")
const db = mysql.createPool(dbConfig)
module.exports = db
