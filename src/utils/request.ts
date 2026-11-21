import axios from 'axios'
import { notify } from './notify'
//携带token
import useUserStore from '../store/modules/user'
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
});
//请求拦截器
request.interceptors.request.use((config) => {
    let Token = useUserStore().token
    if(Token){
        config.headers.Token = Token
    }
    return config;
});

//请求响应器
request.interceptors.response.use((response) => {
    return response.data
}, (err) => {
    let message = '';
    //http状态码
    const status = err.response?.status;
    switch (status) {
        case 401:
            message = "TOKEN过期"
            break;
        case 403:
            message = "无权访问"
            break;
        case 404:
            message = "请求地址错误";
            break;
        case 500:
            message = "服务器出现问题"
            break;
        default:
            message = '网络问题'
            break;

    }
    notify('error', message);

    return Promise.reject(err);
});

export default request;



