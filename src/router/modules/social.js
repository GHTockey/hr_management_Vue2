import Layout from "@/layout";

export default {
    path: '/social',
    name: 'social',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/social"),
            meta: { title: '社保', icon: ''}
        }
    ]
}