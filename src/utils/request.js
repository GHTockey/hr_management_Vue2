import store from "@/store";
import axios from "axios";
import { Message } from "element-ui";
import { getTimeStamp } from "@/utils/auth";
import router from "@/router";
let TimeOut = 3600; // 设置 token 的有效时间 秒

// 创建实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 读取 node 环境里的变量设为请求的基础地址
    timeout: 8000 // 请求超时时间
});
// 请求拦截
service.interceptors.request.use(config => {
    // 统一注入请求头
    if (store.getters.token) {
        // 检测 token 有无过期
        if (IsCheckTimeOut()) {
            store.dispatch('user/logout') // 登出操作
            // 跳转到登录页
            router.push('/login')
        }

        // 如果 token 存在 注入 token
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

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
  }

// 默认导出
export default service;