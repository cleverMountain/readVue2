/**
 * 过程：
 * 1.把真实dom变成ast语法树(vnode)
 * 2.把vNode编程render函数
 * 3.再执行render函数变成真实dom
 */
import { parseHTML } from "./parse.js"
import { generate } from "./generate.js"

function compileToFunction(template) {
  // 创建ast语法树
  const ast = parseHTML(template)
  // 把语法树变成字符串
  const code = generate(ast)
  // 将字符串变成render函数
  const render = new Function(`with(this){return ${code}}`)
  return render
}

export { compileToFunction }