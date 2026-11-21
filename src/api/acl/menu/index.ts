//菜单管理的接口
import request from "../../../utils/request";
import type{MenuList,ResponseData,MenuInfo} from './type'
enum API{
    GETMENULIST_URL = '/admin/acl/permission',
    ADDMENU_URL = '/admin/acl/permission/save',
    UPDATAMENU_URL = '/admin/acl/permission/update',
    DELETEMENU_URL = '/admin/acl/permission/remove/'
}
export const reqMenuList = ()=>{return request.get<any,ResponseData<MenuList[]>>(API.GETMENULIST_URL)}
export const reqAddOrUpdataMenu = (data:MenuInfo) =>{
    if(data.id){
        return request.put<any,ResponseData<any>>(API.UPDATAMENU_URL,data)
    }else{
        return request.post<any,ResponseData<any>>(API.ADDMENU_URL,data)
    }
}
export const reqDeleteMenu = (id:number) =>{return request.delete<any,ResponseData<any>>(API.DELETEMENU_URL + `${id}`)}