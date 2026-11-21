export interface Category1Data {
    name: string,
    id: number
}

export interface Category1 {
    code: number,
    message: any,
    data: Category1Data[],
    ok: boolean
}

export interface Category2Data {
    name: string,
    category1Id: number,
    id: number
}
export interface Category2 {
    code: number,
    message: any,
    data: Category2Data[],
    ok: boolean
}
export interface Category3Data {
    name: string,
    category2Id: number,
    id: number
}

export interface Category3 {
    code: number,
    message: any,
    data: Category3Data[],
    ok: boolean
}

//获取属性类型
export interface attrValueList {
    valueName: string,
    attrId?: number,
    id?: number
}
export interface ValueDate {
    createTime?:string,
    updateTime?:string,
    attrName:string,
    categoryId:number | string,
    categoryLevel:number,
    attrValueList:attrValueList[],
}
export interface CategoryValueType{
    code:number,
    message:string,
    data:ValueDate[],
    ok:boolean,
    id?:number
}