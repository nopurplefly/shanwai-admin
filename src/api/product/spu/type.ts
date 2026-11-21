//获取SPU分页列表
export interface SPUList {
    code: number,
    message: any,
    data: SPUdata,
    ok: boolean,
}

export interface SPUdata {
    records: recordsData[],
    spuSaleAttrList: spuSaleAttrListData[],
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number,


}

export interface recordsData {
    createTime?: string,
    updateTime?: string,
    spuName: string,
    description: string,
    category3Id: number,
    tmId: number,
    spuImageList: spuImageListData[],
    spuSaleAttrList: spuSaleAttrListData[],
    id?: number

}

export interface spuSaleAttrListData {
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuId?: number,
    spuSaleAttrValueList: spuSaleAttrValueListData[]
    id?: number
}

export interface spuImageListData {
    spuId?: number,
    id?: number,
    imgName: string,
    imgUrl: string
}

export interface spuSaleAttrValueListData {
    saleAttrValueName: string,
    baseSaleAttrId: number,
    spuId?: number,
    id?: number
}

//spu里面的全部属性数据类型
export interface reqbaseSaleAttrList {
    code: number,
    message: string,
    data: baseSaleAttrList[]
    ok: boolean
}

export interface baseSaleAttrList {
    id: number,
    name: string
}

//SPU里面图片的属性类型
export interface reqspuImageLis {
    code: number,
    message: any,
    data: spuImageListData[],
    ok: boolean
}

//SPU里面销售属性的类型
export interface reqspuSaleAttrListData {
    code: number,
    message: string,
    data: spuSaleAttrListData[],
    ok: boolean,
}

//spu全部品牌的类型
export interface trademarkData {
    tmName: string,
    logoUrl: string,
    id: number,
}

export interface trademark {
    code: number,
    message: string,
    data: trademarkData[],
    ok: boolean,
}

//spu中添加sku的接口类型
export interface SKUData {
    category3Id: string | number,
    spuID: string | number,
    tmId: string | number, 
    skuName: string,
    price: string | number, 
    weight: string | number, 
    skuDesc: string, 
    skuAttrValueList: Array<{
        attrId: string | number, 
        valueId: string | number, 
    }>, 
    skuSaleAttrValueList: Array<{
        saleAttrId: string | number, 
        saleAttrValueId: string | number, 
    }>, 
    skuDefaultImg: string, 
    isSale: number,
}

//spu中查看sku的接口类型
export interface ViewSKUData {
    code: number,
    message: string,
    ok:boolean,
    data:SKUData[]
}
