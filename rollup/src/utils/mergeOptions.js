
const starts = {}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
];
LIFECYCLE_HOOKS.forEach(hook => {
  starts[hook] = function (p, c) {
    if (c) {
      if (p) {

        // 儿子有父亲有
        return p.concat(c)
      } else {
        // 儿子有父亲没有
        return [c]
      }
    } else {
      // 儿子没有，父亲有

      return p
    }
  }
})
starts.components = function (parent, child) {

  const res = Object.create(parent)
  if (child) {
    for(let key in child) {
      res[key] = child[key]
    }
  }
  return res
}
export default function mergeOptions(parent = {}, child = {}) {
  const options = {}
  function mergeField(key) {
    if (starts[key]) {
      // 策略模式中有
      /**
       * {
       *  created: [], 进行再处理
       *  a: 1 
       * }
       */
      options[key] = starts[key](parent[key], child[key])
    } else {
      // 没有直接赋值
      options[key] = child[key] || parent[key]
    }

  }

  // 先合并父亲再合并儿子
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // console.log(options)
  return options
}