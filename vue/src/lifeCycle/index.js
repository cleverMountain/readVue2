function mountComponent(vm, el) {
  // 
  callHook(vm, 'beforeMount');
  console.log(vm)
  debugger
} 



// 调用生命周期函数，执行生命周期中的回调函数
function callHook(vm, hook) {
  const handlers = vm.$options[hook] 
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); 
    }
  }
}
export { mountComponent, callHook }