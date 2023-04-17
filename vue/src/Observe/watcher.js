import { pushTarget, popTarget } from "./dep.js"
import { queueWatcher } from "../stateMixin/nextTick.js"

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

  this.vm = vm;

  vm._watcher = this;

  this.active = true
  this.cb = cb;
  this.id = ++uid;

  this.deps = [];

  this.depIds = new Set();



  if (typeof expOrFn === 'function') {
    // 更新视图方法
    this.getter = expOrFn;
  }
  // 执行getter就是渲染函数vm._update(vm._render())
  this.get()
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;
  value = this.getter.call(vm, vm);
  popTarget()
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
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    debugger
    queueWatcher(this);
  }
  // this.get()
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run() {
  if (this.active) {
    debugger
    this.get();
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

export default Watcher