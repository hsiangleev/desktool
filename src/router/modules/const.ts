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
                path: '/403',
                component: routerMenu['errorPage/403']
            },
            {
                path: '/error',
                component: routerMenu['errorPage/error']
            },
            {
                path: '/404',
                component: routerMenu['errorPage/404']
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