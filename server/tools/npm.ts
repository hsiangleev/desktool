import type { BrowserWindow } from 'electron'
import { getCurrentBranch, gitStashIn, gitStashOut, switchOrCreateBranch } from './git'
import path from 'path'
import fs from 'fs'
import { loadConfigFile } from './tools'
import { spawnCommand } from './command'

export const updatePackage = async(win: BrowserWindow, dirList: string[], packages: string[], branch: string) => {
    const { config } = loadConfigFile()
    for (const cwd of dirList) {
        const projectName = path.basename(cwd)
        win.webContents.send('updatePackage', '✅ ----------------------------------------')
        win.webContents.send('updatePackage', `${cwd}`)
        const oldBranch = await getCurrentBranch(cwd)
        const { isStash } = await gitStashIn(win, 'updatePackage', cwd)
        await switchOrCreateBranch(win, 'updatePackage', cwd, branch)
        await spawnCommand(win, 'updatePackage', 'git', ['pull', 'origin', branch, '--progress'], { cwd })
        // 安装包
        for (const pac of packages) {
            win.webContents.send('updatePackage', `✅项目${projectName}开始安装依赖${pac}`)
            win.webContents.send('updatePackage', '{')
            await spawnCommand(win, 'updatePackage', 'npm', ['install', pac, '-D', '--save-exact', '--progress=true', '--verbose', `--registry=${config.publicRegistry}`], { cwd })
            win.webContents.send('updatePackage', '}')
            win.webContents.send('updatePackage', `✅项目${projectName}依赖${pac}安装完成`)
        }
        // 判断是否是公共包
        if(config.updateVersion.includes(projectName)) {
            win.webContents.send('updatePackage', '更新package.json版本')
            updatePackageVersion(cwd)
            await spawnCommand(win, 'updatePackage', 'npm', ['install', '--progress=true', '--verbose', `--registry=${config.publicRegistry}`], { cwd })
        }
        // 推送
        await spawnCommand(win, 'updatePackage', 'git', ['commit', '-a', '-m', '依赖更新'], { cwd })
        await spawnCommand(win, 'updatePackage', 'git', ['push', 'origin', branch], { cwd })
        // 切回初始状态
        await switchOrCreateBranch(win, 'updatePackage', cwd, oldBranch)
        isStash && await gitStashOut(win, 'updatePackage', cwd)
        win.webContents.send('updatePackage', '✅ ----------------------------------------')
    }
}

const updatePackageVersion = (cwd: string) => {
    const pkgPath = path.resolve(cwd, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    // eslint-disable-next-line prefer-const
    let [major, minor, patch] = pkg.version.split('.').map(Number)
    patch++
    pkg.version = `${major}.${minor}.${patch}`
    
    // 把 LF 替换成 CRLF
    let text = `${JSON.stringify(pkg, null, 4)}\n`
    text = text.replace(/\r?\n/g, '\r\n')
    fs.writeFileSync(pkgPath, text, 'utf-8')
}