import { TEXT, ATTR, REMOVE, REPLACE } from "./patchTypes"

let patches = {}
let index = 0
function domDiff(oldVDom, newVDom) {
  let index = 0
  // 遍历/递归
  vnodeWalk(oldVDom, newVDom, index)
  return patches
}

function vnodeWalk(oldNode, newNode, index) {
  let vnPatch = []
  // 不存在，打一个删除补丁
  if (!newNode) {
    vnPatch.push({
      type: REMOVE,
      index
    })
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    // 文本节点，都是字符串,不相等打一个补丁
    if (oldNode !== newNode) {
      vnPatch.push({
        type: 'TEXT',
        text: newNode
      })
    }
  } else if (newNode.type === oldNode.type) {
    // 同类元素
    // 补丁节点
    const attrPatch = attrWalk(oldNode.props, newNode.props)
    // console.log(attrPatch)
    if (Object.values(attrPatch).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch
      })
    }

    // 遍历儿子
    childrenWalk(oldNode.children, newNode.children)
 
  } else if (newNode.type !== oldNode.type) {
    // 节点替换
    vnPatch.push({
      type: 'REPLACE',
      newNode
    })
  } 

  if (vnPatch.length > 0) {
    patches[index] = vnPatch
  }

}

function attrWalk(oldAttrs, newAttrs) {
  let attrPatch = {}
  // 老attrs，新的不一样或者没有
  for (let k in oldAttrs) {
    if (oldAttrs[k] !== newAttrs[k]) {
      attrPatch[k] = newAttrs[k]
    }
  }
  // 新增的
  for (let k in newAttrs) {
    if (!oldAttrs.hasOwnProperty(k)) {
      attrPatch[k] = newAttrs[k]
    }
  }
  return attrPatch
}
function childrenWalk(oldChildren, newChildren) {
  oldChildren.forEach((child, inx) => {
    vnodeWalk(child, newChildren[inx], ++index)
  })
}

export {
  domDiff
}