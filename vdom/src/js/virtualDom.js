import Element from "./Element"

function createElement(tag, props, children) {

  return new Element(tag, props, children)


}

function render(vdom) {
  const { type, props, children } = vdom
   let el // 根节点
  el  = type ? document.createElement(type) : document.createTextNode(vdom)
  handleAttrs(el, props)
  handleChildren(el, children)
  return el
}

function handleAttrs (el, props) {
  for(let key in props) {
    // 输入框直接添加props
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = props[key]
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function handleChildren (el, children) {
  if (children && children.length > 0) {
    children.forEach(child => {
      el.appendChild(render(child))
    })
  }
}

function renderDom (el, root) {
  root.appendChild(el)
}

export {
  createElement,
  render,
  renderDom
}