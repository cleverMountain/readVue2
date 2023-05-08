let finalPatches = {},
    rnIndex = 0

export default function doPatch(rDom, patches) {
  console.log(rDom, patches)
  finalPatches = patches
  rNodeWalk(rDom)
}

function rNodeWalk (rNode) {
  // 当patch
  const rnPatch = finalPatches[rnIndex++],
        childNodes = rNode.childNodes;

  // 递归找到真是节点children
  [...childNodes].forEach(c => {
    rNodeWalk(c)
  })
  if (rnPatch) {
    patchAction(rNode, rnPatch)
  }
}


function patchAction (rNode, rnPatch) {
  
}