import Dep from "../observe/dep"
import Watcher from "../observe/watcher"

function noop () {}

function initComputed(vm, computed) {
  let watchers = vm._computedWatchers = Object.create(null)
  for(let key in computed) {
    let setter = computed[key].set || noop
    let getter = computed[key].get || noop
    watchers[key] = new Watcher(vm, getter, {lazy: true})
    defineComputed(vm, key, getter)
  }
}

function defineComputed (vm, key, getter) {
  getter = createComputedGetter(key)
  Object.defineProperty(vm, key, {
    get: getter
  })
}

function createComputedGetter (key) {
  return function computedGetter() {
    let watcher = this._computedWatchers && this._computedWatchers[key];
    // 最开始dirty为true
    if (watcher) {
      // 执行evaluate，调用this.get刷新页面
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        
        watcher.depend();
      }
      
      return watcher.value
    }
  }
}
export default initComputed 