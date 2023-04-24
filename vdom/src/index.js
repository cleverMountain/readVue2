import {createElement} from "./js/virtualDom"

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