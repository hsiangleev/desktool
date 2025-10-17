import { Socket } from 'net'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import os from 'os'

export const useTelnetTest = (host: string, port: number, timeout = 3000) => {
    return new Promise((resolve) => {
        const socket = new Socket()

        socket.setTimeout(timeout)

        socket.on('connect', () => {
            console.log()
            socket.destroy()
            resolve({
                isConnect: true,
                type: 'success',
                msg: `连接成功: ${host}:${port}`
            })
        })

        socket.on('timeout', () => {
            socket.destroy()
            resolve({
                isConnect: true,
                type: 'warning',
                msg: `连接超时: ${host}:${port}`
            })
        })

        socket.on('error', (err) => {
            socket.destroy()
            resolve({
                isConnect: true,
                type: 'error',
                msg: `连接失败: ${err.message}`
            })
        })

        socket.connect(port, host)
    })
}

export const useReaddir = (dir: string) => {
    let fileList: any[] = []
    let errMsg = ''
    let err = null
    try {
        fileList = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
    } catch (error: any) {
        if(error.errno === -4058 && error.code === 'ENOENT') {
            errMsg = `文件目录${dir}不存在`
        }
        err = error
    }
    return {
        fileList,
        errMsg,
        err
    }
}

/**
 * 睡眠函数
 * @param time 
 */
export async function useSleep(time:number):Promise<void> {
    await new Promise(resolve => {
        setTimeout(() => {
            resolve('')
        }, time)
    })
}

export const loadConfigFile = () => {
    const configPath = path.join(app.getPath('userData'), 'config.json')
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({
            publicRegistry: 'https://registry.npmmirror.com',
            gitlabUrl: '',
            gitlabToken: '',
            listBranch: [],
            publicPackage: [],
            updateVersion: []
        }, null, 4))
    }
    return {
        configPath,
        config: JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
}

export const getAppInfo = () => {
    const packageJsonPath = path.join(__dirname, '../../package.json')
    const { version, name, author } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    return {
        computer: {
            platform: os.platform(),
            arch: os.arch(),
            release: os.release()
        },
        version: {
            app: version,
            electron: process.versions.electron,
            node: process.versions.node,
            chrome: process.versions.chrome
        },
        appName: name,
        author
    }
    
}