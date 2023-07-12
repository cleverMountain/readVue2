function createComponent (vnode) {
  let i = vnode.props
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
}



function patch(oldNode, newNode) {
  debugger
  // 首次加载root是真实dom存在nodeType
  const isRealElement = oldNode.nodeType

  // if (isRealElement) {

  //   let newEle = createEle(newNode)
  //   // console.log(root.nextSibling.nextSibling, '1')
  //   // console.log(root.previousSibling , '2')
  //   // 该节点的下一个节点
  //   document.body.insertBefore(newEle, oldNode.nextSibling)
  //   document.body.removeChild(oldNode)


  //   return newNode
  // } else {

  //   return patchVnode(oldNode, newNode)
  // }
  let newEle = createEle(newNode)
  // console.log(root.nextSibling.nextSibling, '1')
  // console.log(root.previousSibling , '2')
  // 该节点的下一个节点
  oldNode.parentNode.insertBefore(newEle, oldNode.nextSibling)
  oldNode.parentNode.removeChild(oldNode)


  return newEle
}

function createEle(vonde) {
  // 是否是组件还是元素
  if (createComponent(vonde)) {
    return 
  }

  const { tag, el, props, children, text, key } = vonde
  if (tag) {
    vonde.el = document.createElement(tag) // 将真实dom挂到虚拟dom上
  } else {
    vonde.el = document.createTextNode(text)
  }
  if (key) {
    vonde.el.setAttribute('key', key)
  }
  patchProps(vonde.el, {}, props)
  if (children && children.length > 0) {
    children.forEach(child => {
      const childDom = createEle(child)
      vonde.el.appendChild(childDom)
    })
  }
  return vonde.el
}



function patchProps(el, oldProps, newProps) {

  // 1.老的有 新的没有 则删除属性
  let oldStyle = oldProps?.style
  let newStyle = newProps?.style
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for(let key in oldProps) {
    if (newProps[key]) {
      el.removeAttribute(key)
    } 
  }
  if (newProps) {
    for (let k in newProps) {
      if (k !== 'style') {
        el.setAttribute(k, newProps[k])
      } else {
        for (let p in newProps['style']) {
          const pName = p.trim()
          el['style'][pName] = newProps['style'][p]
        }
      }
    }
  }
}

function isSameVnode(node1, node2) {
  return node1.tag === node2.tag && node2.key === node2.key
}

function patchVnode(oldNode, newNode) {
  // patch算法,同级比对，广度优先
  // 1.两个节点不是一个节点tag变化
  // 2.两个节点是同一个节点（tag， key），复用老节点
  // 3.节点比肩完毕，比较儿子
  const isSameNode = isSameVnode(oldNode, newNode)
  console.log(oldNode, newNode)
  // 1.不同节点
  if (!isSameNode) {
    // 不同直接替换，老节点的父亲替换老节点
    let el = createEle(newNode)
    oldNode.el.parentNoed.replaceChild(el, oldNode.el)
    return el
  }
  // 2.相同节点， 是文本，同级
  let el = newNode.el = oldNode.el// 互用老节点的元素
  if (isSameNode && !oldNode.tag) {
  
    // 不相同用新文本替换旧文本
    if (oldNode.text !== newNode.text) {
      el.textContent = vonde.text
      return el
    }
  }
  // 3.是标签，比对标签的属性,同级
  patchProps(el, oldNode.props, newNode.props)

  // 4.比较儿子，一边有儿子一边没有儿子 ， 两边都有儿子
  let oldChildren = oldNode.children || []
  let newChildren = newNode.children || []
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 都有
    upDateChildren(el, oldChildren, newChildren)
  } else if (oldChildren.length > 0) {
    // 老的有新的没有
  } else if (newChildren.length > 0) {
    // 新的有老的没有
  }
  console.log(oldChildren, newChildren)
  return el
}


function upDateChildren(el, oldChildren, newChildren) {
  console.log(el, oldChildren, newChildren)
  // 采用双指针的方式
}
export { patch }