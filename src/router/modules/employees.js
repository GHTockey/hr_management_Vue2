import Layout from "@/layout";

export default {
    path: '/employees',
    name: 'employees',
    component: Layout,
    children: [
        {
            name: 'employees',
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/employees"),
            meta: { title: '员工', icon: 'people' }
        },
        {
            path: 'detail/:id?', // query 传参
            component: () => import('@/views/employees/detail'),
            hidden: true,
            meta: { title: '员工详情' }
        },

        {
            path: 'print/:id?',
            component: () => import('@/views/employees/printInfo.vue'),
            meta: { title: '打印' },
            hidden: true
        }

    ]
}