import { defineConfig } from 'tsdown'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    entry: ['server/main', 'server/preload'],
    outDir: 'dist/server',
    clean: true,
    format: 'cjs',
    platform: 'node',
    fixedExtension: true,
    outExtensions: () => ({ js: '.cjs' }),
    deps: {
        neverBundle: ['electron'],
        onlyBundle: [
            'form-data',
            'ws',
            '@kwsites/file-exists',
            '@kwsites/promise-deferred',
            'tree-kill',
            'cross-spawn',
            'isexe',
            'which',
            'path-key',
            'shebang-regex',
            'shebang-command',
            'iconv-lite',
            'safer-buffer',
            'systeminformation',
            'debug',
            'ms',
            'has-flag',
            'supports-color',
            'delayed-stream',
            'combined-stream',
            'mime-db',
            'mime-types',
            'asynckit',
            'es-object-atoms',
            'es-errors',
            'math-intrinsics',
            'gopd',
            'es-define-property',
            'has-symbols',
            'get-proto',
            'function-bind',
            'call-bind-apply-helpers',
            'dunder-proto',
            'hasown',
            'get-intrinsic',
            'has-tostringtag',
            'es-set-tostringtag'
        ]
    },
    alias: {
        '~': path.resolve(__dirname, 'server')
    },
    failOnWarn: false
})
