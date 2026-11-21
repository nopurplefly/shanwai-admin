//定义用户相关接口的类型
export interface loginForm {
    username: string,
    password: string
};


export interface reqForm {
    code: number,
    data: string,
    message:string,
    ok:boolean,
}

export interface UserInfo {
    userId: number
}

export interface User {
    routes:string[],
    buttons:string[],
    roles:string[],
    name:string
    avatar:string
}

//定义服务器返还相关的数据类型
export interface UserReqForm {
    code: number,
    message: string,
    data: User,
    ok:boolean
}

//服务器退出
export interface UserReqLogout{
    code:number,
    message:string
    data:any,
    ok:boolean
}