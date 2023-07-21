
export let Vue

class Store {
  constructor(options) {
    const { state, getters, mutations, actions, modules } = options
    this.state = {}
    this.getters = {}
    this.mutations = mutations
    this.actions = actions
    let stateKeys = Object.keys(state)
    stateKeys.forEach(key => {
      Object.defineProperty(this.state, key, {
        get() {
          return state[key]
        },
        set(newVal) {
          // console.log(newVal)
          // return 19
          state[key] = newVal
        }
      })
    })
    let getterKeys = Object.keys(getters)
    getterKeys.forEach(key => {
      Object.defineProperty(this.getters, key, {
        get() {
          return getters[key](state)
        }
      })
    })
  }
  commit(method, payload) {
    

    this.mutations[method](this.state, payload)
  }
  dispatch(method, payload) {
    // this.actions[method]({ commit: this.commit.call(this, method, payload) })
    this.actions[method]({commit: this.commit.bind(this)}, payload)
  }
}
const install = _vue => {

  Vue = _vue
  Vue.mixin({
    beforeCreate() {
      // console.log(this)
      // debugger
      if (this.$options.store) {
        // 根
        this.$store = this.$options.store
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    }
  })

}
export default {
  Store,
  install
}