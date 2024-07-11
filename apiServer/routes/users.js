var express = require("express")
var router = express.Router()

// 导入用户路由处理函数
const {
  login,
  regUser,
  getUser,
  changeUser,
  deleteUser,
  toggleUser,
  updateUser,
  addUser,
  updateOwnInfo,
  uploadAvatar,
  getAvatar,
  searchUser,
} = require("../controllers/users")

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
//导入需要的验证规则对象
const { reg_login_schema, reg_updatePwd_schema } = require("../schema/user")
// 导入multer包
const multer = require("multer")
// 文件存储位置
const upload = multer({ dest: "public/images/uploads/" })

/**
 * 登录路由
 * POST /login
 */
router.post("/login", expressJoi(reg_login_schema), login)
/**
 * 注册路由
 * POST /regUser
 */
router.post("/regUser", expressJoi(reg_login_schema), regUser)
/**
 * 获取头像
 */
router.get("/getAvatar", getAvatar)
/**
 * 上传头像
 */
router.post("/uploadAvatar/:id", upload.single("avatar"), uploadAvatar)

/**
 * 添加用户
 * POST /addUser
 */
router.post("/addUser", addUser)

/**
 * 获取用户
 * GET /getUser
 */
router.get("/getUser", getUser)

/**
 * 更改用户身份
 * POST /changeUser
 */
router.post("/changeUser", changeUser)

/**
 * 修改用户信息`
 */
router.post("/updateUser", updateUser)

/**
 * 修改自己的信息`
 */
router.post("/updateOwnInfo", expressJoi(reg_updatePwd_schema), updateOwnInfo)

/**
 * 删除用户
 * POST /deleteUser
 */
router.post("/deleteUser", deleteUser)

/**
 * 切换用户登录状态
 * POST /toggleUser
 */
router.post("/toggleUser", toggleUser)

/**
 * 搜索用户
 */
router.get("/searchUser", searchUser)

module.exports = router
