import { routerMenu } from '@/router/modules/async'

let index = 100

export interface IMenu {
    id: string
    path: string
    component?: IComponent
    meta: {
        menuType: 1 | 2
        icon?: string
        menuName: string
    },
    children?: IMenu[]
}

const menu: IMenu[] = [
    {
        id: `${++index}`,
        path: '/tools',
        meta: { icon: 'ant-design:tool-outlined', menuName: '工具', menuType: 1 },
        children: [
            {
                id: `${++index}`,
                path: '/tools/http',
                component: routerMenu['tools/http'],
                meta: { menuName: 'http请求', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/tools/tools',
                component: routerMenu['tools/tools'],
                meta: { menuName: '系统工具', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/tools/encode',
                component: routerMenu['tools/encode'],
                meta: { menuName: '字符串加密', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/tools/formatJson',
                component: routerMenu['tools/formatJson'],
                meta: { menuName: 'json格式化', menuType: 2 }
            }
        ]
    },
    {
        id: `${++index}`,
        path: '/markdown',
        meta: { icon: 'bi:markdown', menuName: 'markdown', menuType: 1 },
        children: [
            {
                id: `${++index}`,
                path: '/markdown/markdownEdit',
                component: routerMenu['markdown/markdownEdit'],
                meta: { menuName: 'MD编辑器', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/markdown/cloudflareImg',
                component: routerMenu['markdown/cloudflareImg'],
                meta: { menuName: 'cloudflare图床', menuType: 2 }
            }
        ]
    },
    {
        id: `${++index}`,
        path: '/webview',
        meta: { icon: 'ant-design:fund-view-outlined', menuName: 'webview', menuType: 1 },
        children: [
            {
                id: `${++index}`,
                path: '/webview/chatgpt',
                component: routerMenu['webview/chatgpt'],
                meta: { menuName: 'chatgpt', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/webview/deepseek',
                component: routerMenu['webview/deepseek'],
                meta: { menuName: 'deepseek', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/webview/translate',
                component: routerMenu['webview/translate'],
                meta: { menuName: '谷歌翻译', menuType: 2 }
            }
        ]
    },
    {
        id: `${++index}`,
        path: '/server',
        meta: { icon: 'bi:server', menuName: '服务', menuType: 1 },
        children: [
            {
                id: `${++index}`,
                path: '/server/websocket',
                component: routerMenu['server/websocket'],
                meta: { menuName: 'websocket连接', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/server/httpServe',
                component: routerMenu['tools/httpServe'],
                meta: { menuName: '静态服务器', menuType: 2 }
            }
        ]
    },
    {
        id: `${++index}`,
        path: '/git',
        meta: { icon: 'bi:git', menuName: 'git操作', menuType: 1 },
        children: [
            {
                id: `${++index}`,
                path: '/git/clone',
                component: routerMenu['git/clone'],
                meta: { menuName: '克隆项目', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/git/merge',
                component: routerMenu['git/merge'],
                meta: { menuName: '合并分支', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/npm/updatePackage',
                component: routerMenu['npm/updatePackage'],
                meta: { menuName: '更新软件包', menuType: 2 }
            },
            {
                id: `${++index}`,
                path: '/git/updateGitlabFile',
                component: routerMenu['git/updateGitlabFile'],
                meta: { menuName: '同步gitlab文件', menuType: 2 }
            }
        ]
    }
]

export default menu