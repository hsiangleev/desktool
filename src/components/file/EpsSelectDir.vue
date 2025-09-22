<template>
    <el-input v-model='dir' readonly :placeholder='`${props.placeholder}`'>
        <template #append><div class='cursor-pointer' @click='sellectDir'>{{ text }}</div></template>
    </el-input>
</template>
<script setup lang='ts'>
interface IProps {
    type?: string
    placeholder?: string
    channel?: string
    text?: string
}
const props = withDefaults(defineProps<IProps>(), {
    placeholder: '请选择文件夹',
    channel: 'sellectDir',
    text: '选择文件夹'
})
const { getLocal, setLocal } = epsLocal()
const rootPath = reactive(getLocal<IObject>('rootPath') ?? {})

const dir = defineModel<string>({ required: true })
const emit = defineEmits(['change'])
const sellectDir = async() => {
    dir.value = await window.electronAPI.invoke(props.channel)
    emit('change', dir.value)
    if(!props.type) return
    await epsSleep(0)
    rootPath[props.type] = dir.value
    setLocal('rootPath', rootPath)
}

onMounted(() => {
    if(props.type && dir.value === '') {
        dir.value = rootPath[props.type] ?? ''
    }
})
</script>