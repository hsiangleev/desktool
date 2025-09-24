<template>
    <div class='h-full'>
        <div class='mb-2'>
            <el-button type='primary' plain @click='add'>新增</el-button>
            <el-button type='danger' plain @click='portAgentMultDel()'>删除</el-button>
        </div>
        <el-table ref='tableRef' :data='tableData' border class='port-table'>
            <el-table-column type='index' width='50' />
            <el-table-column type='selection' width='55' />
            <el-table-column prop='listenaddress' label='本地地址' />
            <el-table-column prop='listenport' label='本地端口' />
            <el-table-column prop='connectaddress' label='目标地址' />
            <el-table-column prop='connectport' label='目标端口' />
            <el-table-column fixed='right' label='操作'>
                <template #default='scope'>
                    <el-button link type='primary' size='small' @click='portAgentReset(scope.row)'>重设</el-button>
                    <el-button link type='danger' size='small' @click='portAgentDel([scope.row])'>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='h-40'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>

        
        <el-dialog
            v-model='dialogVisible'
            title='新增端口代理'
            width='600'
            :close-on-click-modal='false'
        >
            <el-form ref='ruleFormRef' :model='form' label-width='80px' :rules='rules' @submit.prevent>
                <el-form-item prop='listenaddress' label='本地地址'>
                    <el-input v-model='form.listenaddress' placeholder='请输入本地地址' />
                </el-form-item>
                <el-form-item prop='listenport' label='本地端口'>
                    <el-input-number v-model='form.listenport' placeholder='请输入本地端口' class='w-full text-left' :min='0' :max='65535' :controls='false' />
                </el-form-item>
                <el-form-item prop='connectaddress' label='目标地址'>
                    <el-input v-model='form.connectaddress' placeholder='请输入目标地址' />
                </el-form-item>
                <el-form-item prop='connectport' label='目标端口'>
                    <el-input-number v-model='form.connectport' placeholder='请输入目标端口' class='w-full' :min='0' :max='65535' :controls='false' />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class='dialog-footer'>
                    <el-button type='primary' @click='submitForm(ruleFormRef)'>保存</el-button>
                    <el-button @click='dialogVisible = false'>关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'


class IPortAgent {
    listenaddress = '0.0.0.0'
    listenport?: number
    connectaddress = ''
    connectport?: number
}
const tableData = ref<IPortAgent[]>([])
const log = ref('')
const codeRef = ref()
const dialogVisible = ref(false)
const tableRef = ref()
window.electronAPI.on('portAgentList', (_, res: string) => {
    const lines = res.split(/\r?\n/).map(l => l.trim())
        .filter(Boolean)
    // 找到数据部分 (跳过标题行)
    const dataLines = lines.filter(line => /^\d+\.\d+\.\d+\.\d+/.test(line))
    const rules = dataLines.map(line => {
        // 按空格切分, 保证多个空格只算一个
        const parts = line.split(/\s+/)
        return {
            listenaddress: parts[0],
            listenport: Number(parts[1]),
            connectaddress: parts[2],
            connectport: Number(parts[3])
        }
    })
    tableData.value = [...tableData.value, ...rules]
})

window.electronAPI.on('portAgentDel', (_, res: string) => codeRef.value?.appendText(res))
const del = async(row: IPortAgent) => await window.electronAPI.invoke('portAgentDel', { listenaddress: row.listenaddress, listenport: row.listenport })
const portAgentDel = async(row: IPortAgent[]) => {
    try {
        await epsLayerConfirm('确定是否删除？', 'warning')
        log.value = ''
        const s = row.map(v => new Promise(resolve => del(v).then(() => resolve({}))))
        await Promise.all(s)
        await getPortAgentList()
    } catch {}
}
const portAgentMultDel = async() => {
    const sels = tableRef.value?.getSelectionRows() as IPortAgent[]
    if(sels.length === 0) return epsLayerMsg('当前尚未选择数据', 'warning')
    await portAgentDel(sels)
}
const portAgentReset = async(row: IPortAgent) => {
    log.value = ''
    await del(row)
    const { listenaddress, listenport, connectaddress, connectport } = row
    await window.electronAPI.invoke('portAgentAdd', { listenaddress, listenport, connectaddress, connectport })
    await getPortAgentList()
}

const form = ref(new IPortAgent())
const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    listenaddress: { required: true, message: '本地地址不能为空' },
    listenport: { required: true, message: '本地端口不能为空' },
    connectaddress: { required: true, message: '目标地址不能为空' },
    connectport: { required: true, message: '目标端口不能为空' }
})
const add = () => {
    form.value = new IPortAgent()
    dialogVisible.value = true
}
const getPortAgentList = async() => {
    tableData.value = []
    await window.electronAPI.invoke('portAgentList')
}
window.electronAPI.on('portAgentAdd', (_, res: string) => codeRef.value?.appendText(res))
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    log.value = ''
    const { listenaddress, listenport, connectaddress, connectport } = form.value
    await window.electronAPI.invoke('portAgentAdd', { listenaddress, listenport, connectaddress, connectport })
    await getPortAgentList()
    dialogVisible.value = false
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