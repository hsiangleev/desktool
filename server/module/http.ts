import { BrowserWindow, ipcMain } from 'electron'
import axios from 'axios'
import { useTelnetTest } from '~/tools/tools'
import crypto from 'crypto'
import { useHttpServe, useHttpServeClose, useWebsocket, useWebsocketClose } from '~/tools/websocket'

export const useHttp = (win: BrowserWindow) => {
    ipcMain.handle('fetch', async(_, req) => {
        const { url, method, params, data, headers } = req
        const res = await request({ url, method, params, data, headers })
        return res.data
    })

    ipcMain.handle('telnet', async(_, req) => {
        return useTelnetTest(req.host, req.port)
    })

    ipcMain.handle('guid', async() => {
        return crypto.randomUUID()
    })

    ipcMain.handle('setFullScreen', async() => {
        win.setFullScreen(!win.isFullScreen())
    })

    ipcMain.handle('base64Encode', async(_, str: string) => {
        return Buffer.from(str, 'utf-8').toString('base64')
    })

    ipcMain.handle('base64Decode', async(_, str: string) => {
        return Buffer.from(str, 'base64').toString('utf-8')
    })

    ipcMain.handle('connectWebsocket', async(_, req) => {
        const { ip, isBase64 } = req
        return useWebsocket(win, 'connectWebsocket', ip, isBase64)
    })

    ipcMain.handle('closeWebsocket', async() => {
        return useWebsocketClose()
    })

    ipcMain.handle('connectHttpServe', async(_, req) => {
        const { baseDir, port } = req
        return useHttpServe(win, 'connectHttpServe', baseDir, port)
    })

    ipcMain.handle('closeHttpServe', async() => {
        return useHttpServeClose()
    })
}


const request = axios.create({
    timeout: 60000 // 请求超时时间
})
// 异常拦截处理器
const errorHandler = (error:any) => {
    return Promise.resolve(error.response)
}
request.interceptors.request.use(config => config, errorHandler)
request.interceptors.response.use(response => response, errorHandler)