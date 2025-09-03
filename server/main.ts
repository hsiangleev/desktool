import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { useHttp } from './module/http'
import { useFile } from './module/file'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win: BrowserWindow | null = null

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 650,
        icon: path.join(__dirname, '../assets/favicon.ico'),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:9090')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    win.on('closed', () => {
        win = null
    })

    useHttp()
    useFile(win)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})