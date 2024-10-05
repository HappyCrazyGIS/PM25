const WebSocket = require('ws')

function initializeWebSocket(server) {
  // 创建 WebSocket 服务器，使用 HTTP 服务器共享端口
  const wss = new WebSocket.Server({ server })

  // 处理客户端连接
  wss.on('connection', (ws) => {
    console.log('客户端已连接')

    ws.on('message', (message) => {
      console.log('接收到的数据:', message)
      // 可以在此处理数据，如将轨迹数据存储到数据库
      ws.send('数据已收到') // 返回确认给客户端
    })

    ws.on('close', () => {
      console.log('客户端断开连接')
    })
  })

  console.log('WebSocket 服务器已初始化')
}

module.exports = {
  initializeWebSocket
}
