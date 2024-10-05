<template>
  <el-button dark active-text-color="#ffd04b" background-color="#545c64" style="width: 64px" @click="isCollapse = !isCollapse">
    <el-icon v-if="isCollapse"><DArrowLeft /></el-icon>
    <el-icon v-else><DArrowRight /></el-icon>
  </el-button>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :collapse = isCollapse
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon @click="addData"><List/></el-icon>
        <span>数据列表</span>
      </template>
        <el-menu-item >
          <el-icon><DocumentAdd/></el-icon>
          <span @click="addData">添加数据</span>
        </el-menu-item>
        <el-menu-item index="1-1">PM2.5数据</el-menu-item>
        <el-menu-item index="1-2">tif数据</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><Loading /></el-icon>
      <span >PM2.5模拟</span>
    </el-menu-item>
    <el-menu-item index="3" @click="handleClick">
      <el-icon><Position /></el-icon>
      <span>路径规划</span>
    </el-menu-item>
  </el-menu>
  <el-form class="dataUploadFormStyle" v-if="dataUploadBar">
    <div id="dataUploadButtonDiv">
      <el-button @click="submitData">提交</el-button>
      <el-button>取消</el-button>
    </div>
    <div>
      <el-upload
        class="upload-demo"
        :file-list="fileList"
        :on-change="handelChange"
        drag
        multiple
        :auto-upload="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            geo files(zip/tiff) with a size less than 100mb
          </div>
        </template>
      </el-upload>
    </div>

  </el-form>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  DArrowRight,
  DArrowLeft,CirclePlusFilled,Loading,Position
} from '@element-plus/icons-vue'
const isCollapse = ref(false)
const showRouteBar = ref(false)
//定义一个文件列表，upload组件中的文件列表
const fileList = ref([])

// 定义一个emit事件，在父组件中监听该事件
const emit = defineEmits(['updateParentData']);
function handleClick() {
  // 发射事件，并可选地传递数据给父组件
  showRouteBar.value = !showRouteBar.value;

  emit('updateParentData', showRouteBar.value);
}
//发是否显示dataUploadBar,默认不显示
const dataUploadBar = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

//添加数据函数
const addData = () => {
  // 出现一个表单收集数据
  dataUploadBar.value = !dataUploadBar.value
}
const submitData = () => {
  // 提交数据
  console.log('submit data')
  console.log()
}

//上传文件组件中的文件发生变化时触发
const handelChange = (file, newFileList) => {
  // console.log(file); // 打印当前操作的文件对象
  fileList.value = [...newFileList]; // 更新组件的 fileList ref
  // 打印所有上传文件的文件名
}

</script>


<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 400px; */
}
.dataUploadFormStyle{
  left:220px;
  top:75px;
  width:400px;
  height:350px;
  background-color: #ffffff;
  display:block;
  position:absolute;

  .upload-demo{
    margin:0px 50px 25px 50px;
    width: 300px;
    height:200px
  }

  #dataUploadButtonDiv{
    background-color: rgb(255, 255, 255);
    margin:10px;
    padding:0px 120px 0px 120px;
    display:flex;
    justify-content:space-evenly;
  }
}

</style>