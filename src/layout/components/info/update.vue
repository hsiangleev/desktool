<template>
    <div v-if='updateStatus !== "idle"' class='cursor-pointer'>
        <el-popover
            placement='bottom'
            :width='320'
            trigger='click'
        >
            <template #reference>
                <el-badge :is-dot='updateStatus === "available"' :hidden='updateStatus !== "available"'>
                    <eps-icon 
                        class='layout-header-left-icon' 
                        :type='statusIcon' 
                        :class='{ "is-loading": updateStatus === "checking" || updateStatus === "downloading" }'
                        title='检查更新' 
                        color='#409EFF'
                        @click='checkUpdate' 
                    />
                </el-badge>
            </template>
            
            <div class='update-content'>
                <!-- 检查中 -->
                <div v-if='updateStatus === "checking"' class='py-4 text-center'>
                    <eps-icon :size='24' type='ep:loading' class='is-loading' />
                    <p class='mt-2 text-gray-500'>正在检查更新...</p>
                </div>
                
                <!-- 有新版本 -->
                <div v-else-if='updateStatus === "available"'>
                    <div class='mb-3 flex items-center'>
                        <eps-icon :size='20' type='ep:circle-check' color='#67C23A' class='mr-2' />
                        <span class='font-bold'>发现新版本 v{{ updateInfo.version }}</span>
                    </div>
                    <p class='mb-3 text-sm text-gray-500'>
                        发布时间：{{ formatDate(updateInfo.releaseDate) }}
                    </p>
                    <div v-if='updateInfo.releaseNotes' class='release-notes mb-3'>
                        <p class='mb-1 text-sm font-medium'>更新内容：</p>
                        <div class='max-h-32 overflow-y-auto text-sm text-gray-600' v-html='updateInfo.releaseNotes' />
                    </div>
                    <div class='flex justify-end gap-2'>
                        <el-button size='small' @click='openReleasePage'>查看详情</el-button>
                        <el-button size='small' type='primary' @click='downloadUpdate'>
                            下载更新
                        </el-button>
                    </div>
                </div>
                
                <!-- 没有新版本 -->
                <div v-else-if='updateStatus === "not-available"' class='py-4 text-center'>
                    <eps-icon :size='24' type='ep:circle-check' color='#67C23A' />
                    <p class='mt-2 text-gray-500'>当前已是最新版本</p>
                    <p class='text-sm text-gray-400'>v{{ currentVersion }}</p>
                </div>
                
                <!-- 下载中 -->
                <div v-else-if='updateStatus === "downloading"'>
                    <div class='mb-3 flex items-center'>
                        <eps-icon :size='20' type='ep:loading' color='#409EFF' class='is-loading mr-2' />
                        <span class='font-bold'>正在下载更新...</span>
                    </div>
                    <el-progress 
                        :percentage='downloadProgress.percent' 
                        :format='formatProgress'
                        :stroke-width='10'
                    />
                    <p class='mt-2 text-sm text-gray-500'>
                        {{ formatSpeed(downloadProgress.bytesPerSecond) }}
                    </p>
                </div>
                
                <!-- 下载完成 -->
                <div v-else-if='updateStatus === "downloaded"'>
                    <div class='mb-3 flex items-center'>
                        <eps-icon :size='20' type='ep:circle-check' color='#67C23A' class='mr-2' />
                        <span class='font-bold'>下载完成</span>
                    </div>
                    <p class='mb-3 text-sm text-gray-500'>
                        新版本 v{{ updateInfo.version }} 已下载完成，是否立即安装？
                    </p>
                    <div class='flex justify-end'>
                        <el-button size='small' type='primary' @click='installUpdate'>
                            立即安装并重启
                        </el-button>
                    </div>
                </div>
                
                <!-- 错误 -->
                <div v-else-if='updateStatus === "error"' class='py-4 text-center'>
                    <eps-icon :size='24' type='ep:circle-close' color='#F56C6C' />
                    <p class='mt-2 text-red-500'>检查更新失败</p>
                    <p class='text-sm text-gray-500'>{{ errorMessage }}</p>
                    <el-button class='mt-3' size='small' @click='checkUpdate'>重试</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
type UpdateStatus = 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'

const updateStatus = ref<UpdateStatus>('idle')
const currentVersion = ref('')
const updateInfo = ref({
    version: '',
    releaseDate: '',
    releaseNotes: ''
})
const downloadProgress = ref({
    percent: 0,
    bytesPerSecond: 0,
    transferred: 0,
    total: 0
})
const errorMessage = ref('')

// 状态图标
const statusIcon = computed(() => {
    switch (updateStatus.value) {
    case 'checking':
    case 'downloading':
        return 'ep:loading'
    case 'available':
        return 'ep:notification'
    case 'not-available':
        return 'ep:circle-check'
    case 'downloaded':
        return 'ep:download'
    case 'error':
        return 'ep:warning'
    default:
        return 'ep:refresh'
    }
})

// 检查更新
const checkUpdate = async() => {
    updateStatus.value = 'checking'
    try {
        const result = await window.electronAPI.invoke('checkUpdate')
        if (result.hasUpdate) {
            updateStatus.value = 'available'
            updateInfo.value = {
                version: result.version,
                releaseDate: result.releaseDate,
                releaseNotes: result.releaseNotes
            }
        } else if (result.error) {
            updateStatus.value = 'error'
            errorMessage.value = result.error
        } else {
            updateStatus.value = 'not-available'
        }
    } catch (error: any) {
        updateStatus.value = 'error'
        errorMessage.value = error.message
    }
}

// 下载更新
const downloadUpdate = async() => {
    updateStatus.value = 'downloading'
    downloadProgress.value = { percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 }
    try {
        const result = await window.electronAPI.invoke('downloadUpdate')
        if (!result.success) {
            updateStatus.value = 'error'
            errorMessage.value = result.error
        }
    } catch (error: any) {
        updateStatus.value = 'error'
        errorMessage.value = error.message
    }
}

// 安装更新
const installUpdate = () => {
    window.electronAPI.invoke('installUpdate')
}

// 打开发布页面
const openReleasePage = () => {
    window.electronAPI.invoke('openReleasePage')
}

// 格式化日期
const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// 格式化进度
const formatProgress = (percentage: number) => {
    return `${percentage.toFixed(1)}%`
}

// 格式化速度
const formatSpeed = (bytes: number) => {
    if (bytes === 0) return ''
    if (bytes < 1024) return `${bytes.toFixed(0)} B/s`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`
}

// 监听更新状态事件
onMounted(async() => {
    // 获取当前版本
    currentVersion.value = await window.electronAPI.invoke('getCurrentVersion')
    
    // 监听更新状态
    window.electronAPI.on('updateStatus', (_: any, data: any) => {
        if (data.status === 'checking') {
            updateStatus.value = 'checking'
        } else if (data.status === 'available') {
            updateStatus.value = 'available'
            updateInfo.value = {
                version: data.version,
                releaseDate: data.releaseDate,
                releaseNotes: data.releaseNotes
            }
        } else if (data.status === 'not-available') {
            updateStatus.value = 'not-available'
        } else if (data.status === 'downloaded') {
            updateStatus.value = 'downloaded'
            updateInfo.value.version = data.version
        } else if (data.status === 'error') {
            updateStatus.value = 'error'
            errorMessage.value = data.error
        }
    })
    
    // 监听下载进度
    window.electronAPI.on('updateProgress', (_: any, data: any) => {
        downloadProgress.value = data
    })
    
    // 启动时自动检查更新（延迟 5 秒）
    setTimeout(() => {
        checkUpdate()
    }, 5000)
})
</script>

<style scoped>
.update-content {
    min-height: 80px;
}

.release-notes {
    border-left: 3px solid var(--el-color-primary);
    padding-left: 10px;
}

:deep(.el-progress__text) {
    font-size: 12px !important;
}

:deep(.el-icon.is-loading) {
    animation: rotating 2s linear infinite;
}

@keyframes rotating {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
