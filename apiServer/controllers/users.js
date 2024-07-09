// 导入数据库连接对象

const db = require("../db")
// 导入配置信息
const { debug, info, token } = require("../config")
// 导入bcryptjs进行用户密码的加密
const bcrypt = require("bcryptjs")
// 导入生成token字符串的包
const jwt = require("jsonwebtoken")

/**
 * 用户注册函数
 */
exports.regUser = async (req, res) => {
  let { username, password, repeatPassword } = req.body
  const type = "common" //普通用户

  let sql = `select * from gg_user where username='${username}'`

  db.query(sql, (err, results) => {
    //判断sql语句是否执行成功
    if (err) {
      return res.send({ status: 1, message: err })
    }
    //判断用户名是否被占用
    if (results.length > 0) {
      return res.send({ status: 1, message: "用户名被占用,请更换用户名!" })
    }
    //调用bcrypt.hashSync(明文密码,随机盐的长度)方法对密码进行加密
    password = bcrypt.hashSync(password, 10) //随机盐长度一般是10
    sql = `insert into gg_user (username,password,type) values ('${username}','${password}','${type}')`
    db.query(sql, (err, results) => {
      //判断sql语句是否执行成功
      if (err) {
        return res.send({ status: 1, message: err })
      }
      //判断影响行数是否为1
      if (results.affectedRows != 1) {
        return res.send({ status: 1, message: "注册失败，请重试！" })
      }
      //注册用户成功
      res.send({
        status: 0,
        message: "注册成功！",
      })
    })
  })
}
/**
 * 用户登录函数
 */
exports.login = async (req, res) => {
  const { username, password } = req.body
  let sql = `select * from gg_user where username='${username}'`
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) {
      return res.send({ status: 1, message: err })
    }
    //执行sql语句成功，但是获取到的数据条数不等于1
    if (results.length != 1) {
      return res.send({ status: 1, message: "用户不存在！" })
    }
    //判断密码是否正确  bcrypt.compareSync(客户端密码,数据库密码)
    const compareResult = bcrypt.compareSync(password, results[0].password)
    //密码错误
    if (!compareResult) return res.send({ status: 1, message: "密码错误！" })
    //密码正确
    //剔除密码
    const user = { ...results[0], password: "" }
    //对用户信息进行加密，生成 Token 字符串
    const tokenStr = jwt.sign(user, token.jwtSecretKey, {
      expiresIn: token.expiresIn,
    })

    /**
     * 挂载token,发送到客户端
     */
    // 设置响应头
    res.setHeader("Access-Control-Expose-Headers", "Authorization")
    // 挂载token
    res.header("Authorization", "Bearer " + tokenStr)

    //调用 res.send()方法，将 Token 响应给客户端
    res.send({
      status: 0,
      message: "登录成功！",
      data: user,
      //为了方便客户端使用Token，在服务端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenStr,
    })
  })
}
/**
 * 获取头像
 */
exports.getAvatar = async (req, res) => {
  const { id } = req.query
  let sql = `select user_id,username,avatar_url from gg_user where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.length != 1) {
      return res.send({ status: 1, message: "查询失败！" })
    }
    res.send({
      status: 0,
      message: "查询成功！",
      data: results,
    })
  })
}
/**
 *上传头像
 */
exports.uploadAvatar = async (req, res) => {
  const { id } = req.params
  //头像路径
  const avatar = req.file ? `images/uploads/${req.file.filename}` : ""
  let sql = `update gg_user set avatar_url='${avatar}' where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    sql = `select user_id, username, avatar_url from gg_user where user_id=${id}`
    db.query(sql, (err, results) => {
      if (err) {
        return res.send({ status: 1, message: err })
      }
      res.send({
        status: 0,
        message: "上传头像成功！",
        data: results,
      })
    })
  })
}
/**
 * 添加用户函数
 */
exports.addUser = (req, res) => {
  let { username, password, type } = req.body
  let sql = `select * from gg_user where username='${username}'`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.length > 0) {
      return res.send({ status: 1, message: "用户名被占用,请更换用户名!" })
    }
    password = bcrypt.hashSync(password, 10)
    sql = `insert into gg_user (username,password,type) values ('${username}','${password}','${type}')`
    db.query(sql, (err, results) => {
      if (err) {
        return res.send({ status: 1, message: err })
      }
      if (results.affectedRows != 1) {
        return res.send({ status: 1, message: "添加失败，请重试！" })
      }
      res.send({
        status: 0,
        message: "添加成功！",
      })
    })
  })
}

/**
 * 获取用户信息函数
 */
exports.getUser = (req, res) => {
  const { type, page, size } = req.query
  //计算偏移量
  const offset = (page - 1) * size
  let total = 0
  let sql = `select * from gg_user where type='${type}' and del=1`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    total = results.length

    sql = `select user_id,username,password,type,onlinestatus,del from gg_user where type='${type}' and del=1 limit ${offset},${size}`
    db.query(sql, (err, results) => {
      if (err) {
        return res.send({ status: 1, message: err })
      }
      res.send({
        status: 0,
        message: "查询成功！",
        total,
        data: results,
      })
    })
  })
}

/**
 * 更改用户身份函数
 */
exports.changeUser = (req, res) => {
  const { id, type } = req.body
  // console.log(id, type)
  let sql = `update gg_user set type='${type}' where user_id =${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.affectedRows != 1) {
      return res.send({ status: 1, message: "修改身份失败！" })
    }
    res.send({
      status: 0,
      message: "修改身份成功！",
    })
  })
}

/**
 * 修改用户信息
 */
exports.updateUser = (req, res) => {
  let { id, username, password } = req.body
  password = bcrypt.hashSync(password, 10)
  let sql = `update gg_user set username='${username}',password='${password}' where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.affectedRows != 1) {
      return res.send({ status: 1, message: "修改用户信息失败！" })
    }
    res.send({
      status: 0,
      message: "修改用户信息成功！",
    })
  })
}

/**
 * 修改自己的信息
 */
exports.updateOwnInfo = (req, res) => {
  let { id, username, oldPassword, newPassword, repeatNewPassword } = req.body
  let sql = `select * from gg_user where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.length != 1) {
      return res.send({ status: 1, message: "该用户不存在！" })
    }
    const compareResult = bcrypt.compareSync(oldPassword, results[0].password)
    // 判断旧密码是否正确
    if (!compareResult) {
      if (oldPwd != results[0].password) {
        return res.send({ status: 1, message: "旧密码错误" })
      }
    }
    // 加密新密码
    newPassword = bcrypt.hashSync(newPassword, 10)
    //更新数据库中的旧密码
    sql = `update gg_user set password='${newPassword}',username='${username}' where user_id=${id}`
    db.query(sql, (err, results) => {
      if (err) {
        return res.send({ status: 1, message: err })
      }
      if (results.affectedRows != 1) {
        return res.send({ status: 1, message: "信息更新失败！" })
      }
      res.send({
        status: 0,
        message: "信息修改成功！",
      })
    })
  })
}

/**
 * 删除用户函数
 */
exports.deleteUser = (req, res) => {
  const { id } = req.body
  let sql = `update gg_user set del=0 where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.affectedRows != 1) {
      return res.send({ status: 1, message: "删除用户失败！" })
    }
    res.send({
      status: 0,
      message: "删除用户成功！",
    })
  })
}

/**
 * 切换用户登录状态
 */
exports.toggleUser = (req, res) => {
  const { id, onlinestatus } = req.body
  let sql = `update gg_user set onlinestatus=${onlinestatus} where user_id=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    if (results.affectedRows != 1) {
      return res.send({ status: 1, message: "切换用户登录状态失败！" })
    }
    res.send({
      status: 0,
      message: "切换用户登录状态成功！",
    })
  })
}
/**
 * 搜索用户
 */
exports.searchUser = (req, res) => {
  const { keyword, type, page, size } = req.query
  //计算偏移量
  const offset = (page - 1) * size
  let total = 0
  let sql = `select * from gg_user where type='${type}' and username like '%${keyword}%' and del=1`

  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err })
    }
    total = results.length
    sql = `select user_id,username,type,onlinestatus,del from gg_user where type='${type}' and del=1 and username like '%${keyword}%' limit ${offset},${size}`
    db.query(sql, (err, results) => {
      if (err) {
        return res.send({ status: 1, message: err })
      }
      res.send({
        status: 0,
        message: "搜索查询成功！",
        data: results,
        total,
      })
    })
  })
}
