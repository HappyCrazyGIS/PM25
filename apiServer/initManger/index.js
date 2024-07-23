// var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
// 解决跨域
const cors = require("cors")

exports.initManger = (app, express) => {
  app.use(
    cors({
      origin: '*', // 允许来自前端应用的请求
      allowedHeaders: ['Authorization', 'Content-Type'], // 允许Authorization和Content-Type请求头
      methods: ['GET', 'POST', 'PUT', 'DELETE'] // 可选，明确允许的HTTP方法
    })
  )
  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
}
