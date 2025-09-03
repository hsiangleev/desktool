import { routerMenu } from './async'
import menu from '@/data/menu'

const constantRoutes = [
    {
        path: '/',
        component: routerMenu.layout,
        children: [
            ...menu,
            {
                path: '',
                component: routerMenu['dashboard/workspace']
            },
            {
                path: '/404',
                component: routerMenu['dashboard/workspace']
            }
        ]
    },
    {
        path: epsPathRedirect,
        component: routerMenu.layout,
        children: [
            {
                path: ':pathMatch(.*)*',
                component: routerMenu.redirect
            }
        ]
    },
    { path: '/:pathMatch(.*)*', component: '',redirect: '/404' }
]

export default constantRoutes