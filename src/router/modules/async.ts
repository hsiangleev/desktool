
export const epsGenerateViews = (modules: Record<string, () => Promise<unknown>>, matchReg: RegExp) => {
    Object.keys(modules).forEach(key => {
        const nameMatch = key.match(matchReg)
        if(!nameMatch) return
        const [,name] = nameMatch
        routerMenu[name] = modules[key]
    })
}

// 动态路由名称映射表(排除以下划线开头的文件文件夹下的文件)
export const routerMenu = reactive<IObject<IComponent>>({
    layout: () => import('@/layout/index.vue'),
    redirect: () => import('@/layout/redirect.vue')
})

epsGenerateViews(import.meta.glob(['../../views/**/**.vue', '!**/_*/**']), /^\.\.\/\.\.\/views\/(.+)\.vue/)
