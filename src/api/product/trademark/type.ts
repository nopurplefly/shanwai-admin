//品牌管理模块的类型
export interface reqTrademarkType{
    code:number,
    message:any,
    data:TrademarkDataType,
    ok:boolean
}

export interface TrademarkDataType{
    records:TrademarkRecord[]
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number
}

export interface TrademarkRecord {
    createTime: string
    updateTime: string
    tmName: string
    logoUrl: string
    id: number
}

export interface Trademark{
    id?:number,
    tmName:string,
    logoUrl:string
}

