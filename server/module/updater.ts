import { autoUpdater } from 'electron-updater'
import { BrowserWindow, ipcMain, shell } from 'electron'
import { app } from 'electron'

let mainWindow: BrowserWindow | null = null
let updateAvailable = false
let updateInfo: any = null

// 配置自动更新
autoUpdater.autoDownload = false // 不自动下载，让用户确认
autoUpdater.autoInstallOnAppQuit = true // 退出时自动安装
autoUpdater.disableWebInstaller = true // 禁用 web 安装器

// 设置 GitHub 更新源
autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'hsiangleev',
    repo: 'desktool'
})

export const useUpdater = (win: BrowserWindow) => {
    mainWindow = win

    // 检查更新
    ipcMain.handle('checkUpdate', async() => {
        try {
            await autoUpdater.checkForUpdates()
            return {
                hasUpdate: updateAvailable,
                version: updateInfo?.version,
                releaseDate: updateInfo?.releaseDate,
                releaseNotes: updateInfo?.releaseNotes
            }
        } catch (error: any) {
            return {
                hasUpdate: false,
                error: error.message
            }
        }
    })

    // 下载更新
    ipcMain.handle('downloadUpdate', async() => {
        try {
            await autoUpdater.downloadUpdate()
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    })

    // 安装更新并退出
    ipcMain.handle('installUpdate', () => {
        autoUpdater.quitAndInstall(false, true)
    })

    // 打开发布页面
    ipcMain.handle('openReleasePage', () => {
        shell.openExternal('https://github.com/hsiangleev/desktool/releases/latest')
    })

    // 获取当前版本
    ipcMain.handle('getCurrentVersion', () => {
        return app.getVersion()
    })

    // 监听更新事件
    setupUpdateEvents()
}

function setupUpdateEvents() {
    // 检查更新中
    autoUpdater.on('checking-for-update', () => {
        sendToRenderer('updateStatus', { status: 'checking' })
    })

    // 发现新版本
    autoUpdater.on('update-available', (info) => {
        updateAvailable = true
        updateInfo = info
        sendToRenderer('updateStatus', {
            status: 'available',
            version: info.version,
            releaseDate: info.releaseDate,
            releaseNotes: info.releaseNotes
        })
    })

    // 没有新版本
    autoUpdater.on('update-not-available', () => {
        updateAvailable = false
        updateInfo = null
        sendToRenderer('updateStatus', { status: 'not-available' })
    })

    // 更新错误
    autoUpdater.on('error', (error) => {
        sendToRenderer('updateStatus', {
            status: 'error',
            error: error.message
        })
    })

    // 下载进度
    autoUpdater.on('download-progress', (progress) => {
        sendToRenderer('updateProgress', {
            percent: progress.percent,
            bytesPerSecond: progress.bytesPerSecond,
            transferred: progress.transferred,
            total: progress.total
        })
    })

    // 下载完成
    autoUpdater.on('update-downloaded', (info) => {
        sendToRenderer('updateStatus', {
            status: 'downloaded',
            version: info.version
        })
    })
}

function sendToRenderer(channel: string, data: any) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data)
    }
}
