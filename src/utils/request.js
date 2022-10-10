import store from "@/store";
import axios from "axios";
import { Message } from "element-ui";

// 创建实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 读取 node 环境里的变量设为请求的基础地址
    timeout: 3000 // 超时时间
});
// 请求拦截
service.interceptors.request.use(config => {
    // 统一注入请求头
    if (store.getters.token) {
        // 如果token存在 注入token
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
}, error => {
    return Promise.reject(error)
});

// 响应拦截
service.interceptors.response.use(res => {
    const { data, message, success } = res.data;
    if (success) {
        return data;
    } else {
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message));
    }
});
// 默认导出
export default service;