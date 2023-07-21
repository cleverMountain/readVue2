
export let _Vue
export default function install(Vue) {
  // _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // Vue.prototype.$router = _Vue.prototype.$router = this.$options.router
        // this.$router.init(this)
        // Vue.prototype.$route = _Vue.prototype.$route = this.$options.router.history.current
        // // 定义$router
        // _Vue.util.defineReactive(this, '$router', this.$options.router)
        // // 定义$route
        // _Vue.util.defineReactive(this, '$route', this.$options.router.history.current)
        // console.log(this)
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)

      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }


    }
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() { return this._routerRoot._route }
  })
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        require: true
      }
    },
    methods: {
      handler() {
        this.$router.push(this.to)
      }
    },
    render() {
      // console.log(this.$slots)
      return <a onClick={this.handler}>{this.$slots.default}</a>
    }
  })
  Vue.component('router-view', {
    functional: true, // 函数组件
    props: {
      name: {
        type: String,
        default: 'default'
      }
    },
    render(h, { parent }) {

      let route = parent.$route
     
      let match = route.matched[0]
     
      if (match) {
        return h(match.component)
      } else {
        return h()
      }
      
    }
  })
}
