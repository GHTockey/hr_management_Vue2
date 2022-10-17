import request from "@/utils/request";

// 获取list
export function getDepartments() {
    return request({
        url: '/company/department'
    })
}

// 删除部门
export function delDepartments(id) {
    console.log(id);
    return request({
        url: `/company/department/${id}`,
        method: 'delete'
    })
}

// 新增部门接口
export function addDepartments(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}

// 获取员工的简单列表
export function getEmployeeSimple() {
    return request({
        url: '/sys/user/simple'
    })
}

// 获取部门详情 getDepartDetail
export function getDepartDetail(id) {
    return request({
        url: `/company/department/${id}`
    })
}

// 编辑部门
export function updateDepartments(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}