
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);


var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

methodsToPatch.forEach(function (method) {
  // arrayMethods[method] = arrayProto[method]
  var original = arrayProto[method];
  let mutator = function () {
  
    var args = [], len = arguments.length;
    while (len--) args[len] = arguments[len];
    console.log(arguments)
    console.log(args)
    
    var result = original.apply(this, args);
    var ob = this.__ob__; //  __ob__是Observer属性
    var inserted;
    // 改变数组长度的方法需要
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }

    ob.dep.notify();
    return result
  }
  def(arrayMethods, method, mutator);
});



export { arrayMethods }