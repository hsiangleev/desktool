import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: ipcRenderer.invoke,
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener),
    minimize: () => ipcRenderer.send('window-control', 'minimize'),
    maximize: () => ipcRenderer.send('window-control', 'maximize'),
    close: () => ipcRenderer.send('window-control', 'close')
})