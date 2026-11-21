//路由鉴权
import router from './router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user'
import pinia from './store'
let useuser = useUserStore(pinia)
nprogress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
    nprogress.start()
    //有无token两种情况
    if (useuser.token) {
        if (to.path == '/login') {
            return ({ path: '/home' })
        }
        if (useuser.username) {
            return true
        }
        try {
            await useuser.userInfo()
            return true
        } catch (error) {
            await useuser.userLogout()
            return ({ path: '/login', query: { redirect: to.path } })
        }
    } else {
        if (to.path === '/login') {
            return true
        }
        return ({ path: '/login', query: { redirect: to.path } })
    }
})

router.afterEach(() => {
    nprogress.done()
})
