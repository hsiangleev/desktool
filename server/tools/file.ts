import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'

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