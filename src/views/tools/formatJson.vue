<template>
    <div class='h-full flex'>
        <div class='eps-card-flex h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' class='h-full' :model='ruleForm' :rules='rules' label-width='80px' @submit.prevent>
                <el-form-item label='json内容' prop='json' class='json-content'>
                    <EpsCodeJs v-model='ruleForm.json' class='h-full' placeholder='请输入要格式化的json内容' />
                </el-form-item>
                <el-form-item label='空格个数' prop='space'>
                    <el-input-number v-model='ruleForm.space' class='w-full' :min='1' :max='6' controls-position='right' placeholder='请输入请求地址' @keyup.enter='submitForm(ruleFormRef)' />
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='submitForm(ruleFormRef)'>格式化</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='h-full w-1/2'><EpsCodeJs ref='codeRef' v-model='responseData' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
const responseData = ref('')
class IForm {
    json = ''
    space = 2
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<IForm>(new IForm())
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
    json: [{ required: true, validator: (_: any, value: any, callback: any) => callback(checkJson(value)), trigger: 'blur' }]
})
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    responseData.value = JSON.stringify(JSON.parse(ruleForm.json), null, ruleForm.space)
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    responseData.value = ''
}
</script>

<style scoped>
    .json-content {
        height: calc(100% - 120px);
    }
</style>