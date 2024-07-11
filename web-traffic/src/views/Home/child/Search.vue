<template>
  <div class="container">
    <el-dialog
      v-model="dialogVisible"
      width="72%"
      align-center
      append-to-body
      @close="handleClose"
      draggable
    >
      <EventTable
        :eventData="eventList"
        :isDisable="disable"
        :height="370"
      ></EventTable>
      <div class="demo-pagination-block" style="margin-top: 30px">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[2, 5, 10, 20]"
          background
          layout="total, sizes,prev, pager, next,  jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          hide-on-single-page
        />
      </div>
    </el-dialog>
    <el-select
      v-model="category"
      v-if="tokenStore.type == 'traffic' || tokenStore.type == 'admin'"
    >
      <el-option label="事件类型" value="事件类型" />
      <el-option label="事件等级" value="事件等级" />
      <el-option label="发生地点" value="发生地点" />
      <el-option label="处理状态" value="处理状态" />
    </el-select>
    <div class="form">
      <button>
        <svg
          width="17"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search"
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            stroke-width="1.333"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <input
        class="input"
        placeholder="请输入事件类型"
        type="text"
        v-model.trim="content"
        @keyup.enter="handelEnter"
      />
      <button class="reset" type="reset">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup>
import EventTable from "../../../components/event/child/EventTable.vue"
import { ElMessage } from "element-plus"
import { format } from "../../../components/Hooks/format"
import { ref } from "vue"
import { useToken } from "../../../stores/useToken"
const tokenStore = useToken()
// 存放表格数据
let eventList = ref([])
// 分页数据
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
// 搜索框内容
let content = ref("")
// 分类选择
let category = ref("")
// 控制弹框显隐
let dialogVisible = ref(false)
//是否禁用,身份判断
let disable = ref(true)
// 回车事件回调函数
let service = {
  name: "guanggu",
  layerId: 2,
}
const handelEnter = () => {
  if (content.value == "") {
    ElMessage({
      message: "事件类型不能为空",
      type: "error",
      offset: 70,
      duration: 1400,
    })
    return
  }
  getEventList()
}
// 获取数据
const getEventList = () => {
  let where = ""
  if (category.value == "事件类型" || category.value == "发生地点") {
    where = `${category.value}='${content.value}'`
  } else if (category.value == "事件等级" || category.value == "处理状态") {
    where = `${category.value}=${content.value}`
  } else {
    where = `事件类型='${content.value}'`
  }
  // console.log(where)
  Query.queryByAttr({
    size: pageSize.value,
    page: currentPage.value - 1,
    where,
    service,
    callback: (res) => {
      // console.log(res)
      if (res.SFEleArray.length == 0) {
        ElMessage({
          message: "查询结果为空,请重新蔡查询",
          type: "warning",
          offset: 70,
          duration: 1400,
        })
      } else {
        const result = format(res)
        eventList.value = result.SFEleArray
        total.value = res.TotalCount
        dialogVisible.value = true
      }
    },
  })
}
// 关闭弹窗回调
const handleClose = () => {
  content.value = ""
}
// 条数改变回调
const handleSizeChange = (size) => {
  pageSize.value = size
  getEventList()
}
// 页码改变回调
const handleCurrentChange = (page) => {
  currentPage.value = page
  getEventList()
}
</script>
<style scoped>
.container {
  margin-top: 13px;
}
.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}
/* styling of whole input container */
.form {
  --timing: 0.3s;
  --width-of-input: 200px;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #fff;
  --border-color: #2f2ee9;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}
/* styling of Input */
.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}
/* styling of animated border */
.form:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}
/* Hover on Input */
.form:focus-within {
  border-radius: var(--after-border-radius);
}

input:focus {
  outline: none;
}
/* here is code of animated border */
.form:focus-within:before {
  transform: scale(1);
}
/* styling of close button */
/* == you can click the close button to remove text == */
.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}
/* close button shown when typing */
input:not(:placeholder-shown) ~ .reset {
  opacity: 1;
  visibility: visible;
}
/* sizing svg icons */
.form svg {
  width: 17px;
  margin-top: 3px;
}
.el-select {
  width: 128px;
  margin-left: 20px;
  margin-right: 10px;
}
.el-select:deep(.el-input.el-input--suffix) {
  height: 41px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
