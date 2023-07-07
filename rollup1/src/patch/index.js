function patch(root, vonde) {
  const { tag, el, props, children, text, key } = vonde
  let newEle = createDom(tag, props, children, text, key)
  // console.log(root.nextSibling.nextSibling, '1')
  // console.log(root.previousSibling , '2')
  // 该节点的下一个节点
  document.body.insertBefore(newEle, root.nextSibling)
  document.body.removeChild(root)
  return newEle
}

function createDom(tag, props, children, text, key) {
  let contain
  if (tag) {
    contain = document.createElement(tag)
  } else {
    contain = document.createTextNode(text)
  }
  if (key) {
    contain.setAttribute('key', key)
  }
  if (props) {
    for (let k in props) {
      if (k !== 'style') {
        contain.setAttribute(k, props[k])
      } else {
        for (let p in props['style']) {
          const pName = p.trim()
          contain['style'][pName] = props['style'][p]
        }
      }
    }
  }
  if (children && children.length > 0) {
    children.forEach(child => {
      const { tag, el, props, children, text, key } = child
      const childDom = createDom(tag, props, children, text, key)
      contain.appendChild(childDom)
    })
  }
  return contain
}

export { patch }