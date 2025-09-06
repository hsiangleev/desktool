import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: ipcRenderer.invoke,
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener),
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args)
})