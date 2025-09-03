import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import type { BrowserWindow } from 'electron'
import path from 'path'
import kill from 'tree-kill'
import simpleGit from 'simple-git'

let git: ChildProcessWithoutNullStreams | null = null

const gitCommand = (win: BrowserWindow, channel: string, args: string[], cwd?: string) => {
    return new Promise(resolve => {
        const git = spawn('git', args, { cwd })

        // 打印标准输出
        git.stdout.on('data', (data) => {
            win.webContents.send(channel, data.toString())
        })

        // 打印错误输出
        git.stderr.on('data', (data) => {
            win.webContents.send(channel, data.toString())
        })

        // 结束
        git.on('close', (code) => {
            if (code === 0) {
                win.webContents.send(channel, '操作完成')
            } else {
                win.webContents.send(channel, `操作失败，退出码 ${code}`)
            }
            resolve('')
        })
    })
}

export const gitStop = async() => {
    return new Promise(resolve => {
        if(git && git.pid) {
            kill(git.pid, 'SIGKILL', (err) => {
                if (err) resolve('❌ 结束失败:')
                else resolve('✅ 已终止')
            })
            git = null
        }
    })
}

// 储存
const gitStashIn = async(win: BrowserWindow, channel: string, cwd: string) => {
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

// 应用储存
const gitStashOut = async(win: BrowserWindow, channel: string, cwd: string) => {
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

// 切换分支
const switchOrCreateBranch = async(win: BrowserWindow, channel: string, cwd: string, branchName: string) => {
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

export const gitClone = async(win: BrowserWindow, repoUrl: string, targetDir: string) => {
    const fileName = repoUrl.match(/([^/]+)(?=\.git$)/)
    const target = path.resolve(targetDir, fileName ? fileName[1] : '')
    await gitCommand(win, 'gitClone', ['clone', '--progress', repoUrl, target])
}

export const gitMerge = async(win: BrowserWindow, cwds: string[], origin: string, target: string) => {
    for (const cwd of cwds) {
        win.webContents.send('gitMerge', '----------------------------------------')
        win.webContents.send('gitMerge', `${cwd}`)
        await gitStashIn(win, 'gitMerge', cwd)
        await gitCommand(win, 'gitMerge', ['pull', '--progress'], cwd)
        await switchOrCreateBranch(win, 'gitMerge', cwd, target)
        await gitCommand(win, 'gitMerge', ['reset', '--hard', origin], cwd)
        await gitCommand(win, 'gitMerge', ['push', '-f', '--progress'], cwd)
        await switchOrCreateBranch(win, 'gitMerge', cwd, origin)
        await gitStashOut(win, 'gitMerge', cwd)
        win.webContents.send('gitMerge', '----------------------------------------')
    }
}