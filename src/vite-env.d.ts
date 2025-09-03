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
    }
}