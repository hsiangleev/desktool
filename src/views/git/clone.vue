<template>
    <div class='h-full flex'>
        <div class='h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' :model='form' :rules='rules' label-width='80px' @submit.prevent>
                <el-form-item label='根目录' prop='rootPath'>
                    <EpsSelectDir v-model='form.rootPath' type='clone' @change='log=""' />
                </el-form-item>
                <el-form-item label='克隆项目' prop='url'>
                    <el-input v-model='form.url' placeholder='请输入项目地址' @keyup.enter='cloneProject(ruleFormRef)' />
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' :disabled='form.isStart' @click='cloneProject(ruleFormRef)'>克隆</el-button>
                    <el-button type='warning' :disabled='!form.isStart' @click='stopProject()'>终止</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='h-full w-1/2'><EpsCodeJs ref='codeRef' :model-value='log' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'
const { getSession, setSession } = epsSession()
class IForm {
    rootPath = ''
    url = ''
    isStart = false
}
const form = reactive(getSession<IForm>('gitClone') ?? new IForm())
const codeRef = ref()
const log = ref('')
const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    rootPath: { required: true, message: '项目根目录不能为空' },
    url: { required: true, message: '项目地址不能为空' }
})

/** 克隆 */
window.electronAPI.on('gitClone', (_, res) => codeRef.value?.appendText(res))
const cloneProject = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    log.value = '开始克隆'
    form.isStart = true
    setSession('gitClone', form)
    await window.electronAPI.invoke('gitClone', { repoUrl: form.url, targetDir: form.rootPath })
}
const stopProject = async() => {
    const res = await window.electronAPI.invoke('processStop')
    codeRef.value?.appendText(res)
    form.isStart = false
    setSession('gitClone', form)
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>