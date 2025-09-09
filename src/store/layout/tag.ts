import type { RouteLocationNormalized } from 'vue-router'
import router from '@/router'

export class ITag {
    title = ''
    path = ''
    isActive = false
    /** 点击顺序 */
    sn = 1
}
/** 当前标签页最大sn */
const maxSn = ref(1)
/** 标签页 */
export const useTag = () => {
    const defaultTag = (isActive = true) => ({ title: '首页', path: '/', isActive, sn: maxSn.value++ })
    const tagList = ref([defaultTag()])
    const cacheView = ref<string[]>([])
    /** 设置标签 */
    const setTag = async(cRouter:RouteLocationNormalized) => {
        const title = cRouter.meta?.menuName as string
        if(!title) return
        // 是否缓存页面
        if(typeof cRouter.fullPath === 'string' && !cacheView.value.includes(cRouter.fullPath)) {
            cacheView.value.push(cRouter.fullPath)
        }
        // 判断页面是否打开过
        tagList.value.forEach(v => v.isActive = false)
        const index = tagList.value.findIndex(v => v.path === cRouter.fullPath)
        if(index !== -1) {
            tagList.value[index].isActive = true
            tagList.value[index].sn = maxSn.value++
            return
        }
        const tagsList:ITag = {
            title,
            path: cRouter.fullPath,
            isActive: true,
            sn: maxSn.value++
        }
        tagList.value.push(tagsList)
    }
    /** 关闭当前标签 */
    const closeTag = (path: string) => {
        if(tagList.value.length <= 1) return
        const index = tagList.value.findIndex(v => v.path === path)
        tagList.value.splice(index, 1)
        resetCacheView()
        // 如果关闭的不是当前显示的tags，则不跳转
        if(router.currentRoute.value.fullPath === tagList.value.find(v => v.isActive)?.path) return
        router.replace({ path: tagList.value[index === 0 ? 0 : (index - 1)].path })
    }
    /** 重置缓存数据 */
    const resetCacheView = () => {
        const currentTagsPath = tagList.value.map(v => v.path)
        for (let i = 0; i < cacheView.value.length; i++) {
            const element = cacheView.value[i]
            if(!currentTagsPath.includes(element)) {
                cacheView.value.splice(i, 1)
                i--
            }
        }
    }
    /** 关闭所有标签 */
    const closeAllTag = () => {
        tagList.value.splice(0, tagList.value.length, defaultTag())
        resetCacheView()
        router.replace({ path: epsPathRoot })
    }
    /** 关闭其他标签 */
    const closeOtherTag = (path?: string) => {
        if(!path) return
        if(path === epsPathRoot) {
            closeAllTag()
            return
        }
        const currentTag = tagList.value.find(v => v.path === path)
        if(!currentTag) return
        tagList.value.splice(0, tagList.value.length, defaultTag(false), currentTag)
        router.replace({ path })
        resetCacheView()
    }
    /** 刷新页面 */
    const refresh = () => {
        const { fullPath } = router.currentRoute.value
        router.replace(`${epsPathRedirect}${fullPath}`)
        /** 删除当前页面缓存数据 */
        const index = cacheView.value.findIndex(v => v === fullPath)
        if(index < 0) return
        cacheView.value.splice(index, 1)
    }

    return { tagList, setTag, cacheView, closeTag, refresh, closeAllTag, closeOtherTag }
}