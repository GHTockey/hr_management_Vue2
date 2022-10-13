import Layout from "@/layout";

export default {
    path: '/employees',
    // name: 'employees',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/employees"),
            meta: { title: '员工', icon: 'people' }
        }
    ]
}