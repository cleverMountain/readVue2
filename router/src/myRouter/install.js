
export let _Vue
export default function install(Vue) {
  _Vue = Vue
  _Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = _Vue.prototype.$router = this.$options.router
        this.$router.init(this)
      } 


    }
  })

  _Vue.component('router-link', {
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
  _Vue.component('router-view', {
    render() {
      return <div>空</div>
    }
  })
}
