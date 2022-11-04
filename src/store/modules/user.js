import { login, getUserInfo, getUserDetailById } from "@/api/user"
import { setToken, getToken, removeToken, setTimeStamp } from "@/utils/auth";
import { resetRouter } from "@/router";
export default {
  namespaced: true,
  state: {
    token: getToken(), // 读取 cookIT 里的 token 将其存入
    userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
  },
  mutations: {
    updateToken: (state, payload) => state.token = payload,
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    },
    // 删除 token
    removeToken(state){
      state.token = null;
      removeToken(); // 删除 cookie 中的 token
    }
  },
  actions: {
    async getLoginToken(context, params) {
      let res = await login(params);
      if (res) {
        context.commit('updateToken', res);
        setToken(res); // 调用第三方包方法,将 token 存储到 cookie
        setTimeStamp(); // 存入时间戳
      } else {
        console.log('没有请求到相关数据');
      }
    },

    // 获取用户信息
    async getUserInfo(context) {
      let res = await getUserInfo();
      let res2 = await getUserDetailById(res.userId);
      context.commit('setUserInfo', { ...res, ...res2 }) // 将整个的个人信息设置到用户的vuex数据中
      return res // 这里为什么要返回 为后面埋下伏笔
      // 《后》 使 dispatch 调用时可以得到返回值
    },

    // 退出登录
    logout(context){
      context.commit('reomveUserInfo');
      context.commit('removeToken');
      resetRouter(); // 重置路由
    }
  }
}