<template>
    <div class='h-full flex'>
        <el-card class='h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' :model='form' :rules='rules' label-width='80px'>
                <el-form-item label='根目录' prop='rootPath'>
                    <EpsSelectDir v-model='form.rootPath' @change='log=""' />
                </el-form-item>
                <el-form-item label='克隆项目' prop='url'>
                    <el-input v-model='form.url' placeholder='请输入项目地址' />
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='cloneProject(ruleFormRef)'>克隆</el-button>
                    <el-button type='warning' @click='stopProject()'>终止</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class='h-full w-1/2'><EpsCodeJs :model-value='log.split("\r\n").reverse().join("\r\n")' is-readonly class='res-code' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

const form = reactive({
    rootPath: 'D:/epaas',
    originBranch: 'dev',
    targetBranch: 'test',
    project: [],
    url: ''
})
const log = ref('')
const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    rootPath: { required: true, message: '项目根目录不能为空' },
    url: { required: true, message: '项目地址不能为空' }
})

/** 克隆 */
window.electronAPI.on('gitClone', (_, res) => log.value += `\r\n${res}`)
const cloneProject = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    log.value = '开始克隆'
    await window.electronAPI.invoke('gitClone', { repoUrl: form.url, targetDir: form.rootPath })
}
const stopProject = async() => {
    const res = await window.electronAPI.invoke('gitStop')
    await epsSleep(1000)
    log.value += `\r\n${res}`
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<style scoped>
    .res-code{
        height: calc(100% - 5px) !important;
    }
</style>