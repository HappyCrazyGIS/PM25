<template>
  <div class="Road-container">
    <el-dialog
      v-model="centerDialogVisible"
      title="报告路况"
      width="30%"
      align-center
      center
      :show-close="false"
      draggable
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-position="right"
        label-width="100px"
        :model="roadStatus"
        style="max-width: 460px"
      >
        <el-form-item label="事件类型" prop="type">
          <el-select v-model="roadStatus.type" class="m-2" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件地址" prop="address">
          <el-input
            v-model="roadStatus.address"
            placeholder="请输入路况地址,包含事故路段"
          />
        </el-form-item>
        <el-form-item label="建筑标识">
          <el-input
            v-model="roadStatus.mark"
            placeholder="请输入事故最近的建筑标识"
          />
        </el-form-item>
        <el-form-item label="发生时间" prop="date">
          <el-date-picker
            v-model="roadStatus.date"
            type="datetime"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="事件描述">
          <el-input
            v-model="roadStatus.describe"
            :autosize="{ minRows: 1, maxRows: 4 }"
            type="textarea"
            placeholder="请输入事故的具体信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleEmit(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="handleConfirm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, watchEffect } from "vue"
import { ElMessage } from "element-plus"
import moment from "moment"
import { useToken } from "../../stores/useToken"
import { reportRoad } from "../../request/eventHttp"
const store = useToken()
let centerDialogVisible = ref(false)
const roadStatus = reactive({
  type: "",
  mark: "",
  address: "",
  date: "",
  describe: "",
})
const options = ref(["拥堵", "刮擦", "翻车", "碰撞", "失火", "碾压", "其他"])
const ruleFormRef = ref()
const rules = reactive({
  type: [{ required: true, message: "请选择事件类型", trigger: "blur" }],
  address: [{ required: true, message: "事件地址不能为空", trigger: "blur" }],
  date: [{ required: true, message: "请选择时间", trigger: "blur" }],
})
let props = defineProps({
  roadDialog: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(["toggle"])
const handleEmit = (FormInstance) => {
  emit("toggle")
  FormInstance.resetFields()
  roadStatus.mark = ""
  roadStatus.describe = ""
}

watchEffect(() => {
  centerDialogVisible.value = props.roadDialog
  // 格式化时间
  roadStatus.date = moment(new Date()).format("YYYY/MM/DD HH:mm:ss")
})
const handleConfirm = (FormInstance) => {
  if (!FormInstance) return
  FormInstance.validate(async (valid, fields) => {
    if (valid) {
      let { data } = await reportRoad({ id: store.id, ...roadStatus })
      if (data.code == 0) {
        ElMessage({
          message: data.msg,
          type: "success",
          offset: 70,
          duration: 1600,
        })
        // 子传父,关闭弹框
        emit("toggle")
        FormInstance.resetFields()
        roadStatus.mark = ""
        roadStatus.describe = ""
      }
    } else {
      // console.log("error")
      ElMessage({
        message: "信息不能为空，请重新填写",
        type: "warning",
        offset: 70,
        duration: 1600,
      })
    }
  })
}
</script>
<style scoped>
.Road-container :deep(.el-dialog) {
  user-select: none;
}

.Road-container :deep(.el-form-item__content) .el-input,
.el-textarea {
  width: 275px;
}
</style>
