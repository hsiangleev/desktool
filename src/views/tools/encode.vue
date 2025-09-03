<template>
    <el-card class='min-h-full'>
        <el-form ref='ruleFormRef' :model='form' label-width='60px'>
            <el-tabs model-value='base64'>
                <el-tab-pane label='base64' name='base64'>
                    <el-form-item label='加密' prop='base64Encode'>
                        <el-input v-model='form.base64Encode' placeholder='请输入要加密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='base64Encode'>加密</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='解密' prop='base64Decode'>
                        <el-input v-model='form.base64Decode' placeholder='请输入要解密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='base64Decode'>解密</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label='url' name='url'>
                    <el-form-item label='加密' prop='urlEncode'>
                        <el-input v-model='form.urlEncode' placeholder='请输入要加密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='urlEncode'>加密</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='解密' prop='urlDecode'>
                        <el-input v-model='form.urlDecode' placeholder='请输入要解密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='urlDecode'>解密</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label='rsa' name='rsa'>
                    <el-form-item>
                        <el-select v-model='form.keyLen' placeholder='Select' class='mr-4 w-30'>
                            <el-option label='512' value='512' />
                            <el-option label='1024' value='1024' />
                            <el-option label='2048' value='2048' />
                            <el-option label='4096' value='4096' />
                        </el-select>
                        <el-button type='primary' plain @click='genKey'>生成公私钥</el-button>
                    </el-form-item>
                    <el-form-item label='公钥' prop='rsaPublic'>
                        <el-input v-model='form.rsaPublic' type='textarea' :rows='5' clearable />
                    </el-form-item>
                    <el-form-item label='私钥' prop='rsaPrivate'>
                        <el-input v-model='form.rsaPrivate' type='textarea' :rows='8' clearable />
                    </el-form-item>
                    <el-form-item label='加密' prop='rsaEncode'>
                        <el-input v-model='form.rsaEncode' placeholder='请输入要加密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='rsaEncode'>加密</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='解密' prop='rsaDecode'>
                        <el-input v-model='form.rsaDecode' placeholder='请输入要解密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='rsaDecode'>解密</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>
<script setup lang='ts'>
import JSEncrypt from 'jsencrypt'
const form = reactive({
    base64Encode: '',
    base64Decode: '',
    urlEncode: '',
    urlDecode: '',
    rsaEncode: '',
    rsaDecode: '',
    rsaPublic: '',
    rsaPrivate: '',
    keyLen: '1024'
})

const base64Encode = async() => {
    const { close } = await epsLayerLoading()
    form.base64Decode = await window.electronAPI.invoke('base64Encode', form.base64Encode)
    close()
}

const base64Decode = async() => {
    const { close } = await epsLayerLoading()
    form.base64Encode = await window.electronAPI.invoke('base64Decode', form.base64Decode)
    close()
}

const urlEncode = async() => {
    form.urlDecode = encodeURIComponent(form.urlEncode)
}

const urlDecode = async() => {
    form.urlEncode = decodeURIComponent(form.urlDecode)
}

const genKey = async() => {
    const { close } = await epsLayerLoading()
    const crypt = new JSEncrypt({ default_key_size: form.keyLen })
    form.rsaPrivate = crypt.getPrivateKey()
    form.rsaPublic = crypt.getPublicKey()
    close()
}
const rsaEncode = async() => {
    const { close } = await epsLayerLoading()
    const crypt = new JSEncrypt()
    crypt.setPublicKey(form.rsaPublic)
    form.rsaDecode = crypt.encrypt(form.rsaEncode) as string
    close()
}

const rsaDecode = async() => {
    const { close } = await epsLayerLoading()
    const crypt = new JSEncrypt()
    crypt.setPrivateKey(form.rsaPrivate)
    form.rsaEncode = crypt.decrypt(form.rsaDecode) as string
    close()
}
</script>