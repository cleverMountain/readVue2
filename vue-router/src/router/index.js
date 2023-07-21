import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, form, next) => {
  setTimeout(() => {
    console.log(1)
    next()
  })
})
router.afterEach((to, form) => {
  console.log(to, 'to')
  console.log(form, 'form')

})
router.beforeResolve((to, from, next) => {
  console.log(to, 'resolve')
  next()
})
export default router
