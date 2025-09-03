import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: ipcRenderer.invoke,
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener),
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
    // 除函数之外，我们也可以暴露变量
})