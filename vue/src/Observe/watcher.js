import { pushTarget, popTarget } from "./dep.js"
import { queueWatcher } from "../stateMixin/nextTick.js"
import { invokeWithErrorHandling } from "../stateMixin/watch.js"

let uid = 0;

/**
 * 1.一个模板一个Watcher(data)
 * 2.一个Watcher多个dep
 * 3.如果多个组件共用了某些数据，则一个数据对应多个Watcher
 */
function Watcher(
  vm,
  expOrFn,
  cb,
  options
) {
  // new watcher
  this.vm = vm;
  // old watcher
  vm._watcher = this;
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.dirty = this.lazy; // for lazy watchers
  this.expression = expOrFn.toString();
  this.active = true
  this.cb = cb;
  this.id = ++uid;

  this.deps = [];

  this.depIds = new Set();


  // 执行getter就是渲染函数vm._update(vm._render())
  if (typeof expOrFn === 'function') {

    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);

  }
  // // 更新视图方法 
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  // 同时包含oldwatcher与new watcher可以取到新旧值
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);

  } catch (e) {

  } finally {

    if (this.deep) {
      // traverse(value);
    }
    popTarget();
    // this.cleanupDeps();
  }


  return value
};

/**
 * Add a dependency to this directive.
 */
// 一个watcher对应对个dep
// new Watcher时一个组件对应一个watcher
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;
  if (!this.depIds.has(id)) {
    this.depIds.add(id);
    this.deps.push(dep);
    dep.addSub(this);
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update() {

  console.log(this)

  // const {cb, vm, value} = this
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {

    queueWatcher(this);
    // 更新值触发回调，拿到新值与旧值
    // invokeWithErrorHandling(cb, vm, [value, vm.name], vm, 'info11')

  }
  // this.get()
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run() {


  if (this.active) {

    let value = this.get(); // 更新时得到的新值

    if (this.user) {
      let oldVlue = this.value // 第一次调用get绑定的老值
      this.value = value
      console.log(oldVlue, this.value)
      // wtach监听
      invokeWithErrorHandling(this.cb, this.vm, [oldVlue, value], this.vm, 'info11')
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend() {

  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown() {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};




function parsePath(path) {
  var segments = path.split('.');
  return function (obj) {
    // 深度监听，通过数组的方式
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}
export default Watcher