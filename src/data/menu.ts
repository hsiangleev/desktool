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
            }
        ]
    },
    {
        id: '201',
        path: '/git',
        meta: { icon: 'ant-design:tool-outlined', menuName: 'git操作', menuType: 1 },
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
            }
        ]
    }
]

export default menu