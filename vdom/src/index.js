import { createElement, render, renderDom } from "./js/virtualDom"
import { domDiff } from "./js/domDifff"

// 虚拟dom
const vdom = createElement('ul', {
  class: 'list',
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
const vdom2 = createElement('ul', {
  class: 'list-wrap',
  style: "width: 300px; height: 300px; background-color: orange"
},
  [
    createElement('li', { class: "item", 'data-index': 0 }, [
      createElement('p', { class: 'title' }, ['特殊列表项'])
    ]),
    createElement('li', { class: "item", 'data-index': 1 }, [
      createElement('p', { class: 'text' }, [])
    ]),
    createElement('div', { class: 'item', 'data-index': 2 }, ['第三个列表'])
  ])
console.log(vdom2)
// 通过render转化成真实dom
const rDom = render(vdom)

// 渲染真实dom
renderDom(rDom, document.getElementById('app'))


// 获取patch补丁
const patches = domDiff(vdom, vdom2)

// 打补丁
doPatch(rDom, patches)

console.log(patches)