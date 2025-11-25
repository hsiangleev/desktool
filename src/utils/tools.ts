
/**
 * 睡眠函数
 * @param time 
 */
export async function epsSleep(time:number, isLoading = false):Promise<void> {
    let loading:any
    if(isLoading) {
        loading = await epsLayerLoading()
    }
    await new Promise(resolve => {
        setTimeout(() => {
            isLoading && loading.close()
            resolve('')
        }, time)
    })
}

/**
 * 文件大小转换
 * @param fileSize 文件大小
 * @param decimal 小数位数
 * @returns 
 */
export const epsCountFileSize = (fileSize = 0, decimal = 2) => {
    let i = 0
    while(fileSize >= 1024) {
        fileSize = fileSize / 1024
        i++
    }
    const sizeList = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
    return `${i === 0 ? fileSize.toFixed(0) : fileSize.toFixed(decimal)}${sizeList[i]}`
}