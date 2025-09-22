import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { spawnCommand } from './git'

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
        if (result.canceled) return null
        return result.filePaths[0]
    } catch {
        return null
    }
}

export const selFileImg = async(win: BrowserWindow) => {
    try {
        const result = await dialog.showOpenDialog(win, {
            title: '选择图片',
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] }],
            properties: ['openFile']
        })
        if (result.canceled) return null
        return result.filePaths[0]
    } catch {
        return null
    }
}

export const copyFileImgTime = async(sourcePath: string, destDir: string) => {
    try {
        const ext = path.extname(sourcePath)
        // 用时间戳或者格式化时间生成新文件名
        const timestamp = new Date().toISOString()
            .replace(/[-:.TZ]/g, '')  
        // => 类似 "20250920T162345"
        const newFileName = `${timestamp}${ext}`

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

export const uploadCloudflareImg = async(win: BrowserWindow, rootPath: string, projectName: string) => {
    try {
        await spawnCommand(win, 'cloudflareImg', 'wrangler', ['pages', 'deploy', rootPath, `--project-name=${projectName}`, '--branch=main'])
        return { code: 0, msg: '发布成功' }
    } catch (error) {
        return { code: -1, msg: `${error}` }
    }
}