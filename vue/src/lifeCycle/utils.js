var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];
let strats = Object.create(null)


LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;

});

function mergeHook(
  parentVal,
  childVal
) {

  // 源码写的不容易理解
  // var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  /**
   * 1.如果孩子没有取返回爹
   * 2.如果孩子有，爹没有，返回孩子，孩子必须是数组([child])
   * 3.如果孩子有爹也有，则拼接孩子与爹
   */
  let res
  if (childVal) {
    if (parentVal) {
      res = parentVal.concat(childVal)
    } else if (Array.isArray(childVal)) {
      res = childVal
    } else {
      res = [childVal]
    }
  } else {
    res = parentVal
  }
  console.log(res)
  
  return res ? dedupeHooks(res) : res
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

function mergeOptions(
  parent,
  child,
  vm
) {


  // 父亲合并儿子，都没有都加入，儿子有的父亲会覆盖
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {

    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    // 如果注册了生命周期则会调用strats[key]
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  return options
}


var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};


export {
  LIFECYCLE_HOOKS,
  mergeOptions
}