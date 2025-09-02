import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        'server/main',
        'server/preload'
    ],
    outDir: 'dist',
    clean: true, // 构建前清理 dist
    declaration: false, // 输出 types
    rollup: {
        emitCJS: true // 输出 CommonJS
    },
    failOnWarn: false,
    externals: [
        'electron'
    ]
})