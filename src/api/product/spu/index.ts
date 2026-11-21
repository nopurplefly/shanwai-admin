import request from "../../../utils/request";
import type{ViewSKUData,SKUData,SPUList ,reqbaseSaleAttrList,reqspuImageLis,reqspuSaleAttrListData,trademark,recordsData} from './type' 
enum API{
    HASSPU_URL = '/admin/product/',
    //获取全部品牌的数据
    TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    BASESALELIST_URL = '/admin/product/baseSaleAttrList',
    SPUIMAGE_URL = '/admin/product/spuImageList/',
    //SPU销售属性
    SPUSALE_URL = '/admin/product/spuSaleAttrList/',
    //添加和更新SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    UPDATASPU_URL = '/admin/product/updateSpuInfo',
    //在spu模块添加sku
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //在spu模块查看sku
    ViewSKU_URL = '/admin/product/findBySpuId/',
    DeleteSPU_URL = '/admin/product/deleteSpu/'

}

export const reqSPULIst = (page:number | string,limit:number,category3Id:number)=>{return request.get<any,SPUList>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)}
export const reqTradeMark = ()=>{return request.get<any,trademark>(API.TRADEMARK_URL)}
export const reqBaseList = ()=>{return request.get<any,reqbaseSaleAttrList>(API.BASESALELIST_URL)}
export const reqSPUImage = (id:number)=>{return request.get<any,reqspuImageLis>(API.SPUIMAGE_URL + `${id}`)}
export const reqSPUSaleList = (id:number)=>{return request.get<any,reqspuSaleAttrListData>(API.SPUSALE_URL + `${id}`)} 
//有 id 走更新，没有 id 走新增
export const reqAddorUpadataSPU = (data:recordsData)=>{
    if(data.id){
        return request.post(API.UPDATASPU_URL,data)
    }else{
        return request.post(API.ADDSPU_URL,data)
    }

}
export const reqAddSKU = (data:SKUData)=>{return request.post<any,any>(API.ADDSKU_URL,data)}
export const reqViewSKU = (id:number)=>{return request.get<any,ViewSKUData>(API.ViewSKU_URL + `${id}`)}
export const reqDeleteSPU = (id:number)=>{return request.delete<any,any>(API.DeleteSPU_URL + `${id}`)}

