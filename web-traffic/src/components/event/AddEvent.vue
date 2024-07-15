<template>
  <div class="addEvent-container">
    <el-menu-item index="6-3" @click="activeDraw">事件添加</el-menu-item>
    <el-dialog
      v-model="dialogVisible"
      width="30%"
      align-center
      center
      append-to-body
      draggable
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-position="right"
        label-width="100px"
        :model="eventInfo"
        style="max-width: 460px"
      >
        <el-form-item label="事件等级" prop="grade">
          <el-select v-model="eventInfo.grade" class="m-2" placeholder="Select">
            <el-option
              v-for="item in optionGrade"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="type">
          <el-select v-model="eventInfo.type" class="m-2" placeholder="Select">
            <el-option
              v-for="item in optionType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件编号" prop="id">
          <el-input v-model="eventInfo.id" disabled />
        </el-form-item>
        <el-form-item label="发生地点" prop="address">
          <el-input
            v-model="eventInfo.address"
            placeholder="请输入事件地址,包含发生事件的路段"
          />
        </el-form-item>
        <el-form-item label="发生时间" prop="date">
          <el-date-picker
            v-model="eventInfo.date"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="处理状态" prop="status">
          <el-select
            v-model="eventInfo.status"
            class="m-2"
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in optionStatus"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNumber">
          <el-input
            v-model="eventInfo.vehicleNumber"
            placeholder="请输入车牌号"
          />
        </el-form-item>
        <el-form-item label="驾驶员" prop="name">
          <el-input v-model="eventInfo.name" placeholder="请输入驾驶员姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="handleConfirm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { nextTick, reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import moment from "moment"
import EventBus from "../../Bus/event"
import { useMap } from "../../stores/useMap"
const store = useMap()
// 表单对象
const ruleFormRef = ref()
const dialogVisible = ref(false)
let draw = ref(null)
let source = ref(null)
let lnglat = ref(null)
const eventInfo = reactive({
  id: "",
  type: "",
  grade: "",
  date: "",
  address: "",
  vehicleNumber: "",
  name: "",
  status: "",
})
const optionGrade = [
  { id: 1, name: "轻微事故" },
  { id: 2, name: "一般事故" },
  { id: 3, name: "重大事故" },
  { id: 4, name: "特大事故" },
]
const optionType = ["刮擦", "碰撞", "拥堵", "碾压", "失火", "翻车", "其他"]
const optionStatus = ["待处理", "已归档", "已忽略"]
const rules = reactive({
  grade: [{ required: true, message: "请选择事件等级", trigger: "blur" }],
  id: [{ required: true, message: "事件编号不能为空", trigger: "blur" }],
  type: [{ required: true, message: "请选择事件类型", trigger: "blur" }],
  address: [{ required: true, message: "事件地址不能为空", trigger: "blur" }],
  date: [{ required: true, message: "请选择时间", trigger: "blur" }],
  status: [{ required: true, message: "请选择处理状态", trigger: "blur" }],
  vehicleNumber: [
    { required: true, message: "车牌号不能为空", trigger: "blur" },
  ],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
})
// 激活画笔
const activeDraw = () => {
  store.removeDraw()
  draw.value = createDraw({
    source: source.value,
    handleDrawEnd: handleDraw,
  })
  store.map.value.addInteraction(draw.value)
  store.draw = draw.value
  EventBus.emit("removeDraw")
}
// 画笔回调
const handleDraw = (e) => {
  lnglat.value = e.target.sketchCoords_
  dialogVisible.value = true
  const val = moment(new Date()).format("YYYY.MM.DD.HH.mm.ss")
  eventInfo.id = "sj" + val.replaceAll(".", "")
}
// 取消按钮
const handleCancel = (FormInstance) => {
  dialogVisible.value = false
  source.value.clear()
  FormInstance.resetFields()
}
// 确定按钮回调
const handleConfirm = (FormInstance) => {
  if (!FormInstance) return
  FormInstance.validate((valid, fields) => {
    if (valid) {
      // console.log(eventInfo)
      // 转换时间
      const date = moment(eventInfo.date).format("YYYY.MM.DD HH:mm:ss")
      // console.log(date)
      let service = {
        name: "guanggu",
        layerId: 2,
      }
      let attr = []
      let fldName = [
        "事件编号",
        "事件类型",
        "事件等级",
        "发生时间",
        "发生地点",
        "车牌号",
        "驾驶员",
        "处理状态",
      ]
      let color = 0
      // 转换颜色
      switch (eventInfo.grade) {
        case 1:
          color = 42
          break
        case 2:
          color = 4
          break
        case 3:
          color = 90
          break
        default:
          color = 6
          break
      }
      for (let i in eventInfo) {
        if (i == "date") {
          attr.push(date)
        } else {
          attr.push(eventInfo[i])
        }
      }
      // console.log(attr)
      // console.log(fldName)
      // 添加要素函数
      Point.addPoint({
        lnglat: lnglat.value,
        attr,
        fldName,
        color,
        service,
        callback: onPntSuccess,
      })
    } else {
      ElMessage({
        message: "事件信息不能为空，请重新填写",
        type: "warning",
        offset: 70,
        duration: 1500,
      })
    }
  })
}
//添加点要素回调函数
const onPntSuccess = (data) => {
  if (data.succeed) {
    ElMessage({
      message: "添加事件成功",
      type: "success",
      offset: 70,
      duration: 1500,
    })
    source.value.clear()
    dialogVisible.value = false
    store.ggMap.refresh()
  } else {
    ElMessage({
      message: "添加事件失败,请重试!",
      type: "error",
      offset: 70,
      duration: 1500,
    })
  }
}
nextTick(() => {
  source.value = new ol.source.Vector({})
  var layer = new ol.layer.Vector({
    source: source.value,
  })
  store.map.value.addLayer(layer)
})
</script>
<style scoped></style>
