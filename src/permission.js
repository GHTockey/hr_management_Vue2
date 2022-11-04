import store from "@/store";
import router from "@/router";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

const whiteList = ['/login', '/404'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // console.log(!!store.getters.token);
  if (store.getters.token) { // 有无 token
    if (to.path === '/login') { // 是否在登录页
      next('/');
    } else {
      if (!store.state.user.userInfo.userId) {
        let { roles } = await store.dispatch('user/getUserInfo');
        // console.log(roles);
        // 调用 actions 过滤权限路由
        let routes = await store.dispatch('permission/filterRouter', roles.menus);
        // console.log(routes);
        router.addRoutes([...routes, { path: '/404', component: () => import('@/views/404'), hidden: true },]);
        next(to.path);
      } else {
        next();
      }
    }
  } else { // 没有 token
    if (whiteList.indexOf(to.path) != -1) { // hash 是否在白名单
      next();
    } else { // 不在白名单
      next('/login');
    }
  }

  NProgress.done();
});

// router.afterEach(route => {
//   NProgress.done();
// })



















// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
