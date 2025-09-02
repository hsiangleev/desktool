<template>
    <div />
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const newPath = route.fullPath.replace(new RegExp(`^${epsPathRedirect}`), '')
router.replace(newPath)

</script>