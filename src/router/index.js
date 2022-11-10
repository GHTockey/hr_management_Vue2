import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import approvalsRouter from '@/router/modules/approvals'
import departmentsRouter from '@/router/modules/departments'
import employeesRouter from '@/router/modules/employees'
import permissionRouter from '@/router/modules/permission'
import attendancesRouter from '@/router/modules/attendances'
import salarysRouter from '@/router/modules/salarys'
import settingRouter from '@/router/modules/setting'
import socialRouter from '@/router/modules/social'
import userRouter from "@/router/modules/user";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为 true，则项目将不会显示在侧边栏中（默认值为 false）
 * alwaysShow: true               如果设置为 true，将始终显示根菜单
 *                                如果未设置始终显示，当项目有多个子路由时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置了no重定向，则不会在痕迹导航中重定向
 * name:'router-name'             名称由<keep-alive>（必须设置!!!）使用）
 * meta : {
    roles: ['admin','editor']    控制页面角色（您可以设置多个角色）
    title: 'title'               名称显示在侧边栏和面包屑中（推荐套装）
    icon: 'svg-name'/'el-icon-x' 图标显示在边栏中
    breadcrumb: false            如果设置为 false，则项目将隐藏在痕迹导航中（默认值为 true）
    activeMenu: '/example/list'  如果设置了路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * 常量路由
 * 没有权限要求的基页
 * 可以访问所有角色
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/import',
    // hidden: true,
    component:Layout,
    children: [
      { path: '', component: () => import('@/views/import'), }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  userRouter,

  // 404 页必须放在末尾 !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 动态路由
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务支持
  base: '/hr',
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
