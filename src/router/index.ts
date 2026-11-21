import { constantRouters, asyncRouters, anyRouters } from './router'
import { createRouter, createWebHashHistory } from "vue-router";

// 把异步路由挂到 layout 路由的 children 下，
// 这样「权限管理 / 商品管理」会渲染在主布局（左侧菜单 + 顶部导航）内部，
// 而不是脱离布局单独铺满整页。
const routes = constantRouters.map((route: any) =>
    route.name === 'layout'
        ? { ...route, children: [...route.children, ...asyncRouters] }
        : route
)

let router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes, ...anyRouters],
    scrollBehavior () {
        //给路由添加滚动模式
        return {
            left:0,
            top:0
        }
    }
});

export default router;
