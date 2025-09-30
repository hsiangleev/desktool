<template>
    <div class='h-full'>
        <div class='mb-2'>
            <el-button type='primary' plain @click='add'>新增</el-button>
            <el-button type='danger' plain @click='MultDel()'>删除</el-button>
        </div>
        <el-table ref='tableRef' :data='tableData' border class='port-table'>
            <el-table-column type='index' width='50' />
            <el-table-column type='selection' width='55' />
            <el-table-column prop='command' label='命令' show-overflow-tooltip />
            <el-table-column prop='isRunning' label='状态' width='90'>
                <template #default='scope'>
                    <el-tag :type='scope.row.isRunning ? "success" : "info"'>{{ scope.row.isRunning ? "运行中" : "未运行" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop='index' label='排序' width='60' />
            <el-table-column fixed='right' label='操作' width='200'>
                <template #default='scope'>
                    <el-button v-if='!scope.row.isRunning' link type='primary' size='small' @click='start(scope.row)'>执行</el-button>
                    <el-button v-else link type='primary' size='small' @click='stop(scope.row.stopId)'>停止</el-button>
                    <el-button link type='primary' size='small' @click='edit(scope.row)'>编辑</el-button>
                    <el-button link type='danger' size='small' @click='remove(scope.row.stopId)'>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='h-1/2'><EpsXtermjs ref='codeRef' disabled /></div>

        <el-dialog
            v-model='dialogVisible'
            title='新增端口代理'
            width='600'
            :close-on-click-modal='false'
        >
            <el-form ref='ruleFormRef' :model='form' label-width='80px' :rules='rules' @submit.prevent>
                <el-form-item prop='command' label='命令'>
                    <el-input v-model='form.command' placeholder='请输入命令' />
                </el-form-item>
                <el-form-item prop='index' label='排序'>
                    <el-input-number v-model='form.index' placeholder='请输入排序号' class='w-full' :min='1' :controls='false' />
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
const { getLocal, setLocal } = epsLocal()
class ICommand {
    stopId = `${Date.now()}`
    command = ''
    index = 1
    isRunning = false

    constructor(command = '') {
        this.command = command
    }
}
const getLocalDefaultData = (getLocal<ICommand[]>('commandManager') ?? [])
getLocalDefaultData.forEach(v => v.isRunning = false)
const tableData = ref(getLocalDefaultData)
const codeRef = useTemplateRef('codeRef')
const tableRef = ref()
window.electronAPI.on('startCommand', (_, res: string) => codeRef.value?.appendText(res))
window.electronAPI.on('processStop', (_, res: string) => codeRef.value?.appendText(res))
const start = async(row: ICommand) => {
    const { command, stopId } = row
    codeRef.value?.insert(`开始执行${command}命令`)
    row.isRunning = true
    await window.electronAPI.invoke('startCommand', { command, stopId })
    row.isRunning = false
}
const stop = async(stopId: string) => {
    const res = await window.electronAPI.invoke('processStop', stopId)
    codeRef.value?.appendText(res)
}
const remove = async(stopId: string) => {
    try {
        await epsLayerConfirm('确认删除该条数据？', 'warning')
        tableData.value = tableData.value.filter(v => v.stopId !== stopId)
        setLocal('commandManager', tableData.value)
        epsLayerMsg('删除成功', 'success')
    } catch {}
}

const dialogVisible = ref(false)
const form = ref(new ICommand())
const isAdd = ref(true)
const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    command: { required: true, message: '命令不能为空' }
})
const add = () => {
    form.value = new ICommand()
    isAdd.value = true
    dialogVisible.value = true
}
const edit = (row: ICommand) => {
    form.value = row
    isAdd.value = false
    dialogVisible.value = true
}
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    if(isAdd.value) {
        if(tableData.value.map(v => v.command).includes(form.value.command)) return epsLayerMsg('命令已存在', 'warning')
        tableData.value.push({ ...form.value })
    }
    tableData.value.sort((a,b) => a.index - b.index)
    setLocal('commandManager', tableData.value)
    dialogVisible.value = false
}

const MultDel = async() => {
    const sels = tableRef.value?.getSelectionRows() as ICommand[]
    if(sels.length === 0) return epsLayerMsg('当前尚未选择数据', 'warning')
    try {
        await epsLayerConfirm('确认删除选中项？', 'warning')
        sels.forEach(val => tableData.value = tableData.value.filter(v => v.stopId !== val.stopId))
        setLocal('commandManager', tableData.value)
        epsLayerMsg('删除成功', 'success')
    } catch {}
}
</script>

<style scoped>
.port-table {
    height: calc(50% - 100px);
}

:deep(.el-input-number.is-center .el-input__inner) {
    text-align: left;
}
</style>