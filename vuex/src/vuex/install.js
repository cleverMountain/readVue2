let Vue

const install = _vue => {

  Vue = _vue
  Vue.mixin({
    beforeCreate() {
      // console.log(this)
      // debugger
      if (this.$options.store) {
        // 根
        this.$store = this.$options.store
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    }
  })

}

export {
  install,
  Vue
}
