<template>
    <div ref='xtermjs' class='h-full' />
</template>
<script setup lang='ts'>
import { Terminal } from '@xterm/xterm'
import { FitAddon } from 'xterm-addon-fit'
import '@xterm/xterm/css/xterm.css'

interface IProps {
    disabled?: boolean
}
const props = defineProps<IProps>()

let term: Terminal | null = null
let fitAddon: FitAddon
const xtermRef = useTemplateRef('xtermjs')

onMounted(() => {
    term = new Terminal({
        convertEol: true,
        cursorBlink: !props.disabled,
        cursorStyle: 'block',
        theme: {
            background: '#555', // 背景色
            foreground: '#0f0' // 字体颜色
        },
        fontFamily: 'Consolas, "Microsoft YaHei Mono"',
        fontSize: 14,
        fontWeight: 300,
        fontWeightBold: 300
    })
    fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    xtermRef.value && term.open(xtermRef.value)
    fitAddon.fit()
    // 监听用户输入
    term.onData(data => term?.write(data))
    term.attachCustomKeyEventHandler(() => {
        // 禁止所有键盘输入
        return !props.disabled
    })
    window.addEventListener('resize', handleResize)
})
const handleResize = () => fitAddon && fitAddon.fit()

onActivated(() => handleResize())
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    term && term.dispose()
})

defineExpose({
    appendText: (data: string | Uint8Array, callback?: () => void) => term && term.writeln(data, callback),
    insert: (data: string | Uint8Array, callback?: () => void) => {
        if(!term) return
        term.clear()
        term.writeln(data, callback)
    },
    clear: () => term && term.clear()
})
</script>