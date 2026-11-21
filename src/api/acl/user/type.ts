//用户管理模块接口定义
export interface ResponseData<T> {
    code: number
    message: string
    data: T
    ok: boolean
}

export interface UserData {
    total: number,
    size: number,
    current: number,
    pages: number,
    records: UserInfoData[]

}

export interface UserInfoData {
    createTime: string,
    updateTime: string,
    id: number,
    username: string,
    roleName: string,
    password: string,
    name: string,
    phone: string
}

export interface UserInfo {
    id?: number,
    username: string,
    name: string,
    password?: string,
}

export interface assignRoles {
    createTime: string,
    updateTime: string,
    roleName: string,
    remark: string,
    id: number
}

export interface allRolesList {
    createTime: string,
    updateTime: string,
    roleName: string,
    remark: string,
    id: number
}

export interface reqRole{
    assignRoles:assignRoles[]
    allRolesList:allRolesList[]
}