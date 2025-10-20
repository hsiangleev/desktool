import { BrowserWindow, ipcMain } from 'electron'
import { selFileImg, openMdFile, saveMdFile, sellectDir, uploadCloudflareImg, copyFileImgTime, saveImgByClipboard, portAgentList, portAgentAdd, portAgentDel, getServerName, startServerName, stopServerName, startCommand } from '~/tools/file'
import { gitClone, gitMerge } from '~/tools/git'
import { processStop } from '~/tools/command'
import { updatePackage } from '~/tools/npm'
import { loadConfigFile, useReaddir } from '~/tools/tools'
import { pathToFileURL, fileURLToPath } from 'url'
import path from 'path'

export const useFile = (win: BrowserWindow) => {
    ipcMain.handle('readdir', async(_, dir) => {
        return useReaddir(dir)
    })

    ipcMain.handle('getConfig', async() => {
        return loadConfigFile()
    })

    ipcMain.handle('sellectDir', async() => {
        return sellectDir(win)
    })
    
    ipcMain.handle('saveMdFile', async(_, res) => {
        return saveMdFile(win, res)
    })
    
    ipcMain.handle('openMdFile', async() => {
        return openMdFile(win)
    })
    
    ipcMain.handle('selFileImg', async() => {
        return selFileImg(win)
    })
    
    ipcMain.handle('saveImgByClipboard', async(_, res) => {
        const { prefix, destDir } = res
        return saveImgByClipboard(destDir, prefix)
    })
    
    ipcMain.handle('copyFileImgTime', async(_, res) => {
        const { sourcePath, destDir, prefix } = res
        return copyFileImgTime(sourcePath, destDir, prefix)
    })

    ipcMain.handle('gitMerge', async(_, res) => {
        const { dirList, origin, target } = res
        await gitMerge(win, dirList, origin, target)
    })
    
    ipcMain.handle('gitClone', async(_, res) => {
        const { repoUrl, targetDir, stopId } = res
        await gitClone(win, repoUrl, targetDir, stopId)
    })
    
    ipcMain.handle('processStop', async(_, res) => {
        return await processStop(res)
    })
    
    ipcMain.handle('updatePackage', async(_, res) => {
        const { dirList, packages, branch } = res
        return await updatePackage(win, dirList, packages, branch)
    })
    
    ipcMain.handle('cloudflareImg', async(_, res) => {
        const { rootPath, projectName } = res
        return await uploadCloudflareImg(win, rootPath, projectName)
    })
    
    ipcMain.handle('portAgentList', async() => {
        return await portAgentList(win)
    })
    
    ipcMain.handle('portAgentAdd', async(_, res) => {
        const { listenaddress, listenport, connectaddress, connectport } = res
        return await portAgentAdd(win, listenaddress, listenport, connectaddress, connectport)
    })
    
    ipcMain.handle('portAgentDel', async(_, res) => {
        const { listenaddress, listenport } = res
        return await portAgentDel(win, listenaddress, listenport)
    })

    ipcMain.handle('getRootPath', async(_, href) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const pluginPath = path.join(__dirname, `../renderer/${href}`)
        return pathToFileURL(pluginPath).href
    })

    ipcMain.handle('getServerName', async(_, res) => {
        const { serverName } = res
        return getServerName(win, serverName)
    })

    ipcMain.handle('startServerName', async(_, res) => {
        const { serverName } = res
        return startServerName(win, serverName)
    })

    ipcMain.handle('stopServerName', async(_, res) => {
        const { serverName } = res
        return stopServerName(win, serverName)
    })

    ipcMain.handle('startCommand', async(_, res) => {
        const { command, stopId, cwd } = res
        return startCommand(win, command, stopId, cwd)
    })
}