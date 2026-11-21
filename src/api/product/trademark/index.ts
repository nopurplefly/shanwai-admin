//品牌管理模块的接口
import request from "../../../utils/request";
import type{reqTrademarkType,Trademark} from './type'
enum API{
    TRADEMARK_API = '/admin/product/baseTrademark/',
    ADDTRADEMARK_API = '/admin/product/baseTrademark/save',
    UPDATETRADEMARK_API = '/admin/product/baseTrademark/update',
    DELETETRADEMARK_API = '/admin/product/baseTrademark/remove/'

}

export const reqHasTrademark = (page:number,limit:number)=>{return request.get<any,reqTrademarkType>(API.TRADEMARK_API + `${page}/${limit}`)}
export const reqUpdateandAddTrademark = (data:Trademark) =>{
    if(data.id){
        return request.put(API.UPDATETRADEMARK_API,data)
    }else{
        return request.post(API.ADDTRADEMARK_API,data)
    }

}
export const reqDeleteTrademark = (id:number) => {return request.delete<any,any>(API.DELETETRADEMARK_API + `${id}`)}