import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import qs from 'qs'
// 创建 axios 实例
export const request:AxiosInstance = axios.create({
    // API 请求的默认前缀
    // baseURL: import.meta.env?.VITE_APP_BASE_API || '/prod-api',
    paramsSerializer: params => qs.stringify(params, { indices: false }),
    timeout: 180000 // 请求超时时间
})

let loading:{close():void}
// 异常拦截处理器
const errorHandler = (error:any) => {
    loading.close()
    console.log(`err${error}`)
    epsLayerNotice('请求失败', error.msg, 'error')
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    loading = epsLayerLoading()
    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response:AxiosResponse<any>) => {
    loading.close()
    return response
}, errorHandler)