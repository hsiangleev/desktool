
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