//导入定义验证规则的包
const joi = require("joi")

//定义用户名和密码的验证规则
const username = joi.string().min(1).max(8).required()

const password = joi
  .string()
  .pattern(/^[\S]{6,18}$/)
  .required()

const id = joi.number()

//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password,
    repeatPassword: joi.ref("password"),
  },
}

// 定义验证修改密码的规则对象
exports.reg_updatePwd_schema = {
  body: {
    id,
    username,
    oldPassword: password,
    newPassword: joi.not(joi.ref("oldPassword")).concat(password),
    repeatNewPassword: joi.ref("newPassword"),
  },
}
