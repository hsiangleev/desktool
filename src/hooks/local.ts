
export interface ILocalStore {
    startTime: number
    expires: number
    [propName: string]: any
}
/** localstore操作 */
export function epsLocal() {

    /**
     * 获取localStorage对象并转成对应的类型
     * @param name localStorage设置名称
     */
    const getLocal = function <T>(name:string):T|null {
        const l = localStorage.getItem(name)
        if(l === null) return l
        let local = l
        try {
            local = JSON.parse(l)
        } catch {
            
        }
        return local as unknown as T
    }
    /**
     * localStorage设置有效期
     * @param name localStorage设置名称
     * @param data 数据对象
     * @param pExpires 有效期(不传则不设置)
     */
    const setLocal = function(name:string, data:IObject<any>, pExpires?: number):void {
        const d = data as ILocalStore
        if(typeof pExpires === 'number') {
            d.startTime = Date.now()
            d.expires = pExpires
        }
        localStorage.setItem(name, JSON.stringify(data))
    }
    /**
     * 移除localStorage对象
     * @param name localStorage设置名称
     */
    const removeLocal = function(name:string) {
        localStorage.removeItem(name)
    }
    /**
     * 判断localStorage有效期是否失效
     * @param name localStorage设置名称
     */
    const validateLocal = function<T>(name: string):T|null {
        const local = getLocal<ILocalStore>(name)
        if(local === null) {
            epsLogWarn(`store没有保存${name}`)
            return local
        }
        if(typeof local.startTime === 'number' && typeof local.expires === 'number' && (local.startTime + local.expires < Date.now())) {
            epsLogWarn(`${name}已超过有效期`)
            return null
        }
        return local as unknown as T
    }

    return {
        getLocal,
        setLocal,
        removeLocal,
        validateLocal
    }
}

/** sessionstore操作 */
export function epsSession() {

    /**
     * 获取sessionStorage对象并转成对应的类型
     * @param name sessionStorage设置名称
     */
    const getSession = function <T>(name:string):T|null {
        const l = sessionStorage.getItem(name)
        if(l === null) return l
        let local = l
        try {
            local = JSON.parse(l)
        } catch {
            
        }
        return local as unknown as T
    }
    /**
     * sessionStorage设置有效期
     * @param name sessionStorage设置名称
     * @param data 数据对象
     * @param pExpires 有效期(不传则不设置)
     */
    const setSession = function(name:string, data:IObject<any>, pExpires?: number):void {
        const d = data as ILocalStore
        if(typeof pExpires === 'number') {
            d.startTime = Date.now()
            d.expires = pExpires
        }
        sessionStorage.setItem(name, JSON.stringify(data))
    }
    /**
     * 移除sessionStorage对象
     * @param name sessionStorage设置名称
     */
    const removeSession = function(name:string) {
        sessionStorage.removeItem(name)
    }

    return {
        getSession,
        setSession,
        removeSession
    }
}