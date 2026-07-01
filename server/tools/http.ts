import path from 'path'
import http from 'http'
import fs from 'fs'
import axios from 'axios'
import type { BrowserWindow } from 'electron'
import FormData from 'form-data'

export const useRequest = axios.create({
    timeout: 60000 // 请求超时时间
})
// 异常拦截处理器
const errorHandler = (error:any) => {
    return Promise.resolve(error.response)
}
useRequest.interceptors.request.use(config => config, errorHandler)
useRequest.interceptors.response.use(response => response, errorHandler)

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
        if(!ht) return resolve('')
        ht.close(err => {
            if (err) return resolve(err.message)
            ht = null
            resolve('服务已停止')
        })
    })
}

export const useFetch = async(win: BrowserWindow, channel: string, req: any) => {
    try {
        const { url, method, params, data, headers, file } = req
        if(file.length === 0) {
            const res = await useRequest({ url, method, params, data, headers })
            return {
                data: res.data,
                status: res.status,
                statusText: res.statusText
            }
        }
        file.forEach(async(v: {name: string, buffer: any}) => {
            const formData = new FormData()
            const buffer = Buffer.isBuffer(v.buffer) ? v.buffer : Buffer.from(v.buffer)
            formData.append('file', buffer, {
                filename: v.name,
                contentType: 'application/octet-stream'
            })
            Object.keys(data).forEach(v => formData.append(v, data[v]))
            const res = await useRequest({ 
                url, 
                method, 
                params, 
                data: formData, 
                headers: { ...headers, ...formData.getHeaders() },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            })
            win.webContents.send(channel, `“${v.name}”文件上传结束，返回结果如下：`)
            win.webContents.send(channel, {
                data: res.data,
                status: res.status,
                statusText: res.statusText
            })
        })
        return []
    } catch (error:any) {
        return { data: error.toString() }
    }
}

export const useGetIp = async() => {
    let ipv4, ipv6
    try {
        // 使用国内可用的 IP 查询服务
        const [ipv4Res, ipv6Res] = await Promise.allSettled([
            axios.get('https://myip.ipip.net', { 
                timeout: 5000,
                responseType: 'text'
            }),
            axios.get('https://v6.ident.me', { 
                timeout: 5000,
                responseType: 'text'
            })
        ])
        // 解析 ipip.net 返回格式: "当前 IP：xxx 来自于：xxx"
        if (ipv4Res.status === 'fulfilled') {
            const match = ipv4Res.value.data.match(/当前 IP：([\d.]+)/)
            ipv4 = match ? match[1] : ipv4Res.value.data.trim()
        }
        if (ipv6Res.status === 'fulfilled') ipv6 = ipv6Res.value.data.trim()
    } catch {}
    return {
        ipv4, 
        ipv6
    }
}