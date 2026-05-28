<template>
    <div v-if='loading' class='h-64 flex items-center justify-center'>
        <EpsIcon class='is-loading' :size='32' type='ep:loading' />
        <span class='ml-2'>加载系统信息中...</span>
    </div>
    <template v-else>
        <el-descriptions
            title='品牌信息'
            :column='3'
            size='small'
            border
        >
            <el-descriptions-item><template #label>制造商</template>{{ getSystem?.manufacturer }}</el-descriptions-item>
            <el-descriptions-item><template #label>型号</template>{{ getSystem?.model }}</el-descriptions-item>
            <el-descriptions-item><template #label>版本</template>{{ getSystem?.version }}</el-descriptions-item>
        </el-descriptions>
    
        <el-descriptions
            class='mt-2'
            :title='`cpu信息（${(currentLoad?.currentLoad ?? 0)?.toFixed(2)}%）`'
            :column='3'
            size='small'
            border
        >
            <el-descriptions-item><template #label>制造商</template>{{ cpuInfo?.manufacturer }}</el-descriptions-item>
            <el-descriptions-item><template #label>品牌</template>{{ cpuInfo?.brand }}</el-descriptions-item>
            <el-descriptions-item><template #label>基准速度</template>{{ cpuInfo?.speed }}GHz</el-descriptions-item>
            <el-descriptions-item><template #label>内核</template>{{ cpuInfo?.physicalCores }}</el-descriptions-item>
            <el-descriptions-item><template #label>逻辑处理器</template>{{ cpuInfo?.cores }}</el-descriptions-item>
            <el-descriptions-item><template #label>虚拟化</template>{{ cpuInfo?.virtualization }}</el-descriptions-item>
            <el-descriptions-item><template #label>一级缓存</template>{{ epsCountFileSize((cpuInfo?.cache.l1d ?? 0) + (cpuInfo?.cache.l1i ?? 0)) }}</el-descriptions-item>
            <el-descriptions-item><template #label>二级缓存</template>{{ epsCountFileSize(cpuInfo?.cache.l2) }}</el-descriptions-item>
            <el-descriptions-item><template #label>三级缓存</template>{{ epsCountFileSize(cpuInfo?.cache.l3) }}</el-descriptions-item>
        </el-descriptions>
    
        <el-descriptions
            class='mt-2'
            :title='`内存信息（${((getMem?.used ?? 0) / (getMem?.total ?? 0) * 100).toFixed(2)}%）`'
            :column='4'
            size='small'
            border
        >
            <el-descriptions-item><template #label>已使用</template>{{ epsCountFileSize(getMem?.used) }}</el-descriptions-item>
            <el-descriptions-item><template #label>空闲</template>{{ epsCountFileSize(getMem?.free) }}</el-descriptions-item>
            <el-descriptions-item :span='2'><template #label>总大小</template>{{ epsCountFileSize(getMem?.total) }}</el-descriptions-item>
        
            <template v-for='v,i in getMemLayout' :key='`${v.manufacturer}-${i}`'>
                <el-descriptions-item><template #label>制造商</template>{{ v.manufacturer }}</el-descriptions-item>
                <el-descriptions-item><template #label>大小</template>{{ epsCountFileSize(v.size) }}</el-descriptions-item>
                <el-descriptions-item><template #label>类型</template>{{ v.type }}</el-descriptions-item>
                <el-descriptions-item><template #label>时钟频率</template>{{ v.clockSpeed }}</el-descriptions-item>
            </template>
        </el-descriptions>
    
        <el-descriptions
            class='mt-2'
            :title='diskUsed'
            :column='4'
            size='small'
            border
        >
            <template v-for='v,i in getDiskLayout' :key='`${v.name}-${i}`'>
                <el-descriptions-item><template #label>制造商</template>{{ v?.vendor }}</el-descriptions-item>
                <el-descriptions-item><template #label>名称</template>{{ v?.name }}</el-descriptions-item>
                <el-descriptions-item><template #label>总大小</template>{{ epsCountFileSize(v?.size) }}</el-descriptions-item>
                <el-descriptions-item><template #label>接口类型</template>{{ v?.interfaceType }}</el-descriptions-item>
            </template>
            <template v-for='val,index in getFsSize' :key='`${val.fs}-${index}`'>
                <el-descriptions-item><template #label>磁盘</template>{{ val?.fs }}</el-descriptions-item>
                <el-descriptions-item><template #label>使用率</template>{{ val?.use }}%</el-descriptions-item>
                <el-descriptions-item><template #label>已使用</template>{{ epsCountFileSize(val?.used) }}</el-descriptions-item>
                <el-descriptions-item><template #label>大小</template>{{ epsCountFileSize(val?.size) }}</el-descriptions-item>
            </template>
        </el-descriptions>
    
        <el-descriptions
            class='mt-2'
            title='gpu信息'
            :column='4'
            size='small'
            border
        >
            <template v-for='v in getGraphics?.controllers' :key='v.model'>
                <el-descriptions-item><template #label>制造商</template>{{ v?.vendor }}</el-descriptions-item>
                <el-descriptions-item><template #label>模型</template>{{ v?.model }}</el-descriptions-item>
                <el-descriptions-item><template #label>总线</template>{{ v?.bus }}</el-descriptions-item>
                <el-descriptions-item><template #label>显存大小</template>{{ epsCountFileSize((v?.vram ?? 0) * 1024 * 1024) }}</el-descriptions-item>
            </template>
        </el-descriptions>
    
        <el-descriptions
            class='mt-2'
            title='网络'
            :column='5'
            size='small'
            border
        >
            <el-descriptions-item><template #label>ipv4</template>{{ getIpObj.ipv4 }}</el-descriptions-item>
            <el-descriptions-item :span='4'><template #label>ipv6</template>{{ getIpObj.ipv6 }}</el-descriptions-item>
            <template v-for='v,i in getNetworkInterfaces' :key='`${v.ifaceName}-${i}`'>
                <el-descriptions-item><template #label>网卡</template>{{ v?.ifaceName }}</el-descriptions-item>
                <el-descriptions-item><template #label>ipv4</template><el-text size='small' :type='v.default ? "success" : ""'>{{ v?.ip4 }}</el-text></el-descriptions-item>
                <el-descriptions-item><template #label>子网</template>{{ v?.ip4subnet }}</el-descriptions-item>
                <el-descriptions-item><template #label>mac</template>{{ v?.mac }}</el-descriptions-item>
                <el-descriptions-item><template #label>虚拟</template><el-tag size='small' :type='v?.virtual ? "primary" : "info"'>{{ v?.virtual ? "是" : "否" }}</el-tag></el-descriptions-item>
            </template>
        </el-descriptions>
    </template>
</template>
<script setup lang='ts'>
import type { Systeminformation } from 'systeminformation'

const timer = ref<NodeJS.Timeout[]>([])
const loading = ref(true)
const getSystem = ref<Systeminformation.SystemData>()
const cpuInfo = ref<Systeminformation.CpuData>()
const currentLoad = ref<Systeminformation.CurrentLoadData>()
const getMem = ref<Systeminformation.MemData>()
const getMemLayout = ref<Systeminformation.MemLayoutData[]>()
const getGraphics = ref<Systeminformation.GraphicsData>()
const getFsSize = ref<Systeminformation.FsSizeData[]>()
const getDiskLayout = ref<Systeminformation.DiskLayoutData[]>()
const getNetworkInterfaces = ref<Systeminformation.NetworkInterfacesData[]>()
const getIpObj = ref({ ipv4: '', ipv6: '' })

onMounted(async() => {
    // 并行请求所有静态数据
    const [system, cpu, memLayout, graphics, fsSize, diskLayout, networkInterfaces, ip, currentLoadData, memData] = await Promise.all([
        window.electronAPI.invoke('getSystem'),
        window.electronAPI.invoke('getCpu'),
        window.electronAPI.invoke('getMemLayout'),
        window.electronAPI.invoke('getGraphics'),
        window.electronAPI.invoke('getFsSize'),
        window.electronAPI.invoke('getDiskLayout'),
        window.electronAPI.invoke('getNetworkInterfaces'),
        window.electronAPI.invoke('getIp'),
        window.electronAPI.invoke('getCurrentLoad'),
        window.electronAPI.invoke('getMem')
    ])

    // 一次性赋值
    getSystem.value = system
    cpuInfo.value = cpu
    getMemLayout.value = memLayout
    getGraphics.value = graphics
    getFsSize.value = fsSize
    getDiskLayout.value = diskLayout
    getNetworkInterfaces.value = networkInterfaces
    getIpObj.value = ip
    currentLoad.value = currentLoadData
    getMem.value = memData
    loading.value = false

    // 动态数据定时刷新
    timer.value.push(setInterval(() => window.electronAPI.invoke('getCurrentLoad').then(res => currentLoad.value = res), 3000))
    timer.value.push(setInterval(() => window.electronAPI.invoke('getMem').then(res => getMem.value = res), 3000))
})



const diskUsed = computed(() => {
    let q = (getFsSize.value ?? []).map(v => v.used).reduce((acc, v) => acc + v, 0)
    let w = (getDiskLayout.value ?? []).map(v => v.size).reduce((acc, v) => acc + v, 0)
    return `磁盘信息（${(q / w * 100).toFixed(2)}%）`
})

onUnmounted(() => {
    timer.value.forEach(v => clearInterval(v))
})
</script>