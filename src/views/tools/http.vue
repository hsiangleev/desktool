<template>
    <div class='h-full flex'>
        <div class='eps-card-flex h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' :model='ruleForm' :rules='rules' label-width='80px' @submit.prevent>
                <el-form-item label='请求地址' prop='url'>
                    <el-input v-model='ruleForm.url' placeholder='请输入请求地址' @keyup.enter='submitForm(ruleFormRef)' />
                </el-form-item>
                <el-form-item label='请求类型' prop='method'>
                    <el-select v-model='ruleForm.method'>
                        <el-option value='GET'>GET</el-option>
                        <el-option value='POST'>POST</el-option>
                        <el-option value='DELETE'>DELETE</el-option>
                        <el-option value='PUT'>PUT</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='headers' prop='headers'>
                    <EpsCodeJs v-model='ruleForm.headers' :line-numbers='false' height='60px' placeholder='请输入请求headers' @keyup.enter='submitForm(ruleFormRef)' />
                </el-form-item>
                <el-form-item label='params' prop='params'>
                    <EpsCodeJs v-model='ruleForm.params' :line-numbers='false' height='60px' placeholder='请输入请求params' @keyup.enter='submitForm(ruleFormRef)' />
                </el-form-item>
                <el-form-item label='data' prop='data'>
                    <EpsCodeJs v-model='ruleForm.data' :line-numbers='false' height='100px' placeholder='请输入请求data' @keyup.enter='submitForm(ruleFormRef)' />
                </el-form-item>
                <el-form-item label='选择文件' prop='file'>
                    <el-upload
                        v-model:file-list='fileList'
                        class='w-full'
                        drag
                        :auto-upload='false'
                        multiple
                    >
                        <div class='el-upload__text'>拖拽或点击上传</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='submitForm(ruleFormRef)'>发送请求</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='h-full w-1/2'><EpsCodeJs ref='codeRef' v-model='responseData' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
const responseData = ref('')
interface IForm {
    url: string
    method: string
    data: string
    params: string
    headers: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<IForm>({
    url: '',
    method: 'GET',
    headers: '{"authenticate":""}',
    data: '',
    params: ''
})
const checkJson = (value: any) => {
    if (value === '') return
    let isError = false
    try {
        JSON.parse(value)
    } catch {
        isError = true
    }
    return isError ? 'JSON格式不正确' : undefined
}
const rules = reactive<FormRules<IForm>>({
    url: [{ required: true, message: '请求地址不能为空', trigger: 'blur' }],
    params: [{ validator: (_: any, value: any, callback: any) => callback(checkJson(value)), trigger: 'blur' }],
    data: [{ validator: (_: any, value: any, callback: any) => callback(checkJson(value)), trigger: 'blur' }]
})
const fileList = ref<UploadFile[]>([])
const transformFile: () => Promise<{name: string, buffer: any}[]> = async() => {
    if(fileList.value.length === 0) return []
    const p = fileList.value.map(v => {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = () => {
                const arrayBuffer = reader.result as any
                const buffer = new Uint8Array(arrayBuffer)
                resolve({ name: v.name, buffer })
            }
            reader.readAsArrayBuffer(v.raw!)
        })
    }) as any
    return await Promise.all(p)
}
const codeRef = ref()
window.electronAPI.on('fetchFile', (_, res) => {
    codeRef.value?.appendText(typeof res === 'string' ? res : JSON.stringify(res, null, 4))
})
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    const { close } = await epsLayerLoading()
    let data = {}
    let params = {}
    let headers = {}
    try {
        data = JSON.parse(ruleForm.data || '{}')
    } catch {}
    try {
        params = JSON.parse(ruleForm.params || '{}')
    } catch {}
    try {
        headers = JSON.parse(ruleForm.headers || '{}')
    } catch {}
    responseData.value = ''

    const file = await transformFile()
    const res = await window.electronAPI.invoke('fetch', {
        url: ruleForm.url,
        method: ruleForm.method,
        headers,
        params,
        data,
        file
    })
    close()
    try {
        // 返回数组则代表是文件上传
        if(Array.isArray(res)) return
        if(res.status >= 400) {
            responseData.value = `状态码：${res.status}，状态信息：${res.statusText || res.data}`
        }else if(typeof res.data == 'string') {
            responseData.value = res.data.replace(/\n/,'\r\n')
        }else{
            responseData.value = JSON.stringify(res.data, null, 4)
        }
    } catch {
        responseData.value = JSON.stringify(res, null, 4)
    }
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    fileList.value = []
}
</script>

<style scoped>
:deep(.el-upload-dragger) {
    --el-upload-dragger-padding-horizontal: 0px;

    width: 100%;
}
</style>