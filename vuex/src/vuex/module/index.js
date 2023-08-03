import Module from "./module.js"

export function forEachObj(obj, cb) {
  Object.keys(obj).forEach(key => {
    cb(key, obj[key])
  })
}
export default class ModuleCollection {
  constructor(options) {
    this.root = null
    this.register([], options)
  }
  register(path, rootModule) {
    let newModule = new Module(rootModule)
    if (!this.root) {
      this.root = newModule

    } else {
      // 找parent
      // [a]
      // [a, b]

      let parent = path.slice(0, -1).reduce((start, current) => {
        return start.getChlidren(current)
      }, this.root)
      // path = [a] 时  parent  = root
      // path = [a, b] 时 parent = this.root._children['a']
      let key = path[path.length - 1]

      // debugger
      parent.addChildren(key, newModule)

    }
    if (rootModule.modules) {
      // Object.keys(rootModule.modules).forEach(key => {
      //   this.register(path.concat(key), rootModule.modules[key])
      // })
      forEachObj(rootModule.modules,  (key, value) => {
        this.register(path.concat(key), value)
      })
    }
  }
}