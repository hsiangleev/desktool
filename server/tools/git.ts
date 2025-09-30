import type { BrowserWindow } from 'electron'
import path from 'path'
import kill from 'tree-kill'
import simpleGit from 'simple-git'
import spawn from 'cross-spawn'
import { type ChildProcess } from 'child_process'
import iconv from 'iconv-lite'
import os from 'os'

const processObject:Map<string, ChildProcess> = new Map()

interface IOtherParams {
    cwd?: string
    stopId?: string
}
/** 执行系统命令 */
export const spawnCommand = (win: BrowserWindow, channel: string, command: string, args: string[], params:IOtherParams = {}) => {
    const { cwd, stopId } = params
    return new Promise(resolve => {
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
    })
}

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

/** 储存 */
export const gitStashIn = async(win: BrowserWindow, channel: string, cwd: string) => {
    const git = simpleGit(cwd)
    try {
        const status = await git.status()
        if (status.files.length > 0) {
            // 本地有未提交修改 → 储藏
            await git.stash()
            win.webContents.send(channel, '本地修改已储藏')
        }
    } catch (err) {
        console.error('储存失败:', err)
        win.webContents.send(channel, '储存失败')
    }
}

/** 应用储存 */
export const gitStashOut = async(win: BrowserWindow, channel: string, cwd: string) => {
    const git = simpleGit(cwd)
    try {
        const stashList = await git.stashList()
        if (stashList.total > 0) {
            await git.stash(['pop'])
            win.webContents.send(channel, '已恢复之前储藏的修改')
        }
    } catch (err) {
        console.error('应用储存失败:', err)
        win.webContents.send(channel, '应用储存失败')
    }
}

/** 切换分支 */
export const switchOrCreateBranch = async(win: BrowserWindow, channel: string, cwd: string, branchName: string) => {
    const git = simpleGit(cwd)
    try {
        // 获取本地分支
        const localBranches = await git.branchLocal()
        if (localBranches.all.includes(branchName)) {
            await git.checkout(branchName)
            win.webContents.send(channel, `切换到本地已有分支: ${branchName}`)
        } else {
            // 3. 获取远程分支
            await git.fetch()
            const remoteBranches = await git.branch(['-r'])
            const remoteBranchFull = `origin/${branchName}`

            if (remoteBranches.all.includes(remoteBranchFull)) {
                // 本地不存在但远程存在 → 创建并跟踪
                await git.checkout(['-b', branchName, remoteBranchFull])
                win.webContents.send(channel, `从远程创建并切换分支: ${branchName}`)
            } else {
                // 本地和远程都不存在 → 新建分支
                await git.checkoutLocalBranch(branchName)
                win.webContents.send(channel, `本地和远程都不存在，已创建新分支: ${branchName}`)
            }
        }
    } catch (err) {
        console.error('切换/创建分支失败:', err)
        win.webContents.send(channel, '切换/创建分支失败')
    }
}

const isExistBranch = async(cwd: string, branchName: string) => {
    const git = simpleGit(cwd)
    try {
        const localBranches = await git.branchLocal()
        if (localBranches.all.includes(branchName)) return true
        await git.fetch()
        const remoteBranches = await git.branch(['-r'])
        const remoteBranchFull = `origin/${branchName}`
        return remoteBranches.all.includes(remoteBranchFull)
    } catch {
        return false
    }
}

/** 获取当前是哪个分支 */
export const getCurrentBranch = async(cwd: string) => {
    const git = simpleGit(cwd)
    const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
    return branch.trim()
}

export const gitClone = async(win: BrowserWindow, repoUrl: string, targetDir: string, stopId: string) => {
    const fileName = repoUrl.match(/([^/]+)(?=\.git$)/)
    const target = path.resolve(targetDir, fileName ? fileName[1] : '')
    await spawnCommand(win, 'gitClone', 'git', ['clone', '--progress', repoUrl, target], { stopId })
}

export const gitMerge = async(win: BrowserWindow, cwds: string[], origin: string, target: string) => {
    for (const cwd of cwds) {
        if(!(await isExistBranch(cwd, origin))) {
            win.webContents.send('gitMerge', '原始分支不存在，请检查')
            return
        }
        win.webContents.send('gitMerge', '----------------------------------------')
        win.webContents.send('gitMerge', `${cwd}`)
        const oldBranch = await getCurrentBranch(cwd)
        await gitStashIn(win, 'gitMerge', cwd)
        await switchOrCreateBranch(win, 'gitMerge', cwd, origin)
        await spawnCommand(win, 'gitMerge', 'git', ['pull', 'origin', origin, '--progress'], { cwd })
        await switchOrCreateBranch(win, 'gitMerge', cwd, target)
        await spawnCommand(win, 'gitMerge', 'git', ['reset', '--hard', origin], { cwd })
        await spawnCommand(win, 'gitMerge', 'git', ['push', 'origin', target, '-f', '--progress'], { cwd })
        await switchOrCreateBranch(win, 'gitMerge', cwd, oldBranch)
        await gitStashOut(win, 'gitMerge', cwd)
        win.webContents.send('gitMerge', '----------------------------------------')
    }
}