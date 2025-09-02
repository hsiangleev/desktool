
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import constantRoutes from './modules/const'

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes as RouteRecordRaw[],
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router