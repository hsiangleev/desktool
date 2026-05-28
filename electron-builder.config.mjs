export default {
    appId: 'com.example.desktool',
    productName: 'desktool',
    directories: {
        output: 'release'
    },
    files: [
        'dist/renderer/**/*',
        'dist/server/**/*',
        'dist/shared/**/*',
        'package.json',
        '!**/*.map'
    ],
    win: {
        icon: 'public/favicon.ico',
        target: ['zip', 'nsis']
    },
    nsis: {
        allowElevation: false,
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true
    },
    compression: 'store',
    publish: {
        provider: 'github',
        owner: 'hsiangleev',
        repo: 'desktool'
    },
    electronLanguages: [
        'zh-CN'
    ]
}