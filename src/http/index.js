//拦截器配置
import axios from "axios"


axios.defaults.timeout = 5000; //设置请求超时时间

axios.interceptors.request.use(config => { //请求拦截,处理数据
    let token = JSON.parse(sessionStorage.getItem("token")) ? JSON.parse(sessionStorage.getItem("token")) : "";
    config.headers.Authorization = token;
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => { //响应拦截处理
    return response.data;
}, error => {
    return Promise.reject(error);
});

export default axios;