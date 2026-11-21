//sku商品列表接口
import request from "../../../utils/request";
import type{SkuListData,ResponseData} from "./type";
enum API{
    GETSKULIST_URL = "/admin/product/list/",
    LAUNCHSKU_URL = "/admin/product/onSale/",
    WITHDRAWSKU_URL = "/admin/product/cancelSale/",
    GETSKUINFO_URL = "/admin/product/getSkuById/",
    GETSKUDETAILS_URL = "/admin/product/getSkuInfo/",
    DELETESKU_URL = "/admin/product/deleteSku/"

}

export const reqSKUList = (page:number,limit:number) => request.get<any,ResponseData<SkuListData>>(API.GETSKULIST_URL+`${page}/${limit}`)
export const reqLaunchSKU = (skuId:number) => request.get<any,ResponseData<any>>(API.LAUNCHSKU_URL+`${skuId}`)
export const reqWithdrawSKU = (skuId:number) => request.get<any,ResponseData<any>>(API.WITHDRAWSKU_URL+`${skuId}`)
export const reqSKUInfo = (skuId:number) => request.get<any,ResponseData<any>>(API.GETSKUINFO_URL+`${skuId}`)
export const reqSKUDetails = (skuId:number) => request.get<any,ResponseData<any>>(API.GETSKUDETAILS_URL+`${skuId}`)
export const reqDeleteSKU = (skuId:number) => request.delete<any,ResponseData<any>>(API.DELETESKU_URL+`${skuId}`)