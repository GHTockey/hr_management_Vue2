import request from '@/utils/request'

// 登录
export function login(data) {
    return request({
        url: '/sys/login',
        method: 'post',
        data
    })
}

// 获取信息
export function getInfo(token) {

}

// 退出登录
export function logout() {

}
