//定义项目中跟用户有关的接口
import request from "../../utils/request";
import type {loginForm,UserReqForm,reqForm,UserReqLogout} from './type'
enum API{
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    USER_LOGOUT = '/admin/acl/index/logout'
}

export const reqLogin = (data:loginForm)=>{return request.post<any,reqForm>(API.LOGIN_URL,data)}
export const reqUserInfo = ()=>{ return request.get<any,UserReqForm>(API.USERINFO_URL)}
export const reqLogout = ()=>{return request.post<any,UserReqLogout>(API.USER_LOGOUT)}