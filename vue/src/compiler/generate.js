function formatAttrs(attrs) {

  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]

    let styleStr = {}
    if (attr.name === 'style') {
      attr.value.split(';').forEach(styleArr => {
        let [key, value] = styleArr.split(':')
        styleStr[key] = value
      })
      str += attr.name + ':' + JSON.stringify(styleStr) + ','
    } else {
      str += attr.name + ':' + JSON.stringify(attr.value) + ','
    }

  }
  return str.slice(0, -1)
}

// 递归替换所有差值表达式
function replaceAll(str) {
  let code = ``
  let indexStart = str.indexOf('{{')
  let indexEnd = str.indexOf('}}')
  if (indexStart !== -1) {
    // 获取纯文本
    let strC = str.slice(0, indexStart)
    // 获取变量
    let strV = str.slice(indexStart + 2, indexEnd)
    // 递归替换
    let strNext = replaceAll(str.slice(indexEnd + 2))
    code += `_c(${strC ? `${strC} +` : ''}_s(${strV})${strNext ? `+ ${strNext}` : ''})`
    return code
  }
}
function getChildren(children) {
  let str = ''
  if (children.length < 1) return
  for (let i = 0; i < children.length; i++) {
    let child = children[i]

    if (child.type === 3) {
      
 
      // 文本节点,简单匹配没有匹配多个{{}}情况
      // let index = child.text.indexOf('{{')
      // console.log(index)
      // if (index !== -1) {
      //   if (index === 0) {
      //     str += `_s(${child.text.slice(index + 2, -2)}),`
      //   } else {
      //     str += `_v(${JSON.stringify(child.text.slice(0, index))} + _s(${child.text.slice(index + 2, -2)})),`
      //   }
      // } else {
      //   str += `_v(${JSON.stringify(child.text)})`
      // }
      str += replaceAll(child.text)
    }
    // 元素节点
    if (child.type === 1) {
      str += generate(child)
    }
  }
  return str
}
function generate(el) {
  let children = getChildren(el.children)
  let code = `
    _c(
      ${JSON.stringify(el.tagName)},
      {${el.attrs.length > 0 ? formatAttrs(el.attrs) : undefined}},
      ${children ? children : ''}
    )
  `
  return code
}


export { generate }