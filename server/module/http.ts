import { BrowserWindow, ipcMain } from 'electron'
import { useTelnetTest } from '~/tools/tools'
import { updateGitlabFile, useRequest } from '~/tools/http'
import crypto from 'crypto'
import { useWebsocket, useWebsocketClose } from '~/tools/websocket'
import { useHttpServe, useHttpServeClose } from '~/tools/http'

export const useHttp = (win: BrowserWindow) => {
    ipcMain.handle('fetch', async(_, req) => {
        const { url, method, params, data, headers } = req
        const res = await useRequest({ url, method, params, data, headers })
        return {
            data: res.data,
            headers: res.headers,
            status: res.status,
            statusText: res.statusText
        }
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

    ipcMain.handle('updateGitlabFile', async(_, req) => {
        const { rootPath, project, projectUrl, filePath, branch } = req
        return updateGitlabFile(rootPath, project, projectUrl, filePath, branch)
    })
}