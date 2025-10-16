<template>
    <MdEditor
        v-if='isShow'
        v-model='text'
        class='markdown-edit'
        :toolbars='toolbars' 
        no-upload-img
        @on-save='onSave'
    >
        <template #defToolbars>
            <button class='md-editor-toolbar-item' title='打开markdown文件' type='button' @click='openMdFile'>
                <eps-icon class='my-editor-icon' type='ant-design:file-markdown-outlined' />
            </button>
            <ExportPDF :model-value='text' height='80%' />
            <Emoji>
                <template #trigger><eps-icon class='my-editor-icon' type='bi:emoji-smile' /></template>
            </Emoji>
            <button class='md-editor-toolbar-item' :title='isShowExample ? "切换文本" : "切换示例"' type='button' @click='openExample'>
                <eps-icon class='my-editor-icon' type='bi:view-list' />
            </button>
        </template>
    </MdEditor>
</template>

<script setup>
import { MdEditor, config } from 'md-editor-v3'
import { ExportPDF, Emoji } from '@vavt/v3-extension'
import 'md-editor-v3/lib/style.css'
import '@vavt/v3-extension/lib/asset/style.css'
 
const isShow = ref(false)
onMounted(async() => {
    const prefix = import.meta.env.DEV
        ? '/plugin/md-editor-v3'
        : await window.electronAPI.invoke('getRootPath', 'plugin/md-editor-v3')

    config({
        editorExtensions: {
            screenfull: { js: `${prefix}/screenfull.js` },
            highlight: { js: `${prefix}/highlight.min.js`, css: { atom: { dark: `${prefix}/atom-one-dark.min.css` } } },
            katex: { js: `${prefix}/katex.min.js`, css: `${prefix}/katex.min.css` },
            mermaid: { js: `${prefix}/mermaid.min.js` },
            echarts: { js: `${prefix}/echarts.min.js` },
            prettier: {
                standaloneJs: `${prefix}/standalone.js`,
                parserMarkdownJs: `${prefix}/markdown.js`
            }
        }
    })
    isShow.value = true
})

const openMdFile = async() => {
    const { close } = epsLayerLoading('打开中...')
    const res = await window.electronAPI.invoke('openMdFile')
    close()
    if(res.code !== 0) return epsLayerMsg(res.msg, 'warning')
    text.value = res.data
}
const onSave = async() => {
    const { close } = epsLayerLoading('保存中...')
    const res = await window.electronAPI.invoke('saveMdFile', text.value)
    epsLayerMsg(res.msg, res.code === 0 ? 'success' : 'warning')
    close()
}

const toolbars = ref([
    0,
    'save',
    1,
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    '-',
    'title',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    2,
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    3,
    '=',
    'prettier',
    // 'pageFullscreen',
    'fullscreen',
    'preview',
    'previewOnly',
    'htmlPreview',
    'catalog'
    // 'github'
])

const text = ref('')
const isShowExample = ref(false)
const temp = ref('')
const openExample = () => {
    if(!isShowExample.value) {
        temp.value = text.value
        text.value = example.value
        isShowExample.value = true
    }else{
        text.value = temp.value
        temp.value = ''
        isShowExample.value = false
    }
}
const example = ref(`## 😲 md-editor-v3

Markdown 编辑器，vue3 版本，使用 jsx 模板 和 typescript 开发，支持切换主题、prettier 美化文本等。

### 🤖 基本演示

**加粗**，<u>下划线</u>，_斜体_，~~删除线~~，上标^26^，下标~1~，\`inline code\`，[超链接](https://github.com/imzbf)

> 引用：《I Have a Dream》

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

- [ ] 周五
- [ ] 周六
- [x] 周天

![图片](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

## 🤗 代码演示

\`\`\`vue
<template>
  <MdEditor v-model="text" />
</template>

<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('Hello Editor!');
<\/script>
\`\`\`

## 🖨 文本演示

依照普朗克长度这项单位，目前可观测的宇宙的直径估计值（直径约 930 亿光年，即 8.8 × 10^26^ 米）即为 5.4 × 10^61^倍普朗克长度。而可观测宇宙体积则为 8.4 × 10^184^立方普朗克长度（普朗克体积）。

## 📈 表格演示

| 表头 1 |  表头 2  | 表头 3 |
| :----- | :------: | -----: |
| 左对齐 | 中间对齐 | 右对齐 |

## 📏 公式

行内：$x+y^{2x}$

$$
\sqrt[3]{x}
$$

## 🧬 图表

mermaid

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

echarts

\`\`\`echarts
{
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}
\`\`\`

## 🪄 提示

!!! note 支持的类型

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

## ☘️ 占个坑@！

没了
`)
</script>

<style scoped>
.markdown-edit {
    height: 100%;
}

.my-editor-icon{
    width: 16px;
    height: 16px;
    padding: 4px;
    fill: none;
    overflow: hidden;
    display: block;
    box-sizing: content-box;
    font-size: 16px;
}

:deep(.emojis li) {
    height: 28px;
    line-height: 20px;
}
</style>