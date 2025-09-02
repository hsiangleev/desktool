<template>
    <el-sub-menu 
        v-if='props.menu.meta.menuType === 1 && props.menu.children && props.menu.children.length > 0'
        :key='props.menu.path'
        :index='props.menu.path'
    >
        <template #title>
            <eps-icon v-if='props.menu.meta.icon' :type='props.menu.meta.icon' />
            <span>{{ props.menu.meta.menuName }}</span>
        </template>
        <MenuItem v-for='v in props.menu.children' :key='v.path' :menu='v' :index='v.path' />
    </el-sub-menu>

    <el-menu-item
        v-else
        :key='props.menu.id'
        :index='props.menu.path'
    >
        <eps-icon v-if='props.menu.meta.icon' :type='props.menu.meta.icon' />
        <template #title>
            {{ props.menu.meta.menuName }}
        </template>
    </el-menu-item>
</template>
<script setup lang='ts'>
import type { IMenu } from '@/data/menu'

interface IProps {
    menu: IMenu
}
const props = defineProps<IProps>()
</script>