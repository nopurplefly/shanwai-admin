//用户管理模块
import request from "../../../utils/request";
import type { UserData,ResponseData,UserInfo,reqRole } from "./type";
enum API{
    GETUSERLIST_URL = "/admin/acl/user/",
    UPDATAUSER_URL = "/admin/acl/user/update",
    ADDUSER_URL = "/admin/acl/user/save",
    ROLECHARACTER_URL = '/admin/acl/user/toAssign/',
    DELETEUSER_URL = '/admin/acl/user/remove/',
    BATCHDELETE_URL = '/admin/acl/user/batchRemove'
}

export const reqGetUserList = (pageNo:number,pageSize:number,username?:string) => request.get<any,ResponseData<UserData>>(`${API.GETUSERLIST_URL}${pageNo}/${pageSize}?username=${username}`)

export const reqUpdataOrAddUser = (data:UserInfo)=>{
    if(data.id){
        return request.put<any,ResponseData<any>>(API.UPDATAUSER_URL,data)
    }else{
        return request.post<any,ResponseData<any>>(API.ADDUSER_URL,data)
    }
}
export const reqRoleUser = (id:number)=>{return request.get<any,ResponseData<reqRole>>(API.ROLECHARACTER_URL + `${id}`)}
export const reqAssignRole = (userId:number, roleIdList:number[]) =>request.post<any, ResponseData<any>>('/admin/acl/user/doAssignRole', { userId, roleIdList })
export const reqDeleteUser = (id:number) =>{return request.delete<any,ResponseData<any>>(API.DELETEUSER_URL + `${id}`)}
export const reqBatchDelete = (idList:number[]) =>{return request.delete<any,ResponseData<any>>(API.BATCHDELETE_URL,{data:idList})}

