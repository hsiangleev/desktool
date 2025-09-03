import type { BrowserWindow } from 'electron'
import WebSocket from 'ws'
import path from 'path'
import http from 'http'
import fs from 'fs'

let ws:WebSocket | null = null

export const useWebsocket = (win: BrowserWindow, channel: string, ip: string, isBase64: boolean) => {
    ws = new WebSocket(ip)
    ws.on('error', (err) => {
        win.webContents.send(channel, err.toString())
    })

    ws.on('open', () => {
        win.webContents.send(channel, '连接成功')
    })

    ws.on('close', () => {
        win.webContents.send(channel, '关闭连接')
    })

    ws.on('message', (data) => {
        const str = isBase64 ? Buffer.from(data.toString(), 'base64').toString('utf-8') : data.toString()
        win.webContents.send(channel, str)
    })
}

export const useWebsocketClose = () => {
    ws?.close()
    ws = null
}

let ht:http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | null = null
export const useHttpServe = (win: BrowserWindow, channel: string, baseDir: string, port: number) => {
    const host = '0.0.0.0'

    ht = http.createServer((req, res) => {
        const clientIP = req.socket.remoteAddress // 客户端 IP
        const now = new Date().toISOString()
        win.webContents.send(channel, `[${now}] ${clientIP} ${req.method} ${req.url}`)

        const filePath = path.join(baseDir, (req.url === '/' ? 'index.html' : req.url) ?? 'index.html')
        // 确保路径在 baseDir 里面，防止目录穿越攻击
        if (!filePath.startsWith(baseDir)) {
            res.writeHead(403)
            return res.end('Forbidden')
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404)
                return res.end('404 Not Found')
            }
            // 简单根据扩展名返回 Content-Type
            const ext = path.extname(filePath).toLowerCase()
            const mimeTypes: Record<string, string> = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml'
            }
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' })
            res.end(data)
        })
    })
        .listen(port, host, () => {
            win.webContents.send(channel, `服务已开启： http://${host}:${port}/`)
        })
        .on('error', (err) => win.webContents.send(channel, err.message))
}

export const useHttpServeClose = () => {
    return new Promise(resolve => {
        ht?.close(err => {
            if (err) return resolve(err.message)
            ht = null
            resolve('服务已停止')
        })
    })
}