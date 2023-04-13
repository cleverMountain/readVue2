import { Observer } from "./Observer.js"

function observe(value) {


  return new Observer(value);

}


export { observe }