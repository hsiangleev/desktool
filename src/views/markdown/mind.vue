<template>
    <div class='relative h-full w-full'>
        <div class='t-0 l-0 absolute flex items-center'>
            <input ref='openNodeRef' type='file' name='file' :accept='`.${currentImport}`' class='openNode hidden' @change='openNode'>
            <el-dropdown>
                <el-button type='default' plain size='small'><eps-icon type='ant-design:import-outlined' /> 导入</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click='importNode("xmind")'>xmind</el-dropdown-item>
                        <el-dropdown-item @click='importNode("json")'>json</el-dropdown-item>
                        <el-dropdown-item @click='importNode("md")'>md</el-dropdown-item>
                        <el-dropdown-item @click='importNode("smm")'>smm</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown>
                <el-button type='default' class='mx-3' plain size='small'><eps-icon type='ant-design:export-outlined' /> 导出</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click='exportNode("xmind")'>xmind</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("json")'>json</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("png")'>png</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("pdf")'>pdf</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("svg")'>svg</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("smm")'>smm</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("md")'>md</el-dropdown-item>
                        <el-dropdown-item @click='exportNode("txt")'>txt</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <el-button type='default' plain size='small' :disabled='isStart' @click='back'><eps-icon type='bi:arrow-left' /> 撤销</el-button>
            <el-button type='default' plain size='small' :disabled='isEnd' @click='forward'><eps-icon type='bi:arrow-right' /> 恢复</el-button>
            <el-button type='default' plain size='small' :disabled='activeNodes.length <= 0' @click='insertNode'><eps-icon type='ant-design:node-index-outlined' /> 同级节点</el-button>
            <el-button type='default' plain size='small' :disabled='activeNodes.length <= 0' @click='insertChildNode'><eps-icon type='ant-design:subnode-outlined' /> 子节点</el-button>
            <el-button type='default' plain size='small' :disabled='activeNodes.length <= 0' @click='deleteNode'><eps-icon type='ep:delete' /> 删除</el-button>
            <el-dropdown>
                <el-button type='default' class='mx-3' plain size='small'><eps-icon type='ant-design:arrow-down-outlined' /> 图表类型</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item 
                            v-for='v in layoutList'
                            :key='v.value'
                            :class='{"text-green-500": currentLayout === v.value}'
                            @click='changeLayout(v.value)'
                        >{{ v.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button type='default' plain size='small' @click='readDir'><eps-icon type='ant-design:node-collapse-outlined' /> 读取目录结构</el-button>
        </div>
        <div ref='mindRef' class='h-full w-full' />
    </div>
</template>
<script setup lang='ts'>
import MindMap from 'simple-mind-map'
import Export from 'simple-mind-map/src/plugins/Export.js'
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
import xmind from 'simple-mind-map/src/parse/xmind.js'
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'
MindMap.usePlugin(Export)
MindMap.usePlugin(ExportXMind)
MindMap.usePlugin(ExportPDF)

const mindRef = useTemplateRef('mindRef')
const openNodeRef = useTemplateRef('openNodeRef')
let mindMap = ref<MindMap>()
// 记录前进回退
const isStart = ref(true)
const isEnd = ref(true)
// 当前激活的节点列表
const activeNodes = shallowRef([])
const back = () => mindMap.value?.execCommand('BACK')
const forward = () => mindMap.value?.execCommand('FORWARD')
const insertNode = () => mindMap.value?.execCommand('INSERT_NODE')
const insertChildNode = () => mindMap.value?.execCommand('INSERT_CHILD_NODE')
const deleteNode = () => mindMap.value?.execCommand('REMOVE_NODE')
const openNode = async(event: any) => {
    if(!currentImport.value) return
    const [file] = event.target.files
    if (!file) return
    if(currentImport.value === 'xmind') {
        const data = await xmind.parseXmindFile(file)
        mindMap.value?.setData(data)
        mindMap.value?.view.reset()
        return
    }
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = async() => {
        const data = reader.result as any
        if(currentImport.value === 'md') {
            const d = await markdown.transformMarkdownTo(data)
            mindMap.value?.setData(d)
            mindMap.value?.view.reset()
            return
        }
        if(currentImport.value === 'json' || currentImport.value === 'smm') {
            try {
                const json = JSON.parse(data)
                if (json.root) {
                    mindMap.value?.setFullData(json)
                } else {
                    mindMap.value?.setData(json)
                }
                mindMap.value?.view.reset()
            } catch (e) {
                console.error('JSON 解析失败：', e)
            }
        }
    }
}
const currentImport = ref('')
const importNode = async(v: string) => {
    currentImport.value = v
    await nextTick()
    openNodeRef.value?.click()
}
const changeLayout = (v: string) => {
    currentLayout.value = v
    mindMap.value?.setLayout(v)
}
const exportNode = (v: string) => mindMap.value?.export(v, true, '思维导图')

const readDir = async() => {
    const { close } = await epsLayerLoading()
    try {
        const dir = await window.electronAPI.invoke('sellectDir')
        if(!dir) return void close()
        const { data, index } = await window.electronAPI.invoke('readDirTreeMind', dir)
        mindMap.value?.setData(data)
        mindMap.value?.view.reset()
        if(index >= 500) {
            epsLayerMsg('文件数量已超出500，只读取前500个', 'warning')
        }
    } catch {}
    close()
}

onMounted(() => {
    mindMap.value = new MindMap({
        el: mindRef.value!,
        layout: currentLayout.value,
        mousewheelAction: 'zoom',
        data: {
            data: {
                text: '根节点'
            },
            children: []
        }
    } as any)
    
    // 监听节点激活事件
    mindMap.value.on('node_active', (_: any, nodeList: any) => {
        activeNodes.value = nodeList
    })
  
    // 前进回退事件
    mindMap.value.on('back_forward', (index: number, len: number) => {
        isStart.value = index <= 0
        isEnd.value = index >= len - 1
    })
    mindMap.value.setThemeConfig({
        backgroundColor: '#ffffff',
        // 连线的颜色
        lineColor: '#35b398',
        lineStyle: 'curve',
        lineWidth: 2,
        // 概要连线的粗细
        generalizationLineWidth: 2,
        // 概要连线的颜色
        generalizationLineColor: '#21c384',
        // 关联线默认状态的颜色
        associativeLineColor: '#21c384',
        // 关联线文字颜色
        associativeLineTextColor: '#4d754b',
        // 关联线激活状态的颜色
        associativeLineActiveColor: '#f5ffe6',
        // 根节点样式
        root: {
            fillColor: '#21c384',
            color: '#fff',
            borderColor: '',
            borderWidth: 0,
            fontSize: 24
        },
        // 二级节点样式
        second: {
            fillColor: '#f5ffe6',
            color: '#386437',
            borderColor: '#35b398',
            borderWidth: 2,
            fontSize: 18
        },
        // 三级及以下节点样式
        node: {
            fontSize: 14,
            color: '#326032'
        },
        // 概要节点样式
        generalization: {
            fontSize: 14,
            fillColor: '#21c384',
            borderColor: '',
            borderWidth: 0,
            color: '#fff'
        }
    })
})

const currentLayout = ref('mindMap')
const layoutList = ref([
    { label: '思维导图', value: 'mindMap' },
    { label: '逻辑结构图', value: 'logicalStructure' },
    { label: '组织结构图', value: 'organizationStructure' },
    { label: '目录组织图', value: 'catalogOrganization' },
    { label: '时间轴', value: 'timeline' },
    { label: '时间轴2', value: 'timeline2' },
    { label: '鱼骨图', value: 'fishbone' },
    { label: '竖向时间轴', value: 'verticalTimeline' }
])
</script>

<style scoped>
:deep(.smm-mind-map-container > svg) {
    width: 100%;
    height: 100%;
}
</style>