// 创建路由映射
function createRouteMap(routes, routeMap) {
  routeMap = routeMap || {}
  routes.forEach(route => {
    createRouteRecord(route, routeMap)
  })
  console.log(routeMap, 'routeMap')
  return { routeMap }
}
function createRouteRecord(route, routeMap, parentPath, parent) {
 
  const { path, children, props, meta, component } = route
  if (!routeMap[path]) {
    if (!parentPath) {
      routeMap[path] = {
        path, props, meta, component,
      }
    } else {
      routeMap[parentPath + path] = {
        path: parentPath + path
        , props, meta, component,
        parent
      }
    }

  }
  if (children) {
    // 拼接父子path
    children.forEach(child => { createRouteRecord(child, routeMap, path, route) })
  }
}
export default function createMatcher(routes) {
  const { routeMap } = createRouteMap(routes)
  // 动态创建路由多个
  function addRoutes(_routes) {
    createRouteMap(_routes, routeMap)
  }
  // 单个
  function addRoute(_route) {
    createRouteMap([_route], routeMap)
  }
  // 匹配路由
  function match(path) {
    return routeMap[path]
  }
  return {
    match,
    addRoute,
    addRoutes
  }
}


