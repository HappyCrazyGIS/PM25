<template>
  <el-table
    :data="eventData"
    stripe
    style="width: 100%; user-select: none; margin-top: 15px"
    fit
    border
    :height="height ? height : 300"
    :header-cell-style="{
      background: '#F5F7FA',
      color: '#909399',
      height: '60px',
    }"
  >
    <el-table-column align="center" prop="FID" label="序号" width="70" />
    <el-table-column
      align="center"
      prop="AttValue[0]"
      label="事件编号"
      width="180"
    />
    <el-table-column align="center" prop="AttValue[1]" label="事件类型" />
    <el-table-column align="center" prop="AttValue[2]" label="事件等级" />
    <el-table-column
      sortable
      align="center"
      prop="AttValue[3]"
      label="发生时间"
      width="180"
    />
    <el-table-column
      align="center"
      prop="AttValue[4]"
      label="发生地点"
      width="180"
    />
    <el-table-column align="center" prop="AttValue[5]" label="车牌号" />
    <el-table-column align="center" prop="AttValue[6]" label="驾驶员" />
    <el-table-column align="center" label="操作" width="120">
      <template #default="scope">
        <el-select
          v-model="scope.row.AttValue[7]"
          class="m-2"
          placeholder="Select"
          @change="handleChange(scope.row)"
          :disabled="isDisable"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { ref } from "vue"
import { updatePoint } from "../../../map/lib/updatePoint"
const options = ref([
  { id: 1, name: "待处理" },
  { id: 1, name: "已归档" },
  { id: 1, name: "已忽略" },
])
let props = defineProps({
  eventData: {
    type: Array,
    required: true,
  },
  isDisable: {
    type: Boolean,
  },
  height: {
    type: Number,
  },
})
// 修改审核状态
const handleChange = (row) => {
  // console.log(val)
  let service = {
    name: "guanggu",
    layerId: 2,
  }
  let type = "0"
  Query.queryByFID({
    fid: row.FID,
    service,
    callback: (res) => {
      // console.log(res)
      if (row.AttValue[7] == "待处理") {
        updatePoint({ service, res, type })
      } else if (row.AttValue[7] == "已处理") {
        type = "1"
        updatePoint({ service, res, type })
      } else {
        type = "2"
        updatePoint({ service, res, type })
      }
    },
  })
}
</script>
<style scoped></style>
