function createRoute(record, location) {
  let matched = []
  while (record) {
    
    matched.unshift(record)
    record = record.parent
  }
  return {
    ...location,
    matched
  }
}

function runQueue(queue, from, to, cb) {
  function next (index) {
    if (index >= queue.length) {
      return cb()
    }
    let hook = queue[index]
    hook(to, from, () => {
      next(index+1)
    })
  }
  next(0)
}

export default class History {
  constructor(router) {
    this.router = router
    this.current = createRoute(null, {
      path: '/'
    })
    this.cb = null
  }
  transitionTo(location, listener) {
    // // console.log(location)
    // // debugger
    // console.log(this.router.matcher.match(location))
    // // 获取路径
    // console.log(this.router)
    //  path: '/about', match: [about]
    // console.log(this.router)
    // debugger
    let queue = [].concat(this.router.beforeHooks)

    let record = this.router.match(location)

    // console.log(record)
    let route = createRoute(record, { path: location })
    // 去重
    if (location === this.current.path && route.matched.length === this.current.matched.length) {
      return
    }


    // console.log(route, 'route')
    // queue to from cb
    runQueue(queue, this.current, route, () => {
      let que = [].concat(this.router.afterHooks)
      que.forEach(cb => cb(this.current, route))
      this.current = route
      this.cb && this.cb(route)
      listener && listener()
    })

  }
  listen(cb) {
    this.cb = cb
  }
} 