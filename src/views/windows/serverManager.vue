<template>
    <div class='h-full'>
        <div class='mb-2'>
            <el-button type='primary' plain @click='add'>添加</el-button>
        </div>
        <el-table ref='tableRef' :data='tableData' border class='port-table'>
            <el-table-column type='index' width='50' />
            <el-table-column prop='serverName' label='服务名称' />
            <el-table-column prop='status' label='状态'>
                <template #default='scope'>
                    <el-tag :type='scope.row.status === "RUNNING" ? "primary" : scope.row.status === "STOPPED" ? "danger" : "success"'>{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed='right' label='操作'>
                <template #default='scope'>
                    <el-button v-if='scope.row.status==="STOPPED"' link type='primary' size='small' @click='start(scope.row.serverName)'>启动</el-button>
                    <el-button v-if='scope.row.status==="RUNNING"' link type='danger' size='small' @click='stop(scope.row.serverName)'>停止</el-button>
                    <el-button link type='danger' size='small' @click='remove(scope.row.serverName)'>移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='h-40'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
const { getLocal, setLocal } = epsLocal()
class IPortAgent {
    serverName = ''
    status: 'STOPPED' | 'RUNNING' = 'STOPPED'
}
const tableData = ref<IPortAgent[]>([])
const serverList = ref(getLocal<string[]>('serverManager') ?? [])
const log = ref('')
const codeRef = ref()
const tableRef = ref()
const matchServer = (str: string) => {
    const nameMatch = str.match(/SERVICE_NAME:\s+(\S+)/)
    const stateMatch = str.match(/STATE\s*:\s*(\d+)\s+(\w+)/)
    if (nameMatch && stateMatch) {
        const [,serverName] = nameMatch
        const [,, status] = stateMatch
        return { serverName, status }
    }
    return {}
}
window.electronAPI.on('startServerName', (_, res: string) => codeRef.value?.appendText(res))
window.electronAPI.on('stopServerName', (_, res: string) => codeRef.value?.appendText(res))
const start = async(serverName: string) => {
    const { close } = epsLayerLoading()
    const res = await window.electronAPI.invoke('startServerName', serverName)
    if(res.code === 0) {
        await epsSleep(2000)
        await getPortAgentList()
    }
    close()
}
const stop = async(serverName: string) => {
    const { close } = epsLayerLoading()
    const res = await window.electronAPI.invoke('stopServerName', serverName)
    if(res.code === 0) {
        await epsSleep(2000)
        await getPortAgentList()
    }
    close()
}
const remove = async(serverName: string) => {
    serverList.value = serverList.value.filter(v => v !== serverName)
    tableData.value = tableData.value.filter(v => v.serverName !== serverName)
    setLocal('serverManager', serverList.value)
}
const add = async() => {
    try {
        const { value } = await epsLayerPrompt({
            title: '添加常用服务',
            type: 'text',
            placeholder: '请输入常用服务名称'
        })
        await window.electronAPI.invoke('getServerName', value)
    } catch {}
}
window.electronAPI.on('getServerName', (_, res: string) => {
    codeRef.value?.appendText(res)
    const { serverName, status } = matchServer(res)
    if (serverName && status) {
        if(!serverList.value.includes(serverName)) {
            serverList.value.push(serverName)
            setLocal('serverManager', serverList.value)
        }
        if(!tableData.value.map(v => v.serverName).includes(serverName)) {
            tableData.value.push({
                serverName,
                status: status as any
            })
        }
    }
})
const getPortAgentList = async() => {
    tableData.value = []
    const s = getLocal<string[]>('serverManager') ?? []
    for (const element of s) {
        await window.electronAPI.invoke('getServerName', element)
    }
}
getPortAgentList()
</script>

<style scoped>
.port-table {
    height: calc(100% - 250px);
}

:deep(.el-input-number.is-center .el-input__inner) {
    text-align: left;
}
</style>