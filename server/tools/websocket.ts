import type { BrowserWindow } from 'electron'
import WebSocket from 'ws'

let ws:WebSocket | null = null

export const useWebsocket = (win: BrowserWindow, channel: string, ip: string, isBase64: boolean) => {
    try {
        ws = new WebSocket(ip)
        ws.on('error', (err) => {
            win.webContents.send(channel, { code: -1, msg: err.toString() })
        })

        ws.on('open', () => {
            win.webContents.send(channel, { code: 0, msg: '连接成功' })
        })

        ws.on('close', () => {
            win.webContents.send(channel, { code: -1, msg: '关闭连接' })
        })

        ws.on('message', (data) => {
            const str = isBase64 ? Buffer.from(data.toString(), 'base64').toString('utf-8') : data.toString()
            win.webContents.send(channel, { code: 0, msg: str })
        })
    } catch (error) {
        win.webContents.send(channel, { code: -1, msg: `${error}` })
    }
}

export const useWebsocketClose = () => {
    ws?.close()
    ws = null
}