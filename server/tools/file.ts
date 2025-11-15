import { BrowserWindow, clipboard, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { spawnCommand } from './command'

export const saveMdFile = async(win: BrowserWindow, text: string) => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog(win, {
            title: '保存文件',
            defaultPath: '新建文件.md', // 默认文件名
            filters: [
                { name: '文本文件', extensions: ['md'] },
                { name: '所有文件', extensions: ['*'] }
            ]
        })
    
        if (!canceled && filePath) {
            fs.writeFileSync(filePath, text, 'utf-8')
            return { code: 0, msg: `文件已保存到“${filePath}”` }
        }
        return { code: -1, msg: '已取消' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const openMdFile = async(win: BrowserWindow) => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            title: '选择 Markdown 文件',
            filters: [{ name: 'Markdown', extensions: ['md'] }],
            properties: ['openFile']
        })

        if (!canceled && filePaths.length > 0) {
            const [filePath] = filePaths
            const content = fs.readFileSync(filePath, 'utf-8')
            return { code: 0, path: filePath, data: content }
        }
        return { code: -1, msg: '已取消' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const sellectDir = async(win: BrowserWindow) => {
    try {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })
        if (result.canceled) return ''
        return result.filePaths[0]
    } catch {
        return ''
    }
}

export const selFileImg = async(win: BrowserWindow) => {
    try {
        const result = await dialog.showOpenDialog(win, {
            title: '选择图片',
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] }],
            properties: ['openFile']
        })
        if (result.canceled) return ''
        return result.filePaths[0]
    } catch {
        return ''
    }
}

export const copyFileImgTime = async(sourcePath: string, destDir: string, prefix: string) => {
    try {
        const ext = path.extname(sourcePath)
        // 用时间戳或者格式化时间生成新文件名
        const timestamp = new Date().toISOString()
            .replace(/[-:.TZ]/g, '')  
        // => 类似 "20250920T162345"
        const newFileName = `${prefix}${timestamp}${ext}`

        const targetPath = path.join(destDir, newFileName)

        // 确保目标目录存在
        fs.mkdirSync(destDir, { recursive: true })
        // 复制文件
        fs.copyFileSync(sourcePath, targetPath)

        return { code: 0, msg: `上传成功，文件已保存到“${targetPath}”`, data: newFileName }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

/** 剪贴板中保存图片 */
export const saveImgByClipboard = async(destDir: string, prefix: string) => {
    try {
        // 从剪贴板读取图片
        const image = clipboard.readImage()
        if (!image.isEmpty()) {
            // 转成 PNG Buffer
            const pngBuffer = image.toPNG()
            // 用时间戳或者格式化时间生成新文件名
            const timestamp = new Date().toISOString()
                .replace(/[-:.TZ]/g, '')  
            const newFileName = `${prefix}${timestamp}.png`
            const filePath = path.join(destDir, newFileName)
            // 写入文件
            fs.writeFileSync(filePath, pngBuffer)
            return { code: 0, msg: `图片已保存到: ${filePath}`, data: newFileName }
        } else {
            return { code: -1, msg: '剪贴板中没有图片' }
        }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const uploadCloudflareImg = async(win: BrowserWindow, rootPath: string, projectName: string) => {
    try {
        await spawnCommand(win, 'cloudflareImg', 'wrangler', ['pages', 'deploy', rootPath, `--project-name=${projectName}`, '--branch=main'])
        return { code: 0, msg: '发布成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const portAgentList = async(win: BrowserWindow) => {
    try {
        await spawnCommand(win, 'portAgentList', 'netsh', ['interface', 'portproxy', 'show', 'v4tov4'])
        return { code: 0, msg: '查询成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const portAgentAdd = async(win: BrowserWindow, listenaddress: string, listenport: number, connectaddress: string, connectport: number) => {
    try {
        await spawnCommand(win, 'portAgentAdd', 'netsh', ['interface', 'portproxy', 'add', 'v4tov4', `listenaddress=${listenaddress}`, `listenport=${listenport}`, `connectaddress=${connectaddress}`, `connectport=${connectport}`])
        return { code: 0, msg: '添加成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const portAgentDel = async(win: BrowserWindow, listenaddress: string, listenport: number) => {
    try {
        await spawnCommand(win, 'portAgentDel', 'netsh', ['interface', 'portproxy', 'delete', 'v4tov4', `listenaddress=${listenaddress}`, `listenport=${listenport}`])
        return { code: 0, msg: '删除成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const getServerName = async(win: BrowserWindow, serverName: string) => {
    try {
        await spawnCommand(win, 'getServerName', 'sc', ['query', serverName])
        return { code: 0, msg: '获取成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const startServerName = async(win: BrowserWindow, serverName: string) => {
    try {
        await spawnCommand(win, 'getServerName', 'sc', ['start', serverName])
        return { code: 0, msg: '启动成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const stopServerName = async(win: BrowserWindow, serverName: string) => {
    try {
        await spawnCommand(win, 'getServerName', 'sc', ['stop', serverName])
        return { code: 0, msg: '停止成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const startCommand = async(win: BrowserWindow, command: string, stopId: string, cwd?: string) => {
    try {
        for (const element of command.split('&&')) {
            const [commandName, ...params] = element.trim().split(' ')
            await spawnCommand(win, 'startCommand', commandName, params, { stopId, cwd })
        }
        return { code: 0, msg: '命令执行结束' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}

export const readDirTreeMind = (dirPath: string, obj:{index: number}) => {
    obj.index++
    if(obj.index > 500) return
    const stats = fs.statSync(dirPath)
    const info = {
        data: {
            text: `${path.basename(dirPath)}`,
            generalization: [],
            expand: true,
            uid: crypto.randomUUID(),
            isActive: false
        },
        children: []
    }
    if (stats.isDirectory()) {
        info.children = fs.readdirSync(dirPath).map(child => {
            if(obj.index > 500) return
            return readDirTreeMind(path.join(dirPath, child), obj)
        })
            .filter(v => !!v) as any
    }

    return info
}