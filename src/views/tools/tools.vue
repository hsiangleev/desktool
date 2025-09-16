<template>
    <div class='min-h-full'>
        <el-form ref='ruleFormRef' :model='form' label-width='100px' @submit.prevent>
            <el-form-item label='生成guid' prop='guid'>
                <el-input v-model='form.guid' readonly placeholder='guid'>
                    <template #append><div class='cursor-pointer' @click='genGuid'>生成</div></template>
                </el-input>
            </el-form-item>
            <el-form-item label='telnet' prop='telnet'>
                <el-input v-model='form.telnetIp' placeholder='请输入IP' class='w-3/5' clearable />
                <el-input v-model='form.telnetPort' placeholder='请输入端口' class='w-2/5' clearable>
                    <template #append><div class='cursor-pointer' @click='testTelnet'>测试</div></template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang='ts'>
const form = reactive({
    guid: '',
    telnetIp: '127.0.0.1',
    telnetPort: '8080',
    base64Encode: '',
    base64Decode: ''
})

const genGuid = async() => {
    const { close } = await epsLayerLoading()
    form.guid = await window.electronAPI.invoke('guid')
    close()
}

const testTelnet = async() => {
    const { close } = await epsLayerLoading()
    const { type, msg } = await window.electronAPI.invoke('telnet', { host: form.telnetIp, port: form.telnetPort })
    epsLayerMsg(msg, type)
    close()
}
</script>