import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { useModule, useProcessStop } from './module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win: BrowserWindow | null = null

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 650,
        icon: path.join(__dirname, '../assets/favicon.ico'),
        autoHideMenuBar: true,
        frame: false, // 取消默认标题栏
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true
        }
    })
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:9090')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    // 错误弹窗拦截
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err)
    })
    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled Rejection:', reason)
    })

    win.on('close', async(event) => {
        event.preventDefault() // 阻止立刻关闭
        try {
            await useProcessStop()
            win?.destroy()
        } catch (err) {
            console.error('清理失败:', err)
            win?.destroy() // 失败时仍然强制关闭
        }
        win = null
    })
    useModule(win)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})