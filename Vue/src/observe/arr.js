//重新写数组
//(1) 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

//（2）继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

//劫持

let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

methods.forEach(item => {
    ArrayMethods[item] = function (...args) { // {list:[]} list.push()
        console.log('劫持数组')

        let result = oldArrayProtoMethods[item].apply(this, args)
        // console.log(args) // [{b:6}]
        //问题 ：数组追加对象的情况  arr.push({a:1})
        let inserted
        switch (item) {
            case 'push':
            case "unshift":
                inserted = args
                break;
             case "splice":
                 inserted = args.splice(2); //arr.splice(0,1,{a:6})
                 break;
        }
        // console.log( inserted)
        console.log(this)
        let ob = this.__ob__ //
        if(inserted){
            ob.observeArray(inserted) // 对我们的添加的对象进行劫持
        }
        return result
    }
})