
import Vue from "vue"
import createMatcher from "./createMatcher"
import install from "./install"
import HTML5History from "./history/history"
import HashHistory from "./history/hash"



export class Router {
  constructor(options) {
    this.options = options
    this.routes = options.routes || []
    // 映射表
    this.matcher = createMatcher(options.routes || [], this)
    // 根据不同模式创建不同路由系统
    this.mode = options.mode
    if (this.mode == 'hash') {
      this.history = new HashHistory(this)
    } else if (this.mode == 'history') {
      this.history = new HTML5History(this)
    }
  }

  init(app) {
    let history = this.history
    // console.log(history.getCurrentLocation())
    // 监听路由变化
    /**
     * 1.根据路径变化匹配对应组件
     */
    history.transitionTo(history.getCurrentLocation(), () => {
      history.setupListeners()
    })
  }
  push(location) {
    let history = this.history
    history.transitionTo(location)
  }
  match(location) {

    return this.matcher.match(location)
  }
}
Router.install = install

Vue.use(Router)

const routes = [
  // {
  //   path: '',
  //   name: '登录页面',
  //   redirect: '/login'
  // },
  {
    path: '/about',
    name: 'About',
    component: () => { return 'about' } //Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => { }, //() => import('../views/Home.vue'),
    children: [
      {
        path: '/first-page',
        name: 'FirstPage',
        meta: {
          isAuth: true
        },
        component: () => { return 'first-page' }  //() => import('../views/FirstPage/index.vue')
      },
      // {
      //   path: '/pic-management',
      //   name: 'PicManagement',
      //   meta: {
      //     isAuth: true
      //   },
      //   component: () => import('../views/PicManagement/index.vue')
      // },
      // {
      //   path: '/departments-management',
      //   name: 'DepartmentsManagement',
      //   meta: {
      //     isAuth: true
      //   },
      //   component: () => import('../views/DepartmentsManagement/index.vue')
      // },
      // {
      //   path: '/account-management',
      //   name: 'AccountManagement',
      //   meta: {
      //     isAuth: true
      //   },
      //   component: () => import('../views/AccountManagement/index.vue'),
      // },
      // {
      //   path: '/operate-history',
      //   name: 'OperateHistory',
      //   meta: {
      //     isAuth: true
      //   },
      //   component: () => import('../views/OperateHistory/index.vue')
      // },
    ]
  }
]
const router = new Router({
  mode: 'hash',
  routes,
  base: '1'
})
// router.matcher.addRoutes(
//   [
//     {
//       path: '/a',
//       name: 'A',
//       component: () => { return 'a' }, //Login
//       children: [
//         {
//           path: '/b',
//           name: 'B',
//           component: () => { return 'b' }, //Login
//         }
//       ]
//     }
//   ]
// )
// router.matcher.addRoute(
//   {
//     path: '/c',
//     name: 'C',
//     component: () => { return 'c' }, //Login
//     children: [
//       {
//         path: '/d',
//         name: 'D',
//         component: () => { return 'd' }, //Login
//       }
//     ]
//   }
// )
console.log(router)
export default router