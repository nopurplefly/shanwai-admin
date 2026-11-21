import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from '../../api/user/indext'
import type { loginForm } from '../../api/user/type'
//引入常量路由
import { constantRouters,asyncRouters } from "../../router/router";

// 左侧菜单只取 layout 路由下的一级路由（隐藏在 mate.hidden 里控制）
const layoutRoute: any = constantRouters.find((item: any) => item.name === 'layout')

//计算用户需要返回的路由函数
function filterAsyncRouters(asnycRoute:any,routes:any){
    return asnycRoute.filter((item:any)=>{
        if(routes.includes(item.name)){
            if(item.children && item.children.length > 1){
                item.children = filterAsyncRouters(item.children,routes)
            }
            return true
        }
        return false
    })

}


let useUserStore = defineStore('User', {
    state: () => {
        return {
            token: localStorage.getItem('TOKEN'),
            menuRouters: layoutRoute ? layoutRoute.children : [],
            // 当前用户可访问的异步路由
            asyncRoutes: [] as any[],
            username: '',
            avatar: '',
            buttons:[] as string[],

        }
    },

    actions: {
        async userLogin(loginForm: loginForm) {
            const result: any = await reqLogin(loginForm)
            if (result.code === 200) {
                this.token = result.data
                //本地存储token
                localStorage.setItem('TOKEN', result.data)
                return 'ok'
            }
            else return Promise.reject(new Error(result.message))
        },

        async userInfo() {
            let result = await reqUserInfo()
            if (result.code == 200) {
                //路由筛选（深拷贝，避免多次调用时把静态数组改坏）
                const routes = filterAsyncRouters(
                    JSON.parse(JSON.stringify(asyncRouters)),
                    result.data.routes,
                )
                this.asyncRoutes = routes
                // 左侧菜单只包含可导航的页面。
                this.menuRouters = [
                    ...(layoutRoute ? layoutRoute.children : []),
                    ...routes,
                ]
                //按钮筛选
                this.buttons = result.data.buttons
                this.username = result.data.name
                this.avatar = result.data.avatar
                return 'ok'
            } else {
                return Promise.reject('获取用户信息失败')
            }
        },

        async userLogout() {
            // 先清本地状态，保证守卫一定能继续往下走
            this.token = ''
            this.username = ''
            this.avatar = ''
            this.asyncRoutes = []
            this.menuRouters = layoutRoute ? layoutRoute.children : []
            localStorage.removeItem('TOKEN')
            try {
                await reqLogout()
            } catch {
                // 后端退出失败也不影响前端已登出
            }
            return 'ok'
        }
    },
    getters: {

    }
})
export default useUserStore;
