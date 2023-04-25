import { createElement, render, renderDom } from "./js/virtualDom"
import { domDiff } from "./js/domDifff"

// 虚拟dom
const vdom = createElement('ul', {
  class: 'lis',
  style: "width: 300px; height: 300px; background-color: orange"
},
  [
    createElement('li', { class: "item", 'data-index': 0 }, [
      createElement('p', { class: 'text' }, ['第一个列表'])
    ]),
    createElement('li', { class: "item", 'data-index': 1 }, [
      createElement('p', { class: 'text' }, [
        createElement('span', { class: 'title' }, ['第二个列表'])
      ])
    ]),
    createElement('li', { class: 'item', 'data-index': 2 }, ['第三个列表'])
  ])
console.log(vdom)

// 通过render转化成真实dom
const rDom = render(vdom)

// 渲染真实dom
renderDom(rDom, document.getElementById('app'))


// 
const patches = domDiff(vdom1, vdom2)