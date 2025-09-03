import { defineBuildConfig } from 'unbuild'
import path from 'path'

export default defineBuildConfig({
    entries: [
        'server/main',
        'server/preload'
    ],
    outDir: 'dist',
    clean: true, // 构建前清理 dist
    declaration: false, // 输出 types
    rollup: {
        emitCJS: true, // 输出 CommonJS
        alias: {
            entries: [
                { find: '~', replacement: path.resolve(__dirname, 'server') }
            ]
        }
    },
    failOnWarn: false,
    externals: [
        'electron'
    ]
})