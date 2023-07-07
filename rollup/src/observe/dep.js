

/**
 * 每一个属性都对应一个dep，每一个dep都是被观察者，watcher是观察者，
 * 当dep发生改变时，watcher回去通知依赖更改
 */
let id = 0
class Dep {
  constructor () {
    this.id = id++,
    this.subs = [] // watcher的集合
  }
  /**
   * 1.通过dep的depend给watcher添加dep
   */
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 多对多
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null // 构造函数上的静态属性，有且只有一份

export default Dep