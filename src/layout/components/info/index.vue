<template>
    <p
        v-if='!useStoreLayout.isCollapsed' 
        class='footer-color layout-nodrag w-full flex cursor-pointer items-center text-center text-xs tracking-wider'
        @click='dialogVisible=true'
    >
        <el-image class='layout-img' :src='logo' /> 
        <span>&nbsp;2025&nbsp;</span> 
        <el-text class='footer-color text-xs'>hsianglee</el-text>
        <!-- <span>&nbsp;开发维护</span> -->
    </p>

    
    <el-dialog
        v-model='dialogVisible'
        :title='`${appInfo.appName}`'
        width='400'
    >
        <div class='app-info'>
            <p>version: {{ appInfo.version.app }}</p>
            <p>electron: {{ appInfo.version.electron }}</p>
            <p>node: {{ appInfo.version.node }}</p>
            <p>chrome: {{ appInfo.version.chrome }}</p>
            <p>os: {{ `${appInfo.computer.platform} ${appInfo.computer.arch} ${appInfo.computer.release}` }}</p>
            <p>github: <el-text type='primary' class='cursor-pointer' @click='openUrl'>{{ appInfo.author.url }}</el-text></p>
        </div>
    </el-dialog>
</template>
<script setup lang='ts'>
import logo from '/favicon.ico'

const appInfo = ref<IObject>({})

const dialogVisible = ref(false)
onMounted(async() => {
    appInfo.value = await window.electronAPI.invoke('appInfo')
})

const openUrl = async() => {
    await window.electronAPI.invoke('openExternal', appInfo.value.author.url)
}
</script>

<style scoped>
    .layout-img{
        width: 12px;
        position: relative;
        top: 2px;
    }

    .footer-color{
        color: var(--aside-color);
    }

    .app-info {
        padding: 0 15px;

        p {
            margin: 0;
            font-size: 14px;
            color: #000;
        }
    }
</style>