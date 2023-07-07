
// 创建标签
function createElementVNode (tag, props, ...children) {
  return vnode(tag, props, props.key, children)
}
// 创建文本
function createTextVNode (text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode (tag, props, key, children, text) {
  return {
   tag,
   props,
   key,
   children,
   text
  }
 }

 export {createElementVNode, createTextVNode}