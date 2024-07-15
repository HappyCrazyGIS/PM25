import { createRouter, createWebHistory } from "vue-router"
import { ElMessage } from "element-plus"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login/index.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/Home/Home.vue"),

    },
    {
      path: "/health",
      name: "health",
      component:()=>import("../views/Home/child/3dcity.vue")
    },
    {
      path: "/user-management",
      name: "user-management",
      component: () => import("../views/UserManagement/UserManagement.vue"),
    },
    {
      path: "/not-found",
      name: "notFound",
      component: () => import("../views/NotFound.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      redirect: "/not-found",
    },
  ],
})

//全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 实时获取 token
  if (localStorage.getItem("tokenStore")) {
    var { token } = JSON.parse(localStorage.getItem("tokenStore"))
  }
  if (token) {
    if (to.path == "/login") {
      next("/home")
    } else {
      next()
    }
  } else {
    if (to.path == "/login") {
      next()
    } else {
      ElMessage({
        message: "请先登录！",
        type: "error",
        duration: 2000,
      })
      next("/login")
    }
  }
})

export default router
