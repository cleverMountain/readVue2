import { observe } from "./index.js"
import { arrayMethods } from "./array.js"

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

function defineReactive(obj, key, val) {
  // 递归劫持对象数据
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      return val
    },
    set: function reactiveSetter(newVal) {
      val = newVal

    }
  });
}
function protoAugment(target, src) {
  target.__proto__ = src;
}




function Observer(value) {
  
  this.value = value;
  // 给valeu添加__ob__
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    // value.__proto__ = arrayMethods
    // 调用重写的方法
    protoAugment(value, arrayMethods);
    this.observeArray(value);
  } else {
    // 对象时
    this.walk(value);
  }
};

Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};


Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    // 直接就返回值了
    observe(items[i]);
  }
};



export { Observer }