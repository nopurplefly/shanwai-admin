import request from "../../../utils/request"
import type{ ResponseData,RoleListData,RoleInfo,PowerRoleData} from './type'

//角色管理平台接口
enum API{
    GETROLELIST_URL = '/admin/acl/role/',
    ADDYOURROLE_URL = '/admin/acl/role/save',
    UPDATAYOURROLE = '/admin/acl/role/update',
    GETROLEPOWER_URL = '/admin/acl/permission/toAssign/',
    SETPOWER_URL = '/admin/acl/permission/doAssign',
    DELETEPOWER_URL = '/admin/acl/role/remove/',
}

export const reqRoleList = (page:number,limit:number,rolename?:string) =>{return request.get<any,ResponseData<RoleListData>>(API.GETROLELIST_URL + `${page}/${limit}?roleName=${rolename}`)}
export const reqAddorUpdataRole = (data:RoleInfo) =>{
    if(data.id){
        return request.put<any,ResponseData<any>>(API.UPDATAYOURROLE,data)
    }else{
        return request.post<any,ResponseData<any>>(API.ADDYOURROLE_URL,data)
    }
}
export const reqGetPower = (id:number) =>{return request.get<any,ResponseData<PowerRoleData[]>>(API.GETROLEPOWER_URL + `${id}`)}
export const reqSetPower = (roleId: number, permissionId:number[]) =>{return request.post<any,ResponseData<any>>(API.SETPOWER_URL +`?roleId=${roleId}&permissionId=${permissionId}`)}
export const reqDeletePower = (id:number) =>{return request.delete<any,ResponseData<any>>(API.DELETEPOWER_URL + `${id}`)}
