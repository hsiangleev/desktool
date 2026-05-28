/**
 * 系统信息缓存管理器
 * - 静态数据：长时间缓存（如 CPU、内存布局等硬件信息）
 * - 动态数据：短时间缓存（如 CPU 负载、内存使用等）
 */

interface CacheItem<T> {
    data: T
    timestamp: number
}

class SystemCache {
    private cache = new Map<string, CacheItem<any>>()
    
    // 缓存过期时间（毫秒）
    private static TTL = {
        // 静态数据：5 分钟
        static: 5 * 60 * 1000,
        // 动态数据：2 秒
        dynamic: 2 * 1000
    }

    // 静态数据 key 列表
    private static STATIC_KEYS = [
        'system', 'cpu', 'memLayout', 'diskLayout', 
        'graphics', 'osInfo', 'networkInterfaces', 'ip'
    ]

    /**
     * 获取缓存数据
     * @param key 缓存 key
     * @param fetcher 数据获取函数
     * @returns 数据
     */
    async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        const cached = this.cache.get(key)
        const ttl = SystemCache.STATIC_KEYS.includes(key) 
            ? SystemCache.TTL.static 
            : SystemCache.TTL.dynamic

        // 缓存有效，直接返回
        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.data
        }

        // 缓存过期或不存在，重新获取
        const data = await fetcher()
        this.cache.set(key, { data, timestamp: Date.now() })
        return data
    }

    /**
     * 清除指定 key 的缓存
     */
    clear(key?: string) {
        if (key) {
            this.cache.delete(key)
        } else {
            this.cache.clear()
        }
    }

    /**
     * 强制刷新指定 key 的缓存
     */
    async refresh<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        this.cache.delete(key)
        return this.get(key, fetcher)
    }
}

// �出单例
export const systemCache = new SystemCache()
