// ---------- 通用响应 ----------
export interface ResponseData<T> {
  code: number
  message: string
  data: T
  ok: boolean
}

// ---------- SKU 列表返回 ----------
export interface SkuListData {
  records: SkuInfo[]
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

// ---------- 单条 SKU ----------
export interface SkuInfo {
  id: number                 
  spuID: number             
  category3Id: number
  tmId: number
  skuName: string
  weight: number
  price: number
  skuDesc: string
  skuDefaultImg: string
  isSale: number             
  skuAttrValueList: SkuAttrValue[] | null
  skuSaleAttrValueList: SkuSaleAttrValue[] | null
  skuImageList: SkuImg[] | null
}

// ---------- 平台属性 ----------
export interface SkuAttrValue {
  id: number
  attrId: number
  valueId: number
  valueName: string
  attrName: string
  skuId: number
}

// ---------- 销售属性 ----------
export interface SkuSaleAttrValue {
  id: number
  saleAttrId: number
  saleAttrValueId: number
  saleAttrName: string
  saleAttrValueName: string
  skuId: number
}

// ---------- SKU 图片 ----------
export interface SkuImg {
  id: number
  skuId: number
  imgName: string
  imgUrl: string
  spuImgId: number
  isDefault: string        
}