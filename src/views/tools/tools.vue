<template>
    <el-card class='h-full'>
        <el-form ref='ruleFormRef' :model='form' label-width='100px'>
            <el-form-item label='生成guid' prop='guid'>
                <el-input v-model='form.guid' readonly placeholder='guid'>
                    <template #append><div class='cursor-pointer' @click='genGuid'>生成</div></template>
                </el-input>
            </el-form-item>
            <el-form-item label='telnet' prop='telnet'>
                <el-input v-model='form.telnetIp' placeholder='请输入IP' class='w-3/4' />
                <el-input v-model='form.telnetPort' placeholder='请输入端口' class='w-1/4'>
                    <template #append><div class='cursor-pointer' @click='testTelnet'>测试</div></template>
                </el-input>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang='ts'>
const form = reactive({
    guid: '',
    telnetIp: '127.0.0.1',
    telnetPort: '8080'
})

const genGuid = async() => {

}

const testTelnet = async() => {

}
</script>