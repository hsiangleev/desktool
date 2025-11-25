<template>
    <el-descriptions
        title='品牌信息'
        :column='4'
        size='small'
        border
    >
        <el-descriptions-item><template #label>制造商</template>{{ getSystem?.manufacturer }}</el-descriptions-item>
        <el-descriptions-item><template #label>型号</template>{{ getSystem?.model }}</el-descriptions-item>
        <el-descriptions-item><template #label>版本</template>{{ getSystem?.version }}</el-descriptions-item>
        <el-descriptions-item><template #label>虚拟机</template>{{ getSystem?.virtual }}</el-descriptions-item>
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
        <el-descriptions-item><template #label>总大小</template>{{ epsCountFileSize(getMem?.total) }}</el-descriptions-item>
    </el-descriptions>
    
    <el-descriptions
        class='mt-2'
        title='内存厂商'
        :column='4'
        size='small'
        border
    >
        <template v-for='v,i in getMemLayout' :key='`${v.manufacturer}-${i}`'>
            <el-descriptions-item><template #label>制造商</template>{{ v.manufacturer }}</el-descriptions-item>
            <el-descriptions-item><template #label>大小</template>{{ epsCountFileSize(v.size) }}</el-descriptions-item>
            <el-descriptions-item><template #label>类型</template>{{ v.type }}</el-descriptions-item>
            <el-descriptions-item><template #label>时钟频率</template>{{ v.clockSpeed }}</el-descriptions-item>
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
</template>
<script setup lang='ts'>
import { type Systeminformation } from 'systeminformation'

const timer = ref<NodeJS.Timeout[]>([])
const getSystem = ref<Systeminformation.SystemData>()
const cpuInfo = ref<Systeminformation.CpuData>()
const currentLoad = ref<Systeminformation.CurrentLoadData>()
const getMem = ref<Systeminformation.MemData>()
const getMemLayout = ref<Systeminformation.MemLayoutData[]>()
const getGraphics = ref<Systeminformation.GraphicsData>()
onMounted(() => {
    window.electronAPI.invoke('getSystem').then(res => getSystem.value = res)
    window.electronAPI.invoke('getCpu').then(res => cpuInfo.value = res)
    window.electronAPI.invoke('getMemLayout').then(res => getMemLayout.value = res)
    timer.value.push(setInterval(() => window.electronAPI.invoke('getCurrentLoad').then(res => currentLoad.value = res), 3000))
    timer.value.push(setInterval(() => window.electronAPI.invoke('getMem').then(res => getMem.value = res), 3000))
    window.electronAPI.invoke('getGraphics').then(res => getGraphics.value = res)
    
})

onUnmounted(() => {
    timer.value.forEach(v => clearInterval(v))
})
</script>