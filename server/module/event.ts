import { ipcMain, type BrowserWindow } from 'electron'


export const useEvent = (win: BrowserWindow) => {
    ipcMain.on('window-control', (_, action) => {
        switch (action) {
        case 'minimize':
            win.minimize()
            break
        case 'maximize':
            if (win.isMaximized()) {
                win.unmaximize()
            } else {
                win.maximize()
            }
            break
        case 'close':
            win.close()
            break
        }
    })
}