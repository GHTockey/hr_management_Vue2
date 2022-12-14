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

// 获取用户的基本资料
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}

// 获取某个用户的基本信息 
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}
