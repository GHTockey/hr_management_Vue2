import Layout from "@/layout";

export default {
    path: '/salarys',
    // name: 'salarys',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/salarys"),
            meta: { title: '工资', icon:'money' }
        }
    ]
}