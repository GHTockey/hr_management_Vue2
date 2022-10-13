import Layout from "@/layout";
// import Approvals from "@/views/approvals"

export default {
    path: '/approvals',
    // name: 'approvals',
    component: Layout,
    children: [
        {
            path: '', // 值为空表示在加载上一级路由时同时默认加载本路由
            // component: Approvals,
            component: () => import("@/views/approvals"),
            meta: { title: '审批', icon: 'tree-table' }
        }
    ]
}