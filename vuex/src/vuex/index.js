
export let Vue

class Store {
  constructor(options) {
    const { state, getters, mutations, actions, modules } = options
    // this.state = {}
    this.getters = {}
    this.mutations = mutations
    this.actions = actions
    this.modules = modules
    // let stateKeys = Object.keys(state)
    // stateKeys.forEach(key => {
    //   Object.defineProperty(this.state, key, {
    //     get() {
    //       return state[key]
    //     },
    //     set(newVal) {
    //       // console.log(newVal)
    //       // return 19
    //       state[key] = newVal
    //     }
    //   })
    // })
    this._vm = new Vue({
      data() {
        return {
          $$state: state
        }
      }
    })
    let getterKeys = Object.keys(getters)
    getterKeys.forEach(key => {
      Object.defineProperty(this.getters, key, {
        get() {
          return getters[key](state)
        }
      })
    })
    this.handleModules(this)
  }
  get state() {
    return this._vm._data.$$state
  }
  commit(method, payload) {
    this.mutations[method](this.state, payload)
  }
  dispatch(method, payload) {
    this.actions[method]({commit: this.commit.bind(this)}, payload)
  }
  handleModules(self) {
    if (!this.modules) return
    // console.log(this.modules)
    Object.keys(this.modules).forEach(module => {
      const son = new Store(this.modules[module])
      // console.log(son)
      // console.log(this.modules[module])
      console.log(self.state)
      self.state[module]= son
      if (son.modules) {
        this.handleModules(self)
      }
    })
  
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