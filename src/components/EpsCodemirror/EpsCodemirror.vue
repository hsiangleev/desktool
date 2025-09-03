<template>
    <Codemirror
        v-if='isShow'
        ref='cmRef'
        v-bind='$attrs'
        v-model:value='modelValue'
        :options='cmOptions'
        border
        :height='height'
        :width='width'
        class='leading-5'
    />
</template>
<script lang="ts" setup>
import Codemirror from 'codemirror-editor-vue3'
import type { CmComponentRef } from 'codemirror-editor-vue3'
import type { EditorConfiguration } from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'  
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
defineOptions({ inheritAttrs: false })
export interface IProps {
    placeholder?: string
    width?: string | number
    height?: string | number
    model: string
    isReadonly?: boolean
    lineNumbers?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    lineNumbers: true
})
const modelValue = defineModel<string>({})

const isShow = ref(false)
onMounted(() => nextTick(() => setTimeout(() => {
    isShow.value = true
}, 0)))

const cmRef = ref<CmComponentRef>()
const cmOptions = computed<EditorConfiguration>(() => ({
    mode: props.model,
    extraKeys: { Ctrl: 'autocomplete' },
    theme: 'default',
    // 编辑器的左侧显示行号
    lineNumbers: props.lineNumbers,
    // 占位符
    placeholder: props.placeholder ?? '',
    // 自动关闭方括号和引号
    autoCloseBrackets: true,
    // 提示配置
    hintOptions: {
        // 自动匹配唯一值
        completeSingle: true
    },
    // 是否换行
    lineWrapping: true,
    gutters: props.lineNumbers ? ['CodeMirror-lint-markers'] : undefined,  
    lint: true,
    readOnly: !!props.isReadonly
}))

const refresh = computed(() => cmRef.value?.refresh)
const resize = computed(() => cmRef.value?.resize)
const destroy = computed(() => cmRef.value?.destroy)
const codeInstance = computed(() => cmRef.value?.cminstance)
/** 在光标处插入文本 */
const insert = async(text: string) => {
    if(typeof text !== 'string') return epsLogWarn('编辑器光标插入函数参数必须为字符串')
    const inst = codeInstance.value!
    const { line, ch } = inst.getCursor()
    const sel = inst.getSelection()
    inst.replaceSelection(text)
    await epsSleep(500)
    inst.focus()
    // 设置光标位置（当前位置-选中的长度+替换的长度）
    inst.setCursor({ line, ch: ch - sel.length + text.length + 3 })
}
defineExpose({
    refresh,
    resize,
    destroy,
    codeInstance,
    insert
})
</script>