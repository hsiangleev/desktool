<template>
    <el-icon :size='props.size' :color='props.color' :icon-name='iconName'>
        <Icon :icon='"@eps:" + props.type' />
    </el-icon>
</template>
<script setup lang='ts'>
import { Icon } from '@iconify/vue'
import { ElIcon } from 'element-plus'
export interface IProps {
    size?: string | number
    color?: string
    type: string
}
const props = defineProps<IProps>()
const iconName = computed(() => props.type?.split(':')[1])
</script>