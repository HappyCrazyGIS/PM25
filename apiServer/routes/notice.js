var express = require("express")
var router = express.Router()

// 导入公告路由处理函数
const { getNotice,addNotice } = require("../controllers/notice")
/**
 * 获取公告
 * GET /getNotice
 */
router.get("/getNotice", getNotice)

/**
 * 添加公告
 * POST /addNotice
 */
router.post("/addNotice", addNotice)
module.exports = router
