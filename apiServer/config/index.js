/**
 * 全局配置文件
 */
module.exports = {
  // 用户标记是否测试环境
  debug: true,
  // 数据库配置
  mysql: {
    connectionLimit: 1,
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "wsh2469",
    database: "db_traffic",
    dateStrings: true, //处理时间格式，适用于mysql2
  },
  // 响应客户端信息的函数
  info: (code, msg, result) => {
    return {
      code,
      msg,
      result,
    }
  },
  // token密钥
  // token有效期
  token: {
    jwtSecretKey: "traffic_token_sik_^_^",
    expiresIn: "1h",
  },
}
