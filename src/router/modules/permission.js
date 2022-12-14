import Layout from "@/layout";

export default {
    path: '/permission',
    name: 'permissions',
    component: Layout,
    children: [
        {
            name: 'permissions',
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/permission"),
            meta: { title: '权限管理', icon: 'lock' }
        }
    ]
}