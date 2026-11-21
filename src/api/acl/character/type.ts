//角色管理平台接口类型
export interface ResponseData<T> {
    code: number
    message: string
    data: T
    ok: boolean
}

export interface RoleListData {
    records: RoleRecordsData[]
    total: number,
    size: number,
    current: number,
    pages: number,
    searchCount: boolean
}

export interface RoleRecordsData {
    createTime: string,
    updateTime: string,
    roleName: string,
    remark: string,
    id: number,
}

export interface RoleInfo {
    id?: number,
    roleName: string,
    remark: string
}

export interface PowerRoleData {
    createTime: string,
    updateTime: string,
    name: string,
    pid: number,
    code: string,
    toCode: string,
    type: number,
    status: string,
    level: number,
    children:PowerRoleData[],
    select: true,
    id: number,
}



