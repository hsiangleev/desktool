import { loadEnv } from 'vite'
import type { UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'

export default ({ mode }: ConfigEnv): UserConfigExport => {
    const root = process.cwd()
    const env = loadEnv(mode, root) as any
    return {
        base: './',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            },
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.mts', '.jsx', '.json']
        },
        build: {
            outDir: path.resolve(__dirname, 'dist/renderer')
        },
        define: {
            'process.env': env
        },
        server: {
            port: 9090,
            host: true,
            headers: {
                'access-control-allow-origin': '*'
            }
        },
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: tag => tag === 'webview'
                    }
                }
            }),
            UnoCSS(),
            Components({
                dts: 'types/components.d.ts',
                dirs: ['src/components'],
                extensions: ['vue', 'vue-router']
            }),
            AutoImport({
                imports: [
                    'vue', 'vue-router', '@vueuse/core'
                ],
                dirs: ['src/utils/**', 'src/hooks/**', 'src/store/index.ts'],
                vueTemplate: true,
                dts: 'types/auto-import.d.ts'
            })
        ],
        css: {
            postcss: {
                plugins: [
                    postcssImport(), postcssNesting()
                ]
            }
        }
    }
}