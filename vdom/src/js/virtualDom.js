function createElement(tag, props, children) {
  // let parent = document.createElement(tag)
  // parent.props = props
  const vDom = {
    type: '',
    children: [],
    props: {}
  }
  vDom.props = props
  vDom.type = tag
  vDom.children = children
  return vDom
  
}


export {
  createElement
}