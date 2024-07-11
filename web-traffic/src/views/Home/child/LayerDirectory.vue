<template>
  <transition
    name="fade"
    enter-active-class="animated animate__bounceInRight"
    leave-active-class="animated animate__backOutRight"
  >
    <div v-show="isShow" class="directory-container">
      <el-tree
        ref="tree"
        node-key="LayerIndex"
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="['01', '001', 0, 1, 2, 3, 4]"
        @check="change"
      >
        <template #default="{ node, data }">
          <i :class="['iconfont', data.icon]"></i>
          <span>{{ node.label }}</span>
        </template>
      </el-tree>
    </div>
  </transition>
  <div class="icon">
    <i
      v-show="!isShow"
      class="iconfont icon-zuojiantou"
      @click="isShow = true"
    ></i>
    <i
      v-show="isShow"
      class="iconfont icon-youjiantou"
      @click="isShow = false"
    ></i>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { nextTick } from "vue"
import { useMap } from "../../../stores/useMap"
const store = useMap()
let isShow = ref(false)
let data = ref([])
const tree = ref()
const defaultProps = ref({
  children: "children",
  label: "label",
})
let count = ref(0)
let length = ref(7)
// 复选框
const change = (data, val) => {
  const str = val.checkedKeys.toString()
  if (str) {
    if (val.checkedKeys.length == 7) {
      count.value = 0
      // layers[2].setVisible(true)
      store.ggMap.setLayerStatus("0,1,2,3,4", "include")
      // store.ggMap.refresh()
      length.value = val.checkedKeys.length
      return
    }
    // if (count.value == 0) {
    // console.log("删除")
    if (val.checkedKeys.length < length.value) {
      console.log(11)
      store.ggMap.setLayerStatus(data.LayerIndex, "exclude")
      store.ggMap.refresh()
    } else {
      console.log(22)
      store.ggMap.setLayerStatus(data.LayerIndex, "include")
      store.ggMap.refresh()
    }
    // } else {
    // console.log("添加")
    // store.ggMap.setLayerStatus(data.LayerIndex, "include")
    // }
  } else {
    // count.value = 1
    store.ggMap.setLayerStatus("0,1,2,3,4", "exclude")
    // layers[2].setVisible(false)
  }
  length.value = val.checkedKeys.length
}
nextTick(() => {
  // 获取地图文档信息
  var mapService = new Zondy.Service.GetMapInfoService({
    ip: "localhost",
    port: "6163",
    mapName: "guanggu",
  })
  mapService.GetMapInfo(getMapInfoSuccess)
  const arr = [
    {
      label: "地图文档",
      disabled: true,
      icon: "icon-map",
      LayerIndex: "01",
      children: [
        {
          label: "",
          children: [],
          icon: "icon-tucengshunxu",
          LayerIndex: "001",
        },
      ],
    },
  ]
  function getMapInfoSuccess(res) {
    if (res != null) {
      arr[0].children[0].label = res.name
    }
  }

  //   获取该地图文档下所有图层信息
  var docCatalog = new Zondy.Catalog.MapDoc({
    ip: "localhost",
    port: "6163",
    docName: "guanggu",
    mapIndex: 0,
  })
  //调用getLayersInfo函数，获取地图文档中所有图层相关信息，在回调函数中处理结果
  docCatalog.getLayersInfo(getListSuccess)

  function getListSuccess(res) {
    if (res.succeed) {
      if (res == null) {
        alert("没有获取到矢量地图文档！")
        return
      } else {
        // console.log(res)
        res.value.forEach((item) => {
          if (item.GeomType == "Reg") {
            const icon = "icon-quyu"
            addLayerItem(item.Name, item.LayerIndex, icon)
          } else if (item.GeomType == "Lin") {
            const icon = "icon-xianlu-xian"
            addLayerItem(item.Name, item.LayerIndex, icon)
          } else if (item.GeomType == "Pnt") {
            const icon = "icon-dian"
            addLayerItem(item.Name, item.LayerIndex, icon)
          }
        })
        data.value = arr
      }
    } else {
      alert("获取到矢量地图文档失败！")
      return
    }
  }
  const addLayerItem = (name, lid, icon) => {
    let obj = {}
    // console.log(item)
    obj.label = name
    obj.LayerIndex = lid
    obj.icon = icon
    // console.log(obj)
    arr[0].children[0].children.push(obj)
  }
})
</script>
<style scoped>
.directory-container {
  position: fixed;
  top: 28%;
  right: 5%;
  width: 200px;
  padding: 10px;
  /* height: 300px; */
  border-radius: 8px;
  background: rgba(7, 24, 46, 0.8);
}
.directory-container:deep(.el-tree) {
  margin-top: 10px;
  margin-bottom: 10px;
  background: rgba(7, 24, 46, 0);
  color: #fff;
}
.el-tree:deep(.el-tree-node__label) {
  font-size: 15px;
}
.directory-container:deep(.el-tree .iconfont) {
  color: #f08a5d;
  font-size: 16px;
  margin-right: 6px;
}
.el-tree:deep(.el-tree-node__content):hover {
  background: rgba(7, 24, 46, 0) !important;
}
.el-tree :deep(.el-tree-node.is-current) > .el-tree-node__content {
  background-color: transparent !important;
}
.icon {
  position: fixed;
  top: 15%;
  right: 5px;
  background: rgba(0, 60, 136, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.icon .iconfont {
  font-size: 25px;
  color: #fff;
}
.icon:hover .iconfont {
  color: rgba(0, 60, 136, 1);
}
</style>
