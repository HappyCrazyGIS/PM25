var express = require("express")
var router = express.Router()
// 导入路由处理函数
const {
  handleReportRoad,
  getRoadInfo,
  updateInfo,
} = require("../controllers/event")

/**
 * 报告路况路由
 * POST /addEvent
 */
router.post("/reportRoad", handleReportRoad)
/**
 * 获取路况信息
 * get /getEvent
 */
router.get("/getEvent", getRoadInfo)
/**
 * 修改审核状态
 * put /update
 */
router.put("/update", updateInfo)

module.exports = router
