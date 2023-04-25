import { TEXT, ATTR, REMOVE, REPLACE } from "./patchTypes"

let patches = {}
function domDiff(oldVDom, newVDom) {
  let index = 0
  vnodeWalk(oldVDom, newVDom, index)
  return patches
}

function vnodeWalk (oldVDom, newVDom, inde) {

}

export {
  domDiff
}