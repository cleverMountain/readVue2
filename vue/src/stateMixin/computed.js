import Watcher from '../Observe/watcher.js'
import { Dep } from "../Observe/dep.js"

function noop(a, b, c) { }
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
function createComputedGetter(key) {

  return function computedGetter() {
    
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        // 执行lazy watcher 得到value
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      // getter的返回值
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  
  return function computedGetter() {
    return fn.call(this, this)
  }
}
function initComputed(vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    // getter即computed的回调函数
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      { lazy: true }
    );
    console.log(watchers)


    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      /**
       * 边界判断
       */
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(("The computed property \"" + key + "\" is already defined as a method."), vm);
      }
    }
  }
}
function defineComputed(
  target,
  key,
  userDef
) {
  var shouldCache = true;
  if (typeof userDef === 'function') {
    // get createComputedGetter(key)返回值
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    /**
     * 写法不同
     * aaa: {
     *  get: ,
     *  set: 
     * }
     */
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
    // 边界判断
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  // 给computed属性代理到vm上，并添加description
  debugger
  Object.defineProperty(target, key, sharedPropertyDefinition);
  
}


export {
  initComputed
}