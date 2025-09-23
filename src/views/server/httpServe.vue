<template>
    <div class='eps-card-flex h-full' shadow='never'>
        <el-form ref='ruleFormRef' :model='form' label-width='100px' :rules='rules' @submit.prevent>
            <el-form-item prop='baseDir' label='资源地址'>
                <EpsSelectDir v-model='form.baseDir' />
            </el-form-item>
            <el-form-item prop='port' label='启动端口'>
                <el-input-number v-model='form.port' class='w-full' :min='80' :max='65535' :controls='false' align='left' placeholder='请输入端口' />
            </el-form-item>
            <el-form-item>
                <el-button type='primary' :disabled='form.isStart' plain @click='submitForm(ruleFormRef)'>启动</el-button>
                <el-button :disabled='!form.isStart' @click='close'>停止</el-button>
            </el-form-item>
        </el-form>
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='content-log'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'
const { getSession, setSession } = epsSession()
class IForm {
    baseDir = ''
    port = 3000
    isStart = false
}
const form = reactive(getSession<IForm>('httpServe') ?? new IForm())

const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    baseDir: { required: true, message: '资源地址不能为空' },
    port: { required: true, message: '启动端口不能为空' }
})
const log = ref(form.isStart ? '服务运行中...' : '服务尚未启动')
const codeRef = ref()
window.electronAPI.on('connectHttpServe', (_, res) => codeRef.value?.appendText(res))
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    try {
        log.value = '正在启动服务...'
        await window.electronAPI.invoke('connectHttpServe', { baseDir: form.baseDir, port: form.port })
        form.isStart = true
        setSession('httpServe', form)
    } catch (error) {
        log.value = `${error}`
    }
}
const close = async() => {
    codeRef.value?.appendText('服务停止中...')
    codeRef.value?.appendText(await window.electronAPI.invoke('closeHttpServe'))
    form.isStart = false
    setSession('httpServe', form)
}
</script>