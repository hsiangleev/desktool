import path from 'path'
import http from 'http'
import fs from 'fs'
import axios from 'axios'
import type { BrowserWindow } from 'electron'
import FormData from 'form-data'
import { loadConfigFile } from './tools'

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

export const updateGitlabFile = async(rootPath: string, project: string[], projectUrl: string, filePath: string, branch: string) => {
    const { config } = loadConfigFile()
    const { gitlabUrl, gitlabToken } = config
    if(!gitlabUrl) return {
        code: -1,
        msg: '配置文件没有配置gitlabUrl'
    }
    if(!gitlabToken) return {
        code: -1,
        msg: '配置文件没有配置gitlabToken'
    }
    const to2F = (str: string) => str.split('/').join('%2F')
    const url = `${gitlabUrl}/api/v4/projects/${to2F(projectUrl)}/repository/files/${to2F(filePath)}/raw?ref=${branch}`

    try {
        const res = await useRequest.get(url, {
            responseType: 'arraybuffer',
            headers: { 'PRIVATE-TOKEN': gitlabToken }
        })
        if(res.status !== 200) {
            return { code: -1, msg: `下载失败: ${res.status} ${res.statusText}` }
        }
        const arrayBuffer = await res.data
        let text = Buffer.from(arrayBuffer).toString('utf-8')

        // 把 LF 替换成 CRLF
        text = text.replace(/\r?\n/g, '\r\n')
        
        const msg: string[] = []
        for (const element of project) {
            const p = path.resolve(rootPath, element, filePath)
            fs.mkdirSync(path.dirname(p), { recursive: true })
            fs.writeFileSync(p, text, 'utf-8')
            msg.push(`下载成功，文件已保存 ${p}`)
        }
        return { code: 0, msg }
    } catch (err: any) {
        return { code: -1, msg: `下载失败: ${err.toString()}` }
    }
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