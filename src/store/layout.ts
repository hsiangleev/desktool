import type { RouteLocationNormalized } from 'vue-router'
import router from '@/router'

export const useStoreLayout2 = () => {
    const { width, isCollapsed, menuStatus, updateCollapsed } = useMenu()
    const config = useConfig()
    const { tagList, setTag, cacheView, closeTag, removeTag } = useTag()

    return {
        width, isCollapsed, menuStatus, updateCollapsed,
        config,
        tagList, setTag, cacheView, closeTag, removeTag
    }
}

export const IMenuStatus = {
    /** 电脑展开 */
    PCE: 'PCE',
    /** 电脑合并 */
    PCN: 'PCN',
    /** 平板展开 */
    PHE: 'PHE',
    /** 平板合并 */
    PHN: 'PHN'
} as const satisfies Record<string, string>

type IMenuStatusType = typeof IMenuStatus[keyof typeof IMenuStatus];
const useMenu = () => {
    const { width } = useWindowSize()
    const isCollapsed = ref(width.value < 450)
    const menuStatus = computed<IMenuStatusType>(() => (
        width.value > 450 
            ? isCollapsed.value ? IMenuStatus.PCN : IMenuStatus.PCE
            : isCollapsed.value ? IMenuStatus.PHN : IMenuStatus.PHE
    ))
    const updateCollapsed = () => isCollapsed.value = !isCollapsed.value

    return { width, isCollapsed, menuStatus, updateCollapsed }
}

class IConfig {
    listBranch: string[] = []
    publicPackage: string[] = []
}
const useConfig = () => {
    /** 获取配置文件信息 */
    const config = ref(new IConfig())
    const getConfig = async() => {
        const { config: configs, configPath } = await window.electronAPI.invoke('getConfig')
        console.log(`配置文件路径：${configPath}`)
        config.value = configs
    }
    getConfig()
    return config
}

class ITag {
    title = ''
    path = ''
    isActive = false
    /** 点击顺序 */
    sn = 1
}
/** 当前标签页最大sn */
const maxSn = ref(1)
/** 标签页 */
const useTag = () => {
    const tagList = ref([
        { title: '首页', path: '/', isActive: true, sn: maxSn.value++ }
    ])
    const cacheView = ref<string[]>([])
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
    const closeTag = (path: string) => {
        if(tagList.value.length <= 1) return
        const index = tagList.value.findIndex(v => v.path === path)
        tagList.value.splice(index, 1)
        
        const currentTagsPath = tagList.value.map(v => v.path)
        cacheView.value = cacheView.value.filter(v => currentTagsPath.includes(v))

        // 如果关闭的不是当前显示的tags，则不跳转
        if(router.currentRoute.value.fullPath === tagList.value.find(v => v.isActive)?.path) return
        router.replace({ path: tagList.value[index === 0 ? 0 : (index - 1)].path })
    }
    const removeTag = (fromPath: string) => {
        const index = cacheView.value.findIndex(v => v === fromPath)
        if(index < 0) return
        cacheView.value.splice(index, 1)
    }

    return { tagList, setTag, cacheView, closeTag, removeTag }
}