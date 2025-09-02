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
                meta: { menuName: 'powershell工具', menuType: 2 }
            }
        ]
    }
]

export default menu