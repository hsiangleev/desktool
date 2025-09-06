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
                path: '/http',
                component: routerMenu['tools/http'],
                meta: { menuName: 'http请求', menuType: 2 }
            },
            {
                id: '102',
                path: '/tools',
                component: routerMenu['tools/tools'],
                meta: { menuName: '系统工具', menuType: 2 }
            },
            {
                id: '103',
                path: '/encode',
                component: routerMenu['tools/encode'],
                meta: { menuName: '字符串加密', menuType: 2 }
            },
            {
                id: '104',
                path: '/websocket',
                component: routerMenu['tools/websocket'],
                meta: { menuName: 'websocket连接', menuType: 2 }
            },
            {
                id: '105',
                path: '/httpServe',
                component: routerMenu['tools/httpServe'],
                meta: { menuName: '静态服务器', menuType: 2 }
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
                path: '/clone',
                component: routerMenu['git/clone'],
                meta: { menuName: '克隆项目', menuType: 2 }
            },
            {
                id: '203',
                path: '/merge',
                component: routerMenu['git/merge'],
                meta: { menuName: '合并分支', menuType: 2 }
            },
            {
                id: '204',
                path: '/updateGitlabFile',
                component: routerMenu['git/updateGitlabFile'],
                meta: { menuName: '同步gitlab文件', menuType: 2 }
            }
        ]
    },
    {
        id: '301',
        path: '/npm',
        meta: { icon: 'ant-design:node-index-outlined', menuName: 'npm操作', menuType: 1 },
        children: [
            {
                id: '302',
                path: '/updatePackage',
                component: routerMenu['npm/updatePackage'],
                meta: { menuName: '更新软件包', menuType: 2 }
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
                path: '/chatgpt',
                component: routerMenu['webview/chatgpt'],
                meta: { menuName: 'chatgpt', menuType: 2 }
            },
            {
                id: '403',
                path: '/deepseek',
                component: routerMenu['webview/deepseek'],
                meta: { menuName: 'deepseek', menuType: 2 }
            },
            {
                id: '404',
                path: '/translate',
                component: routerMenu['webview/translate'],
                meta: { menuName: '谷歌翻译', menuType: 2 }
            }
        ]
    }
]

export default menu