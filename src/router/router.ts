//常量路由
// mate.hidden 为 true 的路由不会出现在左侧菜单里
export const constantRouters = [
    {
        path: '/login',
        component: () => import('../views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录',
            hidden: true
        }
    },
    {
        path: '/',
        component: () => import('../views/home/index.vue'),
        name: 'layout',
        redirect: '/home',
        meta: {
            title: '',
            hidden: true
        },
        children: [
            {
                path: '/home',
                component: () => import('../views/home/home/index.vue'),
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'House',
                    hidden: false
                }
            },
            {
                path: '/datashow',
                component: () => import('../views/datashow/index.vue'),
                name: 'datashow',
                meta: {
                    title: '数据大屏',
                    icon: 'Monitor',
                    hidden: false,
                    // 全屏显示：不套 layout（不要左侧菜单和顶部导航）
                    fullScreen: true
                }
            },


        ]
    },
    {
        path: '/404',
        component: () => import('../views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true
        }
    },
]


//异步路由
export const asyncRouters = [
    {
        // 权限管理：带三个二级路由
        path: '/power',
        component: () => import('../views/power/index.vue'),
        redirect: '/power/user',
        name: 'Acl',
        meta: {
            title: '权限管理',
            icon: 'Lock',
            hidden: false
        },
        children: [
            {
                path: '/power/user',
                component: () => import('../views/power/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    icon: 'User',
                    hidden: false
                }
            },
            {
                path: '/power/character',
                component: () => import('../views/power/character/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'Avatar',
                    hidden: false
                }
            },
            {
                path: '/power/menu',
                component: () => import('../views/power/menu/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    icon: 'Operation',
                    hidden: false
                }
            }
        ]
    },
    {
        // 商品管理：带四个二级路由
        path: '/product',
        component: () => import('../views/product/index.vue'),
        redirect: '/product/task',
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods',
            hidden: false
        },
        children: [
            {
                path: '/product/task',
                component: () => import('../views/product/task/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'PriceTag',
                    hidden: false
                }
            },
            {
                path: '/product/value',
                component: () => import('../views/product/value/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'SetUp',
                    hidden: false
                }
            },
            {
                path: '/product/spu',
                component: () => import('../views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU 管理',
                    icon: 'Grid',
                    hidden: false
                }
            },
            {
                path: '/product/sku',
                component: () => import('../views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU 管理',
                    icon: 'Box',
                    hidden: false
                }
            }
        ]
    }
]

//任意路由
export const  anyRouters = [
     {
        path: '/:pathMatch(.*)*', //匹配其它任意路由
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hidden: true
        }
    }
]
