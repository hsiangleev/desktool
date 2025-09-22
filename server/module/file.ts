import { BrowserWindow, ipcMain } from 'electron'
import { selFileImg, openMdFile, saveMdFile, sellectDir, uploadCloudflareImg, copyFileImgTime, saveImgByClipboard } from '~/tools/file'
import { gitClone, gitMerge, processStop } from '~/tools/git'
import { updatePackage } from '~/tools/npm'
import { loadConfigFile, useReaddir } from '~/tools/tools'

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
        const { repoUrl, targetDir } = res
        await gitClone(win, repoUrl, targetDir)
    })
    
    ipcMain.handle('processStop', async() => {
        return await processStop()
    })
    
    ipcMain.handle('updatePackage', async(_, res) => {
        const { dirList, packages, branch } = res
        return await updatePackage(win, dirList, packages, branch)
    })
    
    ipcMain.handle('cloudflareImg', async(_, res) => {
        const { rootPath, projectName } = res
        return await uploadCloudflareImg(win, rootPath, projectName)
    })
}