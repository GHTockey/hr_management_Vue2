import Layout from "@/layout";

export default {
    path: '/attendances',
    name: 'attendances',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/attendances"),
            meta: { title: '考勤' }
        }
    ]
}