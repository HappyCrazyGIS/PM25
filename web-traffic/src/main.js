import { createApp } from "vue"
import { createPinia } from "pinia"
import "animate.css"
import App from "./App.vue"
import router from "./router"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
// 导入vue-echarts
import "echarts"
import ECharts from "vue-echarts"
// 导入 OpenLayers 核心模块
// import 'ol/ol.css';
// import * as ol from 'ol';
// 将 OpenLayers 添加到全局属性中


const pinia = createPinia()
const app = createApp(App)
// app.config.globalProperties.$ol = ol
app.component("v-chart", ECharts)
// 全局注册el-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, { locale: zhCn })

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.mount("#app")
