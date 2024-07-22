var express = require("express")
var router = express.Router()

// 导入路由处理函数
const{getPMTif} = require("../controllers/pm25")

// 获取tif数据
router.get("/getPmFile",getPMTif)

module.exports = router