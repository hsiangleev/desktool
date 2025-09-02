import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win: BrowserWindow | null = null

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 650,
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
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})