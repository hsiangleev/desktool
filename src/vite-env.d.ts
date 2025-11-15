// / <reference types="vite/client" />

type IComponent<T = any> = ReturnType<typeof defineComponent> | (() => Promise<T>)

interface IObject<T = any> {
    [index: string]: T
}
interface ISelect {
    value: string | number
    label: string
}

declare interface Window {
    electronAPI: {
        invoke: (channel: string, ...args: any[]) => Promise<any>
        on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer
        send: (channel: string, ...args: any[]) => void
    }
}

declare module 'simple-mind-map/src/plugins/Export.js'
declare module 'simple-mind-map/src/parse/xmind.js'
declare module 'simple-mind-map/src/plugins/ExportXMind.js'
declare module 'simple-mind-map/src/plugins/ExportPDF.js'
declare module 'simple-mind-map/src/parse/markdown.js'