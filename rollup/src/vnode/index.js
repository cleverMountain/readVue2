function isReservedTag(tag) {
  return ['a', 'span', 'div', 'ul', 'li', 'p'].includes(tag)
}



// 创建标签
function createElementVNode(tag, props, ...children) {
  const vm = this
  if (isReservedTag(tag)) {

    return vnode(tag, props, props.key, children)
  } else {

    // 组件的构造函数
    const Ctor = vm.$options.components[tag] // 有可能是函数也有可能是对象
    createComponentVnode(tag, props, props.key, children, Ctor, vm)
  }

}
// 创建文本
function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode(tag, props, key, children, text, componentOptions) {
  return {
    tag,
    props,
    key,
    children,
    text,
    componentOptions
  }
}

function createComponentVnode(tag, props, key, children, Ctor, vm) {

  // console.log(Ctor, vm)
  // debugger
  // 如果是对象则使用extend构造子类
  if (typeof Ctor === 'object') {
    Ctor = vm.$options._base.extend(Ctor)
  }
  props.hook = {
    init(vnode) {
      vnode.componentInstance = new vnode.componentOptions.Ctor
    }
  }
  console.log(Ctor)
  return vnode(tag, props, key, children,null, {Ctor})
}

export { createElementVNode, createTextVNode }