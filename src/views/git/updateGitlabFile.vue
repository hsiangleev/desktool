<template>
    <div class='min-h-full'>
        <el-form ref='ruleFormRef' :model='form' :rules='rules' label-width='120px' @submit.prevent>
            <el-form-item label='根目录' prop='rootPath'>
                <EpsSelectDir v-model='form.rootPath' type='updateGitlabFile' @change='changeRootPath' />
            </el-form-item>
            <el-form-item label='更新项目' prop='project'>
                <el-select v-model='form.project' :options='projectOptions' multiple placeholder='本地' clearable />
            </el-form-item>
            <el-form-item label='gitlab项目地址' prop='projectUrl'>
                <el-input v-model='form.projectUrl' placeholder='请输入项目地址' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item label='文件路径' prop='filePath'>
                <el-input v-model='form.filePath' placeholder='请输入文件路径' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item label='同步分支' prop='branch'>
                <el-input v-model='form.branch' placeholder='请输入同步分支' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='submitForm(ruleFormRef)'>同步</el-button>
                <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
const { getLocal, setLocal } = epsLocal()
class IForm {
    rootPath = ''
    projectUrl = ''
    project: string[] = []
    filePath = ''
    branch = ''
}
const form = reactive(getLocal<IForm>('updateGitlabFile') ?? new IForm())

const projectOptions = ref([])
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<IForm>>({
    rootPath: [{ required: true, message: '根目录不能为空', trigger: 'blur' }],
    projectUrl: [{ required: true, message: '项目地址不能为空', trigger: 'blur' }],
    branch: [{ required: true, message: '同步分支不能为空', trigger: 'blur' }],
    filePath: [{ required: true, message: '文件路径不能为空', trigger: 'blur' }],
    project: { required: true, message: '请选择项目' }
})
const changeRootPath = async() => {
    projectOptions.value = await loadProject(form.rootPath)
}

const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    setLocal('updateGitlabFile', form)
    const { rootPath, projectUrl, project, filePath, branch } = form
    const res = await window.electronAPI.invoke('updateGitlabFile', { rootPath, projectUrl, project: project.map(v => v), filePath, branch })
    epsLayerNotice('提示', res.msg, res.code === 0 ? 'success' : 'error')
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