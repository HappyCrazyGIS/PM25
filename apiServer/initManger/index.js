// var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
// 解决跨域
const cors = require("cors")

exports.initManger = (app, express) => {
  app.use(cors())
  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
}
