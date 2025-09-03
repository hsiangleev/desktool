import { ipcMain } from 'electron'
import axios from 'axios'
import { useTelnetTest } from '~/tools/tools'
import crypto from 'crypto'

export const useHttp = () => {
    ipcMain.handle('fetch', async(_, req) => {
        const { url, method, params, data, headers } = req
        const res = await axios({ url, method, params, data, headers })
        return res.data
    })

    ipcMain.handle('telnet', async(_, req) => {
        return useTelnetTest(req.host, req.port)
    })

    ipcMain.handle('guid', async() => {
        return crypto.randomUUID()
    })

    ipcMain.handle('base64Encode', async(_, str: string) => {
        return Buffer.from(str, 'utf-8').toString('base64')
    })

    ipcMain.handle('base64Decode', async(_, str: string) => {
        return Buffer.from(str, 'base64').toString('utf-8')
    })
}