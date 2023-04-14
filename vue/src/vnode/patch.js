function patch(oldVnode, Vnode) {
  //原则  将虚拟节点转换成真实的节点
  // console.log(oldVnode, Vnode)  //注意oldVnode 需要在加载 mount 添加上去  vm.$el= el

  let el = createELm(Vnode) // 产生一个新的DOM
  let parentElm = oldVnode.parentNode //获取老元素（app） 父亲 ，body
  //插入
  parentElm.insertBefore(el, oldVnode.nextSibling) //当前真实的元素插入到app 的后面
  parentElm.removeChild(oldVnode) //删除老节点
  //重新赋值
  return el
}

function createELm(vnode) {
  let { tag, children, key, data, text } = vnode
  //注意
  if (typeof tag === 'string') { //创建标签元素 放到 vnode.el上
    vnode.el = document.createElement(tag)
    //有儿子
    children && children.length > 0 && children.forEach(child => {
      // 递归 儿子 将儿子渲染后的结果放到 父亲中
      vnode.el.appendChild(createELm(child))
    })
  } else { //文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el //新的dom
}
export { patch }