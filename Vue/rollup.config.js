import bable from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input:'./src/index.js', //打包入口文件
    output:{
        file:'dist/vue.js',
        format:'umd', //  在window 上 Vue    new Vue
        name:'Vue',
        sourcemap:true
    },
    plugins:[
        bable({
           exclude:'node_modules/**' 
        }),
        serve({ // 3000
             port:3000,
             contentBase:'', // "" 当前目录
             openPage:'/index.html'
        })
    ]
}