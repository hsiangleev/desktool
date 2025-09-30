import kill from 'tree-kill'
import spawn from 'cross-spawn'
import { type ChildProcess } from 'child_process'
import iconv from 'iconv-lite'
import os from 'os'
import type { BrowserWindow } from 'electron'

const processObject:Map<string, ChildProcess> = new Map()

interface IOtherParams {
    cwd?: string
    stopId?: string
}
/** 执行系统命令 */
export const spawnCommand = (win: BrowserWindow, channel: string, command: string, args: string[], params:IOtherParams = {}) => {
    const { cwd, stopId } = params
    return new Promise((resolve, reject) => {
        const processItem = spawn(command, args, { cwd })
        stopId && processObject.set(stopId, processItem)

        const isWin = os.platform() === 'win32'

        const decode = (data: any) => {
            // Node CLI 输出大部分是 utf8
            const utf8 = data.toString('utf8')
            // 如果有明显乱码再尝试 GBK
            if (/�/.test(utf8)) return iconv.decode(data, 'gbk')
            return utf8
        }

        // 打印标准输出
        processItem.stdout?.on('data', (data) => {
            const text = isWin ? decode(data) : data.toString('utf8')
            win.webContents.send(channel, text)
        })

        // 打印错误输出
        processItem.stderr?.on('data', (data) => {
            const text = isWin ? decode(data) : data.toString('utf8')
            win.webContents.send(channel, text)
        })

        // 结束
        processItem.on('close', (code) => {
            if (code === 0) {
                win.webContents.send(channel, '操作完成')
            } else {
                win.webContents.send(channel, `操作失败，退出码 ${code}`)
            }
            stopId && processObject.delete(stopId)
            resolve('')
        })

        processItem.on('error', reject)
    })
}

/** 停止命令 */
export const processStop = async(stopId: string) => {
    return new Promise(resolve => {
        const processItem = processObject.get(stopId)
        if(processItem && processItem.pid) {
            kill(processItem.pid, 'SIGKILL', (err) => {
                if (err) resolve('❌ 结束失败:')
                else resolve('✅ 已终止')
            })
            processObject.delete(stopId)
        }else{
            resolve('命令已结束或未执行')
        }
    })
}

/** 停止所有正在执行的程序 */
export const processStopAll = async() => {
    for (const key of processObject.keys()) {
        await processStop(key)
    }
}