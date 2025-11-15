<template>
    <div class='min-h-full'>
        <el-form ref='ruleFormRef' :model='form' label-width='80px' @submit.prevent>
            <el-tabs model-value='base64'>
                <el-tab-pane label='base64' name='base64'>
                    <el-form-item label='明文' prop='base64Encode'>
                        <el-input v-model='form.base64Encode' placeholder='请输入要编码的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='base64Encode'>编码</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='密文' prop='base64Decode'>
                        <el-input v-model='form.base64Decode' placeholder='请输入要解码的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='base64Decode'>解码</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label='url' name='url'>
                    <el-form-item label='明文' prop='urlEncode'>
                        <el-input v-model='form.urlEncode' placeholder='请输入要编码的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='urlEncode'>编码</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='密文' prop='urlDecode'>
                        <el-input v-model='form.urlDecode' placeholder='请输入要解码的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='urlDecode'>解码</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label='aes' name='aes'>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='运算模式' prop='aesMode' class='w-full'>
                                <el-select v-model='form.aesMode' placeholder='Select'>
                                    <el-option label='ECB' value='ECB' />
                                    <el-option label='CBC' value='CBC' />
                                    <el-option label='CFB' value='CFB' />
                                    <el-option label='CTR' value='CTR' />
                                    <el-option label='CTRGladman' value='CTRGladman' />
                                    <el-option label='OFB' value='OFB' />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='填充模式' prop='aesPadding' class='w-full'>
                                <el-select v-model='form.aesPadding' placeholder='Select'>
                                    <el-option label='Pkcs7' value='Pkcs7' />
                                    <el-option label='AnsiX923' value='AnsiX923' />
                                    <el-option label='Iso10126' value='Iso10126' />
                                    <el-option label='Iso97971' value='Iso97971' />
                                    <el-option label='ZeroPadding' value='ZeroPadding' />
                                    <el-option label='NoPadding' value='NoPadding' />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span='12'>
                            <el-form-item label='密钥' prop='aesKey'>
                                <el-input v-model='form.aesKey' placeholder='请输入密钥' clearable />
                            </el-form-item>
                        </el-col>
                        <el-col v-if='form.aesMode !== "ECB"' :span='12'>
                            <el-form-item label='偏移' prop='aesIv'>
                                <el-input v-model='form.aesIv' placeholder='请输入偏移' clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item label='明文' prop='aesEncode'>
                                <el-input v-model='form.aesEncode' class='h-30' type='textarea' placeholder='请输入要加密的字符串' clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item label='密文' prop='aesDecode'>
                                <el-input v-model='form.aesDecode' class='h-30' type='textarea' placeholder='请输入要解密的字符串' clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item>
                                <el-button type='primary' @click='aesEncode'>加密</el-button>
                                <el-button type='success' @click='aesDecode'>解密</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                    <el-form-item label='明文' prop='rsaEncode'>
                        <el-input v-model='form.rsaEncode' placeholder='请输入要加密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='rsaEncode'>加密</div></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='密文' prop='rsaDecode'>
                        <el-input v-model='form.rsaDecode' placeholder='请输入要解密的字符串' clearable>
                            <template #append><div class='cursor-pointer' @click='rsaDecode'>解密</div></template>
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>
<script setup lang='ts'>
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'
const form = reactive({
    base64Encode: '',
    base64Decode: '',
    urlEncode: '',
    urlDecode: '',
    rsaEncode: '',
    rsaDecode: '',
    rsaPublic: '',
    rsaPrivate: '',
    keyLen: '1024',

    aesKey: '1234567890abcdef',
    aesIv: 'abcdef9876543210',
    aesMode: 'ECB',
    aesPadding: 'Pkcs7',
    aesEncode: '',
    aesDecode: ''
})

const base64Encode = async() => {
    const { close } = await epsLayerLoading()
    try {
        form.base64Decode = await window.electronAPI.invoke('base64Encode', form.base64Encode)
    } catch {}
    close()
}

const base64Decode = async() => {
    const { close } = await epsLayerLoading()
    try {
        form.base64Encode = await window.electronAPI.invoke('base64Decode', form.base64Decode)
    } catch {}
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
    try {
        const crypt = new JSEncrypt({ default_key_size: form.keyLen })
        form.rsaPrivate = crypt.getPrivateKey()
        form.rsaPublic = crypt.getPublicKey()
    } catch {}
    close()
}
const rsaEncode = async() => {
    const { close } = await epsLayerLoading()
    try {
        const crypt = new JSEncrypt()
        crypt.setPublicKey(form.rsaPublic)
        form.rsaDecode = crypt.encrypt(form.rsaEncode) as string
    } catch {}
    close()
}

const rsaDecode = async() => {
    const { close } = await epsLayerLoading()
    try {
        const crypt = new JSEncrypt()
        crypt.setPrivateKey(form.rsaPrivate)
        form.rsaEncode = crypt.decrypt(form.rsaDecode) as string
    } catch {}
    close()
}

const aesEncode = async() => {
    if(!form.aesKey) return epsLayerMsg('密钥不能为空', 'warning')
    const key = CryptoJS.enc.Utf8.parse(form.aesKey)
    let iv
    if(form.aesMode !== 'ECB') {
        if(!form.aesIv) return epsLayerMsg('偏移不能为空', 'warning')
        iv = form.aesIv ? CryptoJS.enc.Utf8.parse(form.aesIv) : undefined
    }
    try {
        const encrypted = CryptoJS.AES.encrypt(form.aesEncode, key, {
            iv,
            mode: (CryptoJS.mode as any)[form.aesMode],
            padding: (CryptoJS.pad as any)[form.aesPadding]
        })
        form.aesDecode = encrypted.toString()
    } catch (error:any) {
        epsLayerMsg(`加密失败：${error.toString()}`, 'warning')
    }
}

const aesDecode = async() => {
    if(!form.aesKey) return epsLayerMsg('密钥不能为空', 'warning')
    const key = CryptoJS.enc.Utf8.parse(form.aesKey)
    let iv
    if(form.aesMode !== 'ECB') {
        if(!form.aesIv) return epsLayerMsg('偏移不能为空', 'warning')
        iv = form.aesIv ? CryptoJS.enc.Utf8.parse(form.aesIv) : undefined
    }
    try {
        const decrypted = CryptoJS.AES.decrypt(form.aesDecode, key, {
            iv,
            mode: (CryptoJS.mode as any)[form.aesMode],
            padding: (CryptoJS.pad as any)[form.aesPadding]
        })
        form.aesEncode = decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error:any) {
        epsLayerMsg(`解密失败：${error.toString()}`, 'warning')
    }
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
    height: 100%;
}
</style>