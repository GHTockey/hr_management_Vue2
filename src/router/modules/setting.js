import Layout from "@/layout";

export default {
    path: '/setting',
    // name: 'setting',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            component: () => import("@/views/setting"),
            meta: { title: '公司设置' , icon: 'setting'}
        }
    ]
}