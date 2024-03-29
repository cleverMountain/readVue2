import { install, Vue } from "./install"
import ModuleCollection from "./module/index"
// export let Vue

// class Store {
//   constructor(options) {
//     const { state, getters, mutations, actions, modules } = options
//     // this.state = {}
//     this.getters = {}
//     this.mutations = mutations
//     this.actions = actions
//     this.modules = modules
//     // let stateKeys = Object.keys(state)
//     // stateKeys.forEach(key => {
//     //   Object.defineProperty(this.state, key, {
//     //     get() {
//     //       return state[key]
//     //     },
//     //     set(newVal) {
//     //       // console.log(newVal)
//     //       // return 19
//     //       state[key] = newVal
//     //     }
//     //   })
//     // })
//     this._vm = new Vue({
//       data() {
//         return {
//           $$state: state
//         }
//       }
//     })
//     let getterKeys = Object.keys(getters)
//     getterKeys.forEach(key => {
//       Object.defineProperty(this.getters, key, {
//         get() {
//           return getters[key](state)
//         }
//       })
//     })
//     // this.handleModules(this)
//   }
//   // get state() {
//   //   return this._vm._data.$$state
//   // }
//   // commit(method, payload) {
//   //   this.mutations[method](this.state, payload)
//   // }
//   // dispatch(method, payload) {
//   //   this.actions[method]({commit: this.commit.bind(this)}, payload)
//   // }
//   // handleModules(self) {
//   //   if (!this.modules) return
//   //   // console.log(this.modules)
//   //   Object.keys(this.modules).forEach(module => {
//   //     const son = new Store(this.modules[module])
//   //     // console.log(son)
//   //     // console.log(this.modules[module])
//   //     console.log(self.state)
//   //     self.state[module]= son
//   //     if (son.modules) {
//   //       this.handleModules(self)
//   //     }
//   //   })

//   // }
// }

/**
 * {
 *  state: 
 *  _raw:
 *  _child:{
 *    state:
 *    _raw
 *    _child
 *  }
 * }
 */
function installModule(store, rootState, path, rootModule) {

  if (path.length === 0) {
    // 根模块
    store.state = rootState

  } else {
    /**
     * [a]
     * {}.a = age
     * [a, b]
     * {b}.b = age
     */
    const parent = path.slice(0, -1).reduce((start, cur) => {
      start = rootState[cur]
      return start
    }, rootState)
    parent[path[path.length - 1]] = rootModule.state

  }
  let k = path.join('/') ? path.join('/') + '/' : ''
  rootModule.forEachMutations((key, value) => {

    store._mutations[k + key] = store._mutations[k + key] || []
    store._mutations[k + key].push((payload) => {
      value(rootModule.state, payload)
    })
  })
  rootModule.forEachActions((key, value) => {
    store._actions[k + key] = store._actions[k + key] || []
    store._actions[k + key].push((payload) => {
      value.call(store, store, payload)
    })
  })
  rootModule.forEachWrappedGetters((key, value) => {
    store._wrappedGetters[k + key] = () => {
      return value(rootModule.state)
    }
  })


  rootModule.forEachModuls((key, value) => {
    installModule(store, rootState, path.concat(key), value)
  })
}

class Store {
  constructor(options) {
    // 格式化
    this._modules = new ModuleCollection(options)
    console.log(this._modules)
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)
    const state = this._modules.root.state
    installModule(this, state, [], this._modules.root)
    // console.log(this)
  }
  commit(type, payload) {
    console.log(this)

    this._mutations[type].forEach(fn => fn(payload))
    console.log(this.state)
  }
  dispatch(type, payload) {
    let that = this
    that._actions[type].forEach(fn => fn.call(that, payload))
  }
}

export default {
  Store,
  install
}