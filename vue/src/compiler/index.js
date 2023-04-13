/**
 * 过程：
 * 1.把真实dom变成ast语法树(vnode)
 * 2.把vNode编程render函数
 * 3.再执行render函数变成真实dom
 */
import { parseHTML } from "./parse.js"
import { generate } from "./generate.js"

function compileToFunction(template) {

  const ast = parseHTML(template)

  
  const code = generate(ast)

  return code
}

export { compileToFunction }