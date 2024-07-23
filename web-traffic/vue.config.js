module.exports = {
  configureWebpack: {
    externals: {
      AMap: 'AMap' // 表示CDN引入的高德地图
    }
  }
}
