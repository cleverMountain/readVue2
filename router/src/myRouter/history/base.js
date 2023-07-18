export default class History {
  constructor(router) {
    this.router = router
  }
  transitionTo(location, listener) {
    // // console.log(location)
    // // debugger
    // console.log(this.router.matcher.match(location))
    // // 获取路径
    // console.log(this.router)

    let record = this.router.match(location)
    console.log(record)

    
    listener && listener()
  }
} 