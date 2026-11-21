//属性管理模块的接口
import request from "../../../utils/request";
import type { Category1,Category2,Category3,CategoryValueType ,ValueDate} from "./type";
enum API {
    C1_API = '/admin/product/getCategory1',
    C2_API = "/admin/product/getCategory2/",
    C3_API = '/admin/product/getCategory3/',
    CATEGORYVALUE_API = '/admin/product/attrInfoList/',
    ADDORUPDATA_API = '/admin/product/saveAttrInfo',
    DELETEATTR_API = '/admin/product/deleteAttr/'

}

export const reqCategory1 = ()=>{return request.get<any,Category1>(API.C1_API)}
export const reqCategory2 = (category2id:number)=>{return request.get<any,Category2>(API.C2_API + category2id)}
export const reqCategory3 = (category3id:number)=>{return request.get<any,Category3>(API.C3_API + category3id)}
export const reqCategoryValue = (c1id:number|string,c2id:number|string,c3id:number)=>{return request.get<any,CategoryValueType>(API.CATEGORYVALUE_API + `${c1id}/${c2id}/${c3id}`)}
export const reqUpdataorCategory = (data:ValueDate) =>{return request.post<any,any>(API.ADDORUPDATA_API,data)}
export const reqDeleteAttr = (id:number) =>{return request.delete<any,any>(API.DELETEATTR_API + id)}