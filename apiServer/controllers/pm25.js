
// 导入文件处理模块
const fs = require('fs');
const path = require('path');

// 获取PM2.5tif数据
exports.getPMTif = async (req, res) => {
  // PM2.5路径
  const filePath = path.join(__dirname, '../public/images/pm', 'tempdata.tif')
  console.log(filePath);
  try {
    const stat = fs.statSync(filePath)
    // 设置响应头部
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'image/tiff');
    // 路径获取成功
    res.send({
      status: 0,
      path:filePath
    })
  } catch (err) {
    console.log(err);
    return res.send({ status: 1, message: err })
  }

}