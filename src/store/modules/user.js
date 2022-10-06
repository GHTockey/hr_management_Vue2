import { login } from "@/api/user"
import { setToken } from "@/utils/auth";
export default {
  namespaced: true,
  state: {
    token:''
  },
  mutations: {
    updateToken: (state,payload) => state.token = payload,
  },
  actions: {
    async getLoginToken(context,params) {
      let res = await login(params);
      if (res) {
        context.commit('updateToken',res);
        setToken(res); // 调用第三方包方法,将 token 存储到 cookie
      } else {
        console.log('没有请求到相关数据');
      }
    }
  },
  getters: {

  }
}