import type { BrowserWindow } from 'electron'
import path from 'path'
import simpleGit from 'simple-git'
import { spawnCommand } from './command'

/** 储存代码 */
export const gitStashIn = async(win: BrowserWindow, channel: string, cwd: string) => {
    const git = simpleGit(cwd)
    let isStash = false
    try {
        const status = await git.status()
        if (status.files.length > 0) {
            // 本地有未提交修改 → 储藏
            await git.stash()
            win.webContents.send(channel, '本地修改已储藏')
            isStash = true
        }
    } catch (err) {
        console.error('储存失败:', err)
        win.webContents.send(channel, '储存失败')
    }
    return { 
        /** 是否已储存当前代码 */
        isStash
    }
}

/** 应用上一次的储存储存 */
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
        const { isStash } = await gitStashIn(win, 'gitMerge', cwd)
        await switchOrCreateBranch(win, 'gitMerge', cwd, origin)
        await spawnCommand(win, 'gitMerge', 'git', ['pull', 'origin', origin, '--progress'], { cwd })
        await switchOrCreateBranch(win, 'gitMerge', cwd, target)
        await spawnCommand(win, 'gitMerge', 'git', ['reset', '--hard', origin], { cwd })
        await spawnCommand(win, 'gitMerge', 'git', ['push', 'origin', target, '-f', '--progress'], { cwd })
        await switchOrCreateBranch(win, 'gitMerge', cwd, oldBranch)
        isStash && await gitStashOut(win, 'gitMerge', cwd)
        win.webContents.send('gitMerge', '----------------------------------------')
    }
}