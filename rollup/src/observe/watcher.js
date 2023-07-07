import { queueWatcher } from "../utils/nextTick"
import Dep from "./dep"


let targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

let id = 0
class Watcher {
  constructor(vm, expOrFn, options, cb) {

    this.id = id++
    if (typeof expOrFn === 'string') {
      this.getter = function () {
        return vm[expOrFn]
      }
    } else {
      this.getter = expOrFn
    }
    
    this.vm = vm
    this.deps = [] // 依赖
    this.depIds = new Set()
    this.lazy = options.lazy // computed懒属性
    this.dirty = this.lazy // 脏值检测
    this.user = options.user
    this.cb = cb
    this.value = this.lazy ? undefined : this.get()


  }
  get() {
debugger
    pushTarget(this)
    let value = this.getter.call(this.vm) // 调用getter将this指向绑定为vm，否则this指向watcher
    popTarget()
    return value
  }
  /**
   * 一个数据对应一个依赖
   * new Watcher时一个视图对应了一个watcher,但是一个视图可以有多个数据，所以一个watcher对应对个dep
   * 由于一个数据可能同事被几个视图引用所以对应多个watcher
   * 最终watcher与dep是多对多的关系
   */
  addDep(dep) {
    const id = dep.id
    // 对dep进行去重
    if (!this.depIds.has(id)) {
      this.deps.push(dep)
      this.depIds.add(id)
      dep.addSub(this) // 给dep添加watcher
    }
    // console.log(this.depIds, this.deps)
  }
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }

    // this.get()
  }
  run() {
   console.log(this)
   
    if (this.user) {
      this.cb(321)
    } else {
      this.get()
    }
    
  }
  evaluate() {
    // 会保留当前的计算属性值
    this.value = this.get();
    // dirty设为false，当连续调用computed时就无法触发evaluate方法
    this.dirty = false;
  }
  depend() {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };
}


export default Watcher