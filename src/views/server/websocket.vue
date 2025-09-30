<template>
    <div class='eps-card-flex h-full' shadow='never'>
        <el-form ref='ruleFormRef' :model='form' label-width='100px' :rules='rules' @submit.prevent>
            <el-form-item prop='ip' label='连接地址'>
                <el-input v-model='form.ip' placeholder='请输入连接地址' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item prop='isBase64' label='base64加密'>
                <el-switch v-model='form.isBase64' />
            </el-form-item>
            <el-form-item>
                <el-button type='primary' :disabled='form.isStart' plain @click='submitForm(ruleFormRef)'>连接</el-button>
                <el-button :disabled='!form.isStart' @click='close()'>停止</el-button>
            </el-form-item>
        </el-form>
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='content-log'><EpsXtermjs ref='codeRef' disabled /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'
const { getSession, setSession } = epsSession()
class IForm {
    ip = ''
    isBase64 = true
    isStart = false
}
const form = reactive(getSession<IForm>('websocket') ?? new IForm())

const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    ip: { required: true, message: '连接地址不能为空' }
})
const codeRef = useTemplateRef('codeRef')
onMounted(() => {
    codeRef.value?.appendText(form.isStart ? '已连接' : '尚未连接')
})
window.electronAPI.on('connectWebsocket', (_, res) => {
    codeRef.value?.appendText(res.msg)
    if(res.code !== 0) close(false)
})
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    codeRef.value?.insert('开始连接中...')
    try {
        await window.electronAPI.invoke('connectWebsocket', { ip: form.ip, isBase64: form.isBase64 })
        form.isStart = true
        setSession('websocket', form)
    } catch (error) {
        codeRef.value?.insert(`${error}`)
    }
}
const close = async(ismsg = true) => {
    ismsg && codeRef.value?.appendText('停止连接中...')
    await window.electronAPI.invoke('closeWebsocket')
    form.isStart = false
    setSession('websocket', form)
}
</script>