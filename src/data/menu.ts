import { routerMenu } from '@/router/modules/async'

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
        id: '100',
        path: '/tools',
        meta: { icon: 'ant-design:tool-outlined', menuName: '工具', menuType: 1 },
        children: [
            {
                id: '101',
                path: '/tools/http',
                component: routerMenu['tools/http'],
                meta: { menuName: 'http请求', menuType: 2 }
            },
            {
                id: '102',
                path: '/tools/tools',
                component: routerMenu['tools/tools'],
                meta: { menuName: '系统工具', menuType: 2 }
            },
            {
                id: '103',
                path: '/tools/encode',
                component: routerMenu['tools/encode'],
                meta: { menuName: '字符串加密', menuType: 2 }
            },
            {
                id: '104',
                path: '/tools/websocket',
                component: routerMenu['tools/websocket'],
                meta: { menuName: 'websocket连接', menuType: 2 }
            },
            {
                id: '105',
                path: '/tools/httpServe',
                component: routerMenu['tools/httpServe'],
                meta: { menuName: '静态服务器', menuType: 2 }
            }
        ]
    },
    {
        id: '501',
        path: '/markdown',
        meta: { icon: 'bi:markdown', menuName: 'markdown', menuType: 1 },
        children: [
            {
                id: '502',
                path: '/markdown/markdownEdit',
                component: routerMenu['markdown/markdownEdit'],
                meta: { menuName: 'MD编辑器', menuType: 2 }
            },
            {
                id: '503',
                path: '/markdown/cloudflareImg',
                component: routerMenu['markdown/cloudflareImg'],
                meta: { menuName: 'cloudflare图床', menuType: 2 }
            }
        ]
    },
    {
        id: '201',
        path: '/git',
        meta: { icon: 'bi:git', menuName: 'git操作', menuType: 1 },
        children: [
            {
                id: '202',
                path: '/git/clone',
                component: routerMenu['git/clone'],
                meta: { menuName: '克隆项目', menuType: 2 }
            },
            {
                id: '203',
                path: '/git/merge',
                component: routerMenu['git/merge'],
                meta: { menuName: '合并分支', menuType: 2 }
            },
            {
                id: '204',
                path: '/npm/updatePackage',
                component: routerMenu['npm/updatePackage'],
                meta: { menuName: '更新软件包', menuType: 2 }
            },
            {
                id: '205',
                path: '/git/updateGitlabFile',
                component: routerMenu['git/updateGitlabFile'],
                meta: { menuName: '同步gitlab文件', menuType: 2 }
            }
        ]
    },
    {
        id: '401',
        path: '/webview',
        meta: { icon: 'ant-design:fund-view-outlined', menuName: 'webview', menuType: 1 },
        children: [
            {
                id: '402',
                path: '/webview/chatgpt',
                component: routerMenu['webview/chatgpt'],
                meta: { menuName: 'chatgpt', menuType: 2 }
            },
            {
                id: '403',
                path: '/webview/deepseek',
                component: routerMenu['webview/deepseek'],
                meta: { menuName: 'deepseek', menuType: 2 }
            },
            {
                id: '404',
                path: '/webview/translate',
                component: routerMenu['webview/translate'],
                meta: { menuName: '谷歌翻译', menuType: 2 }
            }
        ]
    }
]

export default menu