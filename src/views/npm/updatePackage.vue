<template>
    <div class='h-full flex'>
        <el-card class='h-full w-1/2' shadow='never'>
            <el-form ref='ruleFormRef' :model='form' :rules='rules' label-width='100px'>
                <el-form-item label='根目录' prop='rootPath'>
                    <EpsSelectDir v-model='form.rootPath' type='updatePackage' @change='changeRootPath' />
                </el-form-item>
                <el-form-item label='选择分支' prop='branch'>
                    <el-select v-model='form.branch' :options='epsBranchOptions' placeholder='请选择分支' />
                </el-form-item>
                <el-form-item label='选择项目' prop='project'>
                    <el-select v-model='form.project' :options='projectOptions' multiple placeholder='请选择项目' clearable />
                </el-form-item>
                <el-form-item label='选择更新包' prop='package'>
                    <el-select v-model='form.package' :options='epsPackageOptions' multiple placeholder='请选择更新包' clearable @change='packageChange' />
                </el-form-item>
                <el-form-item
                    v-for='(v,i) in form.selectPackage'
                    :key='v.name'
                    :label='v.name' 
                    :prop='`selectPackage.${i}.version`'
                    :rules='{
                        required: true,
                        message: `${v.name}不能为空`
                    }'
                >
                    <el-input v-model='v.version' placeholder='请输入需要更新的版本包' clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='submitForm(ruleFormRef)'>更新</el-button>
                    <el-button @click='resetForm(ruleFormRef)'>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class='h-full w-1/2'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>
    </div>
</template>
<script setup lang='ts'>
import type { FormInstance, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

class IForm {
    rootPath = ''
    branch = ''
    project: string[] = []
    package: string[] = []
    selectPackage: {name: string, version: string}[] = []
}
const form = reactive(new IForm())
const codeRef = ref()
const log = ref('')
const ruleFormRef = ref()
const packageChange = () => form.selectPackage = form.package.map(v => ({ name: v, version: '' }))

const projectOptions = ref([])
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    rootPath: { required: true, message: '项目根目录不能为空' },
    branch: { required: true, message: '分支不能为空' },
    project: { required: true, message: '项目不能为空' },
    package: { required: true, message: '更新包不能为空' }
})

const changeRootPath = async() => {
    projectOptions.value = []
    log.value = ''
    projectOptions.value = await loadProject(form.rootPath)
}

window.electronAPI.on('updatePackage', (_, res) => codeRef.value?.appendText(res))
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    try {
        await epsLayerConfirm('确认是否更新？', 'warning')
        log.value = '开始更新'
        await window.electronAPI.invoke('updatePackage', {
            dirList: form.project.map(v => v),
            packages: form.selectPackage.map(v => `${v.name}@${v.version}`),
            branch: form.branch
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