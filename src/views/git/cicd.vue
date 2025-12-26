<template>
    <div class='h-full'>
        <div class='mb-2'>
            <el-button type='primary' plain @click='start()'>启动</el-button>
            <el-button type='primary' plain @click='add'>新增</el-button>
            <el-button type='danger' plain @click='MultDel()'>删除</el-button>
        </div>
        <el-table ref='tableRef' :data='tableData' border class='port-table'>
            <el-table-column type='index' width='50' />
            <el-table-column type='selection' width='55' />
            <el-table-column prop='projectName' label='项目名称' show-overflow-tooltip />
            <el-table-column prop='projectId' label='项目id' width='100' show-overflow-tooltip />
            <el-table-column prop='branch' label='分支' width='100' show-overflow-tooltip />
            <el-table-column prop='index' label='排序' width='60' />
            <el-table-column fixed='right' label='操作' width='200'>
                <template #default='scope'>
                    <el-button link type='primary' size='small' @click='start(scope.row)'>启动</el-button>
                    <el-button link type='primary' size='small' @click='edit(scope.row)'>编辑</el-button>
                    <el-button link type='danger' size='small' @click='remove(scope.row.projectId)'>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='h-1/4'><EpsXtermjs ref='codeRef' disabled /></div>

        <el-dialog
            v-model='dialogVisible'
            :title='`${isAdd ? "新增" : "编辑"}项目`'
            width='600'
            :close-on-click-modal='false'
        >
            <el-form ref='ruleFormRef' :model='form' label-width='80px' :rules='rules' @submit.prevent>
                <el-form-item prop='projectName' label='项目名称'>
                    <el-input v-model='form.projectName' placeholder='请输入项目名称' />
                </el-form-item>
                <el-form-item label='项目id' prop='projectId'>
                    <el-input v-model='form.projectId' placeholder='请输入项目id' />
                </el-form-item>
                <el-form-item label='分支' prop='branch'>
                    <el-input v-model='form.branch' placeholder='请输入分支' />
                </el-form-item>
                <el-form-item label='token' prop='token'>
                    <el-input v-model='form.token' placeholder='请输入token' />
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
    projectName = ''
    projectId = ''
    branch = 'dev'
    token = ''
    index = 1
}
const codeRef = useTemplateRef('codeRef')
const getLocalDefaultData = (getLocal<ICommand[]>('gitlabCicd') ?? [])
const tableData = ref(getLocalDefaultData)
const tableRef = ref()
const start = async(row?: ICommand) => {
    const sels = row ? [row] : tableRef.value?.getSelectionRows() as ICommand[]
    if(sels.length === 0) return epsLayerMsg('当前尚未选择数据', 'warning')
    try {
        await epsLayerConfirm('请确认是否执行cicd流水线', 'warning')
        const res = await window.electronAPI.invoke('gitlabCicd', sels.map(v => ({ projectName: v.projectName, projectId: v.projectId, branch: v.branch, token: v.token })))
        codeRef.value?.appendText(res)
    } catch {}
}
const remove = async(projectId: string) => {
    try {
        await epsLayerConfirm('确认删除该条数据？', 'warning')
        tableData.value = tableData.value.filter(v => v.projectId !== projectId)
        setLocal('gitlabCicd', tableData.value)
        epsLayerMsg('删除成功', 'success')
    } catch {}
}

const dialogVisible = ref(false)
const form = ref(new ICommand())
const isAdd = ref(true)
const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    projectName: { required: true, message: '项目名称不能为空' },
    projectId: { required: true, message: '项目id不能为空' },
    branch: { required: true, message: '分支不能为空' },
    token: { required: true, message: 'token不能为空' },
    index: { required: true, message: '排序不能为空' }
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
        if(tableData.value.map(v => v.projectId).includes(form.value.projectId)) return epsLayerMsg('项目已存在', 'warning')
        tableData.value.push({ ...form.value })
    }
    tableData.value.sort((a,b) => a.index - b.index)
    setLocal('gitlabCicd', tableData.value)
    dialogVisible.value = false
}

const MultDel = async() => {
    const sels = tableRef.value?.getSelectionRows() as ICommand[]
    if(sels.length === 0) return epsLayerMsg('当前尚未选择数据', 'warning')
    try {
        await epsLayerConfirm('确认删除选中项？', 'warning')
        sels.forEach(val => tableData.value = tableData.value.filter(v => v.projectId !== val.projectId))
        setLocal('gitlabCicd', tableData.value)
        epsLayerMsg('删除成功', 'success')
    } catch {}
}
</script>

<style scoped>
.port-table {
    height: calc(75% - 100px);
}

:deep(.el-input-number.is-center .el-input__inner) {
    text-align: left;
}
</style>