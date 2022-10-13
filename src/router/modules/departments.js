import Layout from "@/layout";

export default {
    path: '/departments',
    // name: 'departments',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/departments"),
            meta: { title: '组织架构', icon: 'tree' }
        }
    ]
}