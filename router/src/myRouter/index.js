
import Vue from "vue"
import createMatcher from "./createMatcher"
import install from "./install"
import HTML5History from "./history/history"
import HashHistory from "./history/hash"



export class Router {
  constructor(options) {
    this.options = options
    this.routes = options.routes || []
    this.beforeHooks = []
    this.afterHooks = []
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
    history.listen((newRoute) => {
      app._route = newRoute
    })
  }
  push(location) {
    let history = this.history

    history.transitionTo(location, () => {
      window.location.hash = location
    })
  }
  match(location) {

    return this.matcher.match(location)
  }
  beforeEach(cb) {
    this.beforeHooks.push(cb)
  }
  afterEach(cb) {
    this.afterHooks.push(cb)
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
    component: () => import('../views/AboutView.vue') //Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'), //() => import('../views/Home.vue'),
    children: [
      {
        path: '/b',
        name: 'B',
        component: () => import('../views/B.vue')
      }
    ]
    // children: [
    //   // {
    //   //   path: '/first-page',
    //   //   name: 'FirstPage',
    //   //   meta: {
    //   //     isAuth: true
    //   //   },
    //   //   component: () => { return 'first-page' }  //() => import('../views/FirstPage/index.vue')
    //   // },
    //   // {
    //   //   path: '/pic-management',
    //   //   name: 'PicManagement',
    //   //   meta: {
    //   //     isAuth: true
    //   //   },
    //   //   component: () => import('../views/PicManagement/index.vue')
    //   // },
    //   // {
    //   //   path: '/departments-management',
    //   //   name: 'DepartmentsManagement',
    //   //   meta: {
    //   //     isAuth: true
    //   //   },
    //   //   component: () => import('../views/DepartmentsManagement/index.vue')
    //   // },
    //   // {
    //   //   path: '/account-management',
    //   //   name: 'AccountManagement',
    //   //   meta: {
    //   //     isAuth: true
    //   //   },
    //   //   component: () => import('../views/AccountManagement/index.vue'),
    //   // },
    //   // {
    //   //   path: '/operate-history',
    //   //   name: 'OperateHistory',
    //   //   meta: {
    //   //     isAuth: true
    //   //   },
    //   //   component: () => import('../views/OperateHistory/index.vue')
    //   // },
    // ]
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

router.beforeEach((to, form, next) => {
  setTimeout(() => {
    console.log(to)
    console.log(1)
    next()
  })
})
router.beforeEach((to, form, next) => {
  setTimeout(() => {
    console.log(2)
    next()
  })
})
router.afterEach((to, form) => {
  console.log(to, 'to')
  console.log(form, 'form')
  console.log(3)

})
router.afterEach((to, form) => {
  console.log(4)

})
console.log(router)
export default router