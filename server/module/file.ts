import { BrowserWindow, ipcMain, dialog } from 'electron'
import { gitClone, gitMerge, gitStop } from '~/tools/git'
import { useReaddir } from '~/tools/tools'

export const useFile = (win: BrowserWindow) => {
    ipcMain.handle('readdir', async(_, dir) => {
        return useReaddir(dir)
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
    
    ipcMain.handle('gitStop', async() => {
        return await gitStop()
    })
}