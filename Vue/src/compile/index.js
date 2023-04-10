import {parseHTML} from './parseAst'
import { generate } from './generate';
export function compileToFunction(el) {

   //1 将html 变成ast 语法树
    let ast = parseHTML(el)
    console.log(ast)
    //2 ast 语法树变成 render 函数  （1） ast 语法树变成 字符串  （2）字符串变成函数 
    let code = generate(ast) // _c _v _s
    // 3将render 字符串变成 函数
    let render = new Function(`with(this){return ${code}}`)
    console.log(render)
    
}


/**
 * <div id="app"> hello {{msg}} <h></h></div>
 * 
 * 
 *  render(){ _c 解析标签
 *   retrun _c('div'，{id:app},_v('hell'+_s(msg)),_c)
 * }
 * 
 */

//  let objs = {a:1,b:2}
//  with(objs){
//       console.log(a,b)
//  }