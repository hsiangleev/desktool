
class IConfig {
    listBranch: string[] = []
    publicPackage: string[] = []
}
export const useConfig = () => {
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