let socket = null // WebSocket 实例
let isTracking = false // 标志是否正在进行位置追踪
let isPaused = false // 标志是否处于暂停状态
let trackPoints = [] // 保存采集的轨迹点
let watchId = null // 保存 watchPosition 的 ID，便于暂停和恢复
let reconnectAttempts = 0 // 记录重连尝试次数
const MAX_RECONNECT_ATTEMPTS = 10 // 最大重连次数
let manuallyClosed = false // 用于标记 WebSocket 是否是手动关闭

/**
 * 初始化 WebSocket 连接，并设定定时任务，每2分钟发送缓存数据
 */
export function initWebSocket() {
  manuallyClosed = false // 在初始化时，将手动关闭标志设为 false
  connectWebSocket() // 建立 WebSocket 连接

  // 设置定时器，每隔 2 分钟检查缓存数据并尝试发送到服务器
  setInterval(() => {
    sendCachedData()
  }, 2 * 60 * 1000) // 每2分钟执行一次
}

/**
 * 建立 WebSocket 连接，并处理连接事件
 */
function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3000') // 连接到 WebSocket 服务器

  // 当 WebSocket 连接成功时触发
  socket.onopen = () => {
    console.log('WebSocket 已连接')
    reconnectAttempts = 0 // 重置重连尝试次数
    sendCachedData() // 连接成功后，尝试发送缓存的数据
  }

  // 当接收到服务器消息时触发
  socket.onmessage = (event) => {
    console.log('服务器返回的数据:', event.data) // 打印服务器发来的消息
  }

  // 当 WebSocket 连接关闭时触发
  socket.onclose = () => {
    if (!manuallyClosed) {
      console.log('WebSocket 意外断开，尝试重连...')
      attemptReconnect() // 如果不是手动关闭，执行重连逻辑
    } else {
      console.log('WebSocket 已手动关闭，不进行重连')
    }
  }

  // 当 WebSocket 发生错误时触发
  socket.onerror = (error) => {
    console.error('WebSocket 发生错误:', error)
    socket.close() // 关闭连接，触发 onclose 事件
  }
}

/**
 * 当 WebSocket 意外断开时，自动执行重连逻辑
 */
function attemptReconnect() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    // 如果未超过最大重连次数
    reconnectAttempts++ // 增加重连次数
    console.log(
      `尝试重新连接 (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`
    )

    // 设置重连间隔，使用指数退避算法（重连延迟逐步增加，最大 30 秒）
    const reconnectDelay = Math.min(5000 * reconnectAttempts, 30000) // 最大延迟 30 秒
    setTimeout(() => {
      connectWebSocket() // 再次尝试连接 WebSocket
    }, reconnectDelay)
  } else {
    console.error('无法重新连接到 WebSocket，达到最大重连次数')
  }
}

/**
 * 开始记录地理位置，并实时通过 WebSocket 发送
 */
export function startTracking() {
  if (socket && socket.readyState === WebSocket.OPEN && !isTracking) {
    // 如果 WebSocket 连接已打开并且没有正在记录
    isTracking = true // 标记开始追踪
    isPaused = false // 标记未暂停

    // 使用浏览器 Geolocation API 获取实时位置
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const data = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timestamp: new Date() // 记录时间戳
        }
        trackPoints.push(data) // 将新的轨迹点加入数组

        // 将数据存储到 localStorage 以防数据丢失
        saveDataToLocalStorage(data)
        console.log('位置已保存到 localStorage:', data)

        // 如果 WebSocket 连接正常，实时发送数据
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data))
        }
      },
      (error) => {
        console.error('获取位置失败:', error)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // 高精度模式，定时获取位置
    )
  } else {
    console.error('WebSocket 连接尚未就绪或已在进行追踪')
  }
}

/**
 * 暂停或继续记录地理位置
 */
export function toggleTracking() {
  if (isTracking && !isPaused) {
    // 暂停记录
    isPaused = true
    navigator.geolocation.clearWatch(watchId) // 暂停位置追踪
    console.log('轨迹记录已暂停')
  } else if (isTracking && isPaused) {
    // 恢复记录
    isPaused = false
    startTracking() // 继续追踪位置
    console.log('轨迹记录已恢复')
  } else {
    console.error('当前没有正在进行的轨迹记录')
  }
}

/**
 * 停止记录地理位置，并发送轨迹数据到服务器
 */
export function stopTracking() {
  if (isTracking) {
    isTracking = false // 停止追踪标志
    navigator.geolocation.clearWatch(watchId) // 停止位置追踪

    if (socket && socket.readyState === WebSocket.OPEN) {
      // 发送停止记录的消息，并传输所有已记录的轨迹点
      socket.send(
        JSON.stringify({ message: '停止记录', points: trackPoints })
      )
      sendCachedData() // 发送缓存的数据到服务器
      closeWebSocket() // 手动关闭 WebSocket 连接
      console.log('停止记录，已发送所有数据')
    } else {
      console.error('WebSocket 连接未建立，无法发送数据')
    }
  }
}

/**
 * 手动关闭 WebSocket 连接，避免自动重连
 */
export function closeWebSocket() {
  if (socket) {
    manuallyClosed = true // 设置手动关闭标志
    socket.close() // 手动关闭 WebSocket 连接
    console.log('WebSocket 已手动关闭')
  }
}

/**
 * 将轨迹数据存储到 localStorage 中
 * @param {Object} data 轨迹点数据
 */
function saveDataToLocalStorage(data) {
  let storedData = JSON.parse(localStorage.getItem('trackPoints')) || [] // 从 localStorage 中获取已存储的数据
  storedData.push(data) // 将新的轨迹点加入数组
  localStorage.setItem('trackPoints', JSON.stringify(storedData)) // 更新 localStorage 中的数据
}

/**
 * 发送缓存的轨迹数据到服务器
 */
function sendCachedData() {
  let storedData = JSON.parse(localStorage.getItem('trackPoints')) || [] // 读取 localStorage 中的缓存数据

  if (
    storedData.length > 0 &&
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    // 如果有缓存数据且 WebSocket 连接正常
    socket.send(JSON.stringify(storedData)) // 发送缓存数据到服务器
    console.log('发送缓存数据到服务器:', storedData)

    // 清空 localStorage 中的缓存数据
    localStorage.removeItem('trackPoints')
  } else if (storedData.length > 0) {
    console.log('缓存数据存在，但 WebSocket 连接尚未就绪')
  }
}
