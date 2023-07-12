
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 小a-z 大A到Z 标签名称： div  span a-aa
//?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 捕获这种 <my:xx> </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//属性匹配   <div id="atts"></div>  // aa = "aa" | aa = 'aa'
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{xx}}  默认的 双大括号
//vue3 一摸一样的
function createASTELement(tagName, attrs) {
    return {
        tag: tagName, //标签名称
        type: 1, //元素类型
        children: [],// 孩子列表
        attrs,   //属性集合
        parent: null  // 父元素
    }
}
let root,
    currentParent,
    stack = []
function start (tagName, attrs) {
    let element = createASTELement(tagName, attrs)
    if (!root) {
        root = element
    }
    currentParent = element
    stack.push(element)
}
function end () {
    // 从栈中取出一个
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
        element.parent = currentParent
        currentParent.children.push(element)
    }
}
function chars (text) {
    // console.log(text)
    text = text.replace(/\s/g, '')
    if (text) {
        currentParent.children.push({
            type: 3, //元素类型
            text,// 孩子列表
        })
    }
}


export function parseHTML(html) {
    //1解析标签  <div id="my">hello {{name}} <span>world</span></div>
    while (html) { // 只要html 不为空字符串就一直执行下去
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {

            const startTagMatch = parseStartTag() //开始标签匹配结果
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                
                continue; //中断（循环中）的一个迭代，如果发生指定的条件。然后继续循环中的下一个迭代。
            }
            
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end()
                advance(endTagMatch[0].length)
                continue
            }
            // console.log(html)
        }
        //文本 
        let text;
        if (textEnd > 0) {
            // console.log(textEnd)
            text = html.substring(0, textEnd)
            if (text) {//处理文本
                chars(text)
                advance(text.length)
               
            }
           
        }
    }
    //删除标签
    function advance(n) { //将字符串进行截取操作，再跟新到html
        html = html.substring(n)

    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            /**
             *  复杂写法
             *  let end = html.match(startTagClose),
             *  attr = attr = html.match(attribute)
             *  // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
             *  while(!end && attr) {
             *     console.log(attr)
             *     match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] })
             *     advance(attr[0].length)
             *     end = html.match(startTagClose)
             *     attr = attr = html.match(attribute)
             *  }
             */
            let end,
                attr
            // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            // 匹配到闭合标签结束处理
            if (end) {
                advance(end[0].length)
                return match
            }
        }


    }
    // console.log(root)
    return root
}