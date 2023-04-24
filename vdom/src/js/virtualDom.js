function createElement (tag, props, children) {
  // let parent = document.createElement(tag)
  // parent.props = props
  const vDom = {
    type: '',
    children: [],
    props: {}
  }
  vDom.props = props
  vDom.type = tag
  // vDom.children = 
  // console.log(vDom)
  if (Array.isArray(children) && children.length > 0) {
 
    children.forEach(child => {
      let tag, props, son
      if (typeof child == 'string') {
        son = child
      } else {
        console.log(child)
        tag = child[0]
        props = child[1]
        son = child[2]
      }
      vDom.children.push(createElement(tag, props, son))
    })
  }
  console.log(vDom)
} 


export {
  createElement
}