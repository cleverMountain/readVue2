import History from "./base";


function ensureURL() {
  // console.log(window.location)
  if (window.location.hash) {
    return
  }
  window.location.hash = '/'
}

// 获取路径
function getHash() {
  let href = window.location.href
  const index = href.indexOf('#')
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}

export default class HashHistory extends History {
  constructor(router) {
    super(router)
    // console.log(router)
    ensureURL()
  }
  setupListeners() {
    // hashchange
    window.addEventListener('hashchange', () => {
      this.transitionTo(getHash())
    })
  }
  // 获取当前路径
  getCurrentLocation() {
    return getHash()
  }
}