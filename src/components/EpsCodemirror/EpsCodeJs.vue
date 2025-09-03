<template>
    <EpsCodemirror
        ref='cmRef'
        v-model='modelValue'
        v-bind='$attrs'
        model='text/javascript'
        :placeholder='placeholder'
        :height='height'
        :width='width'
        :is-readonly='isReadonly'
        :line-numbers='lineNumbers'
    />
</template>
<script lang="ts" setup>
import EpsCodemirror from './EpsCodemirror.vue'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/hint/javascript-hint.js'
defineOptions({ inheritAttrs: false })
export interface IProps {
    placeholder?: string
    width?: string | number
    height?: string | number
    isReadonly?: boolean
    lineNumbers?: boolean
}
withDefaults(defineProps<IProps>(), {
    lineNumbers: true
})
const modelValue = defineModel<string>({})
  
const cmRef = ref()
const refresh = computed(() => cmRef.value?.refresh)
const resize = computed(() => cmRef.value?.resize)
const destroy = computed(() => cmRef.value?.destroy)
const codeInstance = computed(() => cmRef.value?.codeInstance)
const insert = computed(() => cmRef.value?.insert)

onUnmounted(() => {
    cmRef.value?.destroy()
})
defineExpose({
    refresh,
    resize,
    destroy,
    codeInstance,
    insert
})
</script>