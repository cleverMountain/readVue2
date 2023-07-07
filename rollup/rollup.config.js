import babel from "rollup-plugin-babel"

// 导出对象，最为打包配置
export default {
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    name: 'Vue', // 全局增加global.Vue可以使用new Vue
    format: 'umd', // esm es6 import      commonjs cjs require      iife 自执行函数      umd(同一模块规范兼容amd(异步模块)和cjs)
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 排除node_modules
    })
  ]
}