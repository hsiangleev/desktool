<template>
    <iframe v-if='isShow' :src='url' class='h-full w-full' frameborder='0' />
</template>
<script setup lang='ts'>

const isShow = ref(false)
const url = ref('')
onMounted(async() => {
    const prefix = import.meta.env.DEV
        ? '/plugin/pdfjs'
        : await window.electronAPI.invoke('getRootPath', 'plugin/pdfjs')

    url.value = `${prefix}/web/viewer.html`
    isShow.value = true
})
</script>