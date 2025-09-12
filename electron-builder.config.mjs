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
        'package.json'
    ],
    win: {
        icon: 'public/favicon.ico',
        target: ['zip', 'nsis']
    },
    publish: {
        provider: 'github',
        owner: 'hsiangleev',
        repo: 'desktool'
    }
}