import { BrowserWindow, ipcMain, dialog } from 'electron'
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
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })
        if (result.canceled) return null
        return result.filePaths[0]
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
}