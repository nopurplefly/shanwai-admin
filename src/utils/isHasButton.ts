import pinia from "../store";
import useUserStore from '../store/modules/user'
const userStore = useUserStore(pinia)

//全局自定义指令判断按钮权限
export function isHasButton(app:any){
    // 注意：Vue3 注册指令用的是 app.directive（单数），app.directives 不存在
    app.directive('has',{
        //el是使用自定义指令的dom元素,binding是配置项
        mounted(el:any,binding:any){
            if(!userStore.buttons.includes(binding.value)){
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    })
}
