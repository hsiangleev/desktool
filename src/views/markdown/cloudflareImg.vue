<template>
    <div class='eps-card-flex h-full' shadow='never'>
        <el-form ref='ruleFormRef' :model='form' label-width='100px' :rules='rules' @submit.prevent>
            <el-form-item label='图床目录' prop='rootPath'>
                <EpsSelectDir v-model='form.rootPath' placeholder='请选择一个本地文件夹作为图床目录' />
            </el-form-item>
            <el-form-item label='上传图片' prop='imgPath'>
                <EpsSelectDir v-model='form.imgPath' channel='selFileImg' placeholder='请选择一个本地图片' text='选择图片' />
            </el-form-item>
            <el-form-item prop='prefix' label='图片前缀名'>
                <el-input v-model='form.prefix' placeholder='请输入保存的图片前缀名称' />
            </el-form-item>
            <el-form-item prop='projectName' label='项目名称'>
                <el-input v-model='form.projectName' placeholder='请输入cloudflare pages的项目名称' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item prop='domain' label='自定义域名'>
                <el-input v-model='form.domain' placeholder='请输入自定义域名' @keyup.enter='submitForm(ruleFormRef)' />
            </el-form-item>
            <el-form-item>
                <el-button type='primary' plain title='发布到cloudflare' @click='submitForm(ruleFormRef)'>发布</el-button>
                <el-button type='success' :disabled='!form.imgPath' plain title='从本地其他文件夹复制文件' @click='uploadFile()'>上传图片</el-button>
                <el-button type='success' plain title='从剪贴板中保存图片' @click='saveImgByClipboard()'>剪贴板</el-button>
                <el-button type='info' plain @click='dialogVisible=true'>使用说明</el-button>
            </el-form-item>
        </el-form>
        <el-divider border-style='dashed'>日志</el-divider>
        <div class='content-log'><EpsCodeJs ref='codeRef' v-model='log' is-readonly class='res-log' /></div>

        <el-dialog
            v-model='dialogVisible'
            title='使用说明'
            width='500'
        >
            <div class='tip custom-block'>
                <p>1. 上传本地的某一张图片(自动重命名为当前时间)到图床目录，然后发布到cloudflare pages，通过自定义域名生成完整预览地址</p>
                <p>2. 安装wrangler, npm install -g wrangler</p>
                <p>3. 登录wrangler, wrangler login</p>
                <p>4. 在 cloudflare 的 Workers 和 Pages中创建一个pages，并添加项目名称</p>
            </div>
            <template #footer>
                <div class='dialog-footer'>
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
class IForm {
    rootPath = ''
    imgPath = ''
    projectName = ''
    domain = ''
    prefix = ''
}
const form = reactive(getLocal<IForm>('cloudflareImg') ?? new IForm())
const log = ref('')
const dialogVisible = ref(false)

const ruleFormRef = ref()
const rules = ref<Partial<Record<string, Arrayable<FormItemRule>>>>({
    rootPath: { required: true, message: '目录不能为空' },
    projectName: { required: true, message: '项目名称不能为空' }
})
const codeRef = ref()
window.electronAPI.on('cloudflareImg', (_, res) => {
    codeRef.value?.appendText(res)
})
const submitForm = async(formEl: FormInstance | undefined) => {
    if(!await epsFormSubmit(formEl)) return
    log.value = ''
    const res = await window.electronAPI.invoke('cloudflareImg', { rootPath: form.rootPath, projectName: form.projectName })
    setLocal('cloudflareImg', form)
    if(res.code === 0 && imgResUrl.value.length > 0 && form.domain) {
        imgResUrl.value.forEach(v => {
            const url = `${form.domain.endsWith('/') ? form.domain : `${form.domain}/`}${v}`
            codeRef.value?.appendText(`上传图片预览地址: ${url}`)
            codeRef.value?.appendText(`![](${url})`)
        })
    }
}
const imgResUrl = ref<string[]>([])
const uploadFile = async() => {
    if(!form.imgPath || !form.rootPath) return
    const res = await window.electronAPI.invoke('copyFileImgTime', { sourcePath: form.imgPath, destDir: form.rootPath, prefix: form.prefix })
    log.value = res.msg
    if(res.code === 0) imgResUrl.value.push(res.data)
}
const saveImgByClipboard = async() => {
    if(!form.rootPath) return
    const res = await window.electronAPI.invoke('saveImgByClipboard', { destDir: form.rootPath, prefix: form.prefix })
    log.value = res.msg
    if(res.code === 0) imgResUrl.value.push(res.data)
}
</script>

<style scoped>
.content-log {
    height: calc(100% - 350px);
}

.custom-block.tip {
    width: 100%;
    background-color: rgb(64 158 255 / 10%);
    padding: 8px 16px;
    border-radius: 4px;
    border-left: 5px solid var(--el-color-primary);
}

.custom-block p:not(.custom-block-title) {
    font-size: 12px;
    margin: 0;
}
</style>