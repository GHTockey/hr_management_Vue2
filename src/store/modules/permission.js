import { constantRoutes, asyncRoutes } from "@/router";
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
    routes: constantRoutes // 所有人默认拥有静态路由
};
const mutations = {
    // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
    setRoutes(state, newRoutes) {
        // 每次更新 都应该在静态路由的基础上进行追加
        state.routes = [...constantRoutes, ...newRoutes]
    },
};
const actions = {
    //  筛选权限路由  调用时传入对应参数
    filterRouter(context, menus) {
        let routes = [];
        menus.forEach(item => {
            routes.push(...asyncRoutes.filter(el => el.name === item))
        });
        context.commit('setRoutes',routes);
        return routes;
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};