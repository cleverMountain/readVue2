
function forEachObj(obj, cb) {
  Object.keys(obj).forEach(key => {
    cb(key, obj[key])
  })
}
export default class Module {
  constructor(options) {
    this._raw = options
    this._children = {}
    this.state = options.state
  }
  getChlidren(key) {
    return this._children[key]
  }
  addChildren(key, module) {

    this._children[key] = module
  }
  forEachMutations(cb) {
    if (this._raw.mutations) {
      forEachObj(this._raw.mutations, cb)
    }
  }
  forEachActions(cb) {
    if (this._raw.actions) {
      forEachObj(this._raw.actions, cb)
    }
  }
  forEachWrappedGetters(cb) {
    if (this._raw.getters) {
      forEachObj(this._raw.getters, cb)
    }
  }
  forEachModuls(cb) {
    console.log(this._children)
    forEachObj(this._children, cb)
  }
}