
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

class IConfig {
    listBranch: string[] = []
    publicPackage: string[] = []
}

export const useStoreLayout2 = () => {
    const { width } = useWindowSize()
    const isCollapsed = ref(width.value < 450)
    const menuStatus = computed<IMenuStatusType>(() => (
        width.value > 450 
            ? isCollapsed.value ? IMenuStatus.PCN : IMenuStatus.PCE
            : isCollapsed.value ? IMenuStatus.PHN : IMenuStatus.PHE
    ))
    const isLoading = ref(false)

    const updateCollapsed = () => isCollapsed.value = !isCollapsed.value

    const config = ref(new IConfig())
    const getConfig = async() => {
        const { config: configs, configPath } = await window.electronAPI.invoke('getConfig')
        console.log(`配置文件路径：${configPath}`)
        config.value = configs
    }
    getConfig()

    return {
        width,
        isCollapsed,
        menuStatus,
        isLoading,
        updateCollapsed,
        config
    }
}