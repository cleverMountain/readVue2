function mountComponent(vm, el) {
  callHook(vm, 'beforeMount');
}



function callHook(vm, hook) {
 
  const handlers = vm.$options[hook] 
  debugger
  if (handlers) {
    for (let i = 0; i < handlers.lenght; i++) {
      handlers[i].call(vm); //改变生命周期中的this
    }
  }
}
export { mountComponent, callHook }