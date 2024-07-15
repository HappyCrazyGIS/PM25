var express = require("express")
var path = require("path")
const { initManger } = require("./initManger")
// 导入router
var usersRouter = require("./routes/users")
var eventRouter = require("./routes/event")
var noticeRouter = require("./routes/notice")

//导入定义验证规则的包
const joi = require("joi")

var app = express()
// 注册中间件
initManger(app, express)
app.use(express.static(path.join(__dirname, "public")))

//一定要在路由之前，配置解析 Token 的中间件
const { expressjwt: expressJWT } = require("express-jwt")
const { token } = require("./config")
app.use(
  expressJWT({ secret: token.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/users\/login/, /^\/users\/regUser/],
  })
)

/**
 * 定义一个中间件
 * 用来重新刷新token
 */
// 导入生成token字符串的包
const jwt = require("jsonwebtoken")
app.use((req, res, next) => {
  // 排除登录注册接口
  if (req.url.includes("login") || req.url.includes("regUser")) {
    next()
    return
  }
  if (req.auth) {
    const user = {
      id: req.auth.id,
      username: req.auth.username,
      password: "",
      avatar: "",
    }
    let newToken = jwt.sign(user, token.jwtSecretKey, {
      expiresIn: token.expiresIn,
    })
    res.setHeader("Access-Control-Expose-Headers", "Authorization")
    res.header("Authorization", "Bearer " + newToken)
    next()
    return
  }
  next()
})

// 路由
app.use("/users", usersRouter)
app.use("/event", eventRouter)
app.use("/notice", noticeRouter)

//定义错误级别的中间件
app.use((err, req, res, next) => {
  //验证规则导致的错误
  if (err instanceof joi.ValidationError)
    return res.send({ status: 1, message: err })
  //身份认证失败后的错误
  if (err.name === "UnauthorizedError")
    return res.status(401).send({ status: 1, message: "身份认证失败！" })
  //未知的错误
  res.send({ status: 1, message: err })
})

module.exports = app
