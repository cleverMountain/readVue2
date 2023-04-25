class Element {
  constructor(tag, props, children) {
    this.props = props
    this.type = tag
    this.children = children
  }
}

export default Element