<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleHeaderSelect"
        >
          <img
            style="width: 235px; height: 60px"
            src="/images/home-logo.png"
            alt=""
          />
          <div class="flex-grow" />
          <el-menu-item index="1">
            <el-icon><House /></el-icon>主页</el-menu-item
          >
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="common"
            text-color="#fff"
            @select="handleAsideSelect"
            style="height: calc(100vh - 60px)"
          >
            <el-menu-item index="common">
              <el-icon><User /></el-icon>
              <span>普通用户管理</span>
            </el-menu-item>
            <el-menu-item index="traffic">
              <el-icon><Stamp /></el-icon>
              <span>交管用户管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <UserInfoTable :flag="asideFlag"></UserInfoTable>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { User, Stamp } from "@element-plus/icons-vue"
import UserInfoTable from "./Child/UserInfoTable.vue"

let router = useRouter()
let asideFlag = ref("common")
//导航栏选择事件
const handleHeaderSelect = (index) => {
  if (index === "1") {
    router.back()
  }
}
//侧边栏选择事件
const handleAsideSelect = (index) => {
  asideFlag.value = index
}
</script>
<style scoped>
.flex-grow {
  flex-grow: 1;
}
.el-header {
  padding: 0;
}
</style>
