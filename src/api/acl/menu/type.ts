//菜单管理接口数据类型

export interface ResponseData<T> {
    code: number
    message: string
    data: T
    ok: boolean
}

export interface MenuList {
    createTime: string,
    updateTime: string,
    name: string,
    pid: number,
    code: string,
    toCode: string,
    type: number,
    status: string,
    level: number,
    children: MenuList[],
    select: boolean,
    id: number
}

export interface MenuInfo {
    id?: number,
    name: string,
    pid: number,
    code: string,
    level: number
}