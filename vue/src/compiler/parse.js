// 解析标签和属性的正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配到的是属性，如 a=b,key 是匹配到第一个分组，value 的值可能是 Group 3、Group 4、Group 5 其中的一个，即第二个分组，第三个分组和第四个分组其中一个。
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配到的分组是标签开始部分，如：<div
const startTagClose = /^\s*(\/?)>/ //匹配到的是开始标签的结束部分，如 > 或者 />。
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配到的分组是标签结束部分，如 </div>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配到的是我们表达式的内容，如 {{ name }}



function parseHTML(html) {
  let root
  let stack = []
  let currentParent
  while (html) {

    let textStart = html.indexOf('<')

    // 匹配到开始标签
    if (textStart == 0) {
      let startTag = handleStart()

      if (startTag) {
        start(startTag.tagName, startTag.attrs)
      }

    }


    // 匹配到文本
    if (textStart > 0) {
      let text = html.slice(0, textStart)

      if (text) {
        chars(text)

        advance(textStart)
      }


    }
    // 匹配结束标签

    let endTagMatch = html.match(endTag)
    if (endTagMatch) {
      end(endTagMatch[1])
      advance(endTagMatch[0].length)

    }

  }




  function handleStart() {
    let match
    let end
    let attr
    const start = html.match(startTagOpen)
    if (start) {
      match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
    }
    // 处理标签内部
    attr = html.match(attribute) // 匹配到属性
    end = html.match(startTagClose) // 匹配到闭合标签
    while (attr && !end) {
      match.attrs.push({
        name: attr[1],
        value: attr[3]
      })
      advance(attr[0].length)
      attr = html.match(attribute) // 匹配到属性
      end = html.match(startTagClose) // 匹配到闭合标签

    }
    // 匹配到结束标签
    if (end) {
      advance(end[0].length)
    }
    return match
  }

  function chars(text) {
    text = text.trim()

    if (text) {
      currentParent.children.push({
        type: 3,
        text,
        // parent: currentParent
      })
    }

  }

  function advance(len) {
    html = html.slice(len)
  }


  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)

  }
  function end(tag) {

    let element = stack.pop()

    currentParent = stack[stack.length - 1]
    if (currentParent) {
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  return root
}



function createASTElement(tagName, attrs, parent) {
  return {
    tagName,
    type: 1,
    attrs,
    children: [],
    parent
  }
}


export { parseHTML }