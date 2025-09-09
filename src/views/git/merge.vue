<template>
    <div class='h-full flex'>
        <div class='h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' :model='form' :rules='rules' label-width='80px'>
                <el-form-item label='根目录' prop='rootPath'>
                    <EpsSelectDir v-model='form.rootPath' type='merge' @change='changeRootPath' />
                </el-form-item>
                <el-form-item label='原始分支' prop='originBranch'>
                    <el-select v-model='form.originBranch' :options='epsBranchOptions' placeholder='请选择原始分支' filterable allow-create />
                </el-form-item>
                <el-form-item label='目标分支' prop='targetBranch'>
                    <el-select v-model='form.targetBranch' :options='epsBranchOptions' placeholder='请选择目标分支' filterable allow-create />
                </el-form-item>
                <el-form-item label='选择项目' prop='project'>
                    <el-select v-model='form.project' :options='projectOptions' multiple placeholder='请选择项目' clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='submitForm(ruleFormRef)'>合并</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='h-full w-1/2'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

const form = reactive({
    rootPath: '',
    originBranch: '',
    targetBranch: '',
    project: []
})
const codeRef = ref()
const log = ref('')
const ruleFormRef = ref()
const projectOptions = ref([])
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    rootPath: { required: true, message: '项目根目录不能为空' },
    originBranch: { required: true, message: '原始分支不能为空' },
    targetBranch: { required: true, message: '目标分支不能为空' },
    project: { required: true, message: '请选择项目' }
})
const changeRootPath = async() => {
    log.value = ''
    projectOptions.value = await loadProject(form.rootPath)
}

window.electronAPI.on('gitMerge', (_, res) => codeRef.value?.appendText(res))
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    try {
        await epsLayerConfirm('确认是否合并？', 'warning')
        log.value = '开始合并'
        await window.electronAPI.invoke('gitMerge', {
            dirList: form.project.map(v => v), 
            origin: form.originBranch, 
            target: form.targetBranch
        })
    } catch {}
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

onMounted(async() => {
    if(form.rootPath) {
        projectOptions.value = await loadProject(form.rootPath)
    }
})
</script>