import {install, Vue} from "./install"

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
class ModuleCollection {
  constructor (options) {
    this.root = null
    this.register([], options)
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }
    if (!this.root) {
      this.root = newModule
    
    } else {
      // 找parent
      // [a]
      // [a, b]
      let parent = path.slice(0, -1).reduce((start, current) => {
   
        let b = start._children[current]
    //  debugger
        return b
      }, this.root)
      // path = [a] 时  parent  = root
      // path = [a, b] 时 parent = this.root._children['a']
      let key = path[path.length - 1]
      console.log(parent, key)
      // debugger
      parent._children[key] = newModule
    }
    if (rootModule.modules) {
      Object.keys(rootModule.modules).forEach(key => {
        this.register(path.concat(key), rootModule.modules[key])
      })
    }
  }
}

class Store {
  constructor (options) {
    this._modules = new ModuleCollection(options)
    console.log(this._modules)
  }

}



export default {
  Store,
  install
}