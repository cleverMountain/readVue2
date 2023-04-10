import {ArrayMethods} from './arr'
export function observer(data) {
    // console.log(data)
    // 给 data 定义一个属性
  
    //1判断
    if (typeof data != 'object' || data == null) {
        return data;
    }
    // 1对象通过一个类
    return new Observer(data)
}
class Observer {
    constructor(value) {
   
        // 在data上定义__ob__，当访问ob是可以访问到proto
        Object.defineProperty(value,"__ob__",{
            enumerable: false,
            value: this // Observe
        })
         //判断数据
        //  console.log(value)
         if(Array.isArray(value)){ //  list:[1,2,3]
            value.__proto__ = ArrayMethods 
            // console.log('数组')
            //如果你是数组对象
             this.observeArray(value) // 处理数组对象 [{a:1}]
         }else{
            this.walk(value)  //遍历
         }
        
    }
    walk(data) { //  {  msg:'hello'，a}
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {

            //对象我们的每个属性进行劫持
            let key = keys[i] //
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
    observeArray(value){ //[{a:1}] 
         for(let i = 0 ;i<value.length;i++){
            observer(value[i])
         }
    }
}
//对对象中的属性进行劫持
function defineReactive(data, key, value) {  //{a:{b:1}}
    observer(value) //深度代理
    Object.defineProperty(data, key, {
        get() {
            // console.log('获取')
            return value
        },
        set(newValue) {
            // console.log('设置')
            if (newValue == value) return;
            observer(newValue) //如果用户设置的值是对象
            value = newValue
        }
    })
}
   // vue2     Object.defineProperty  缺点  对象中的一个属性   { a:1,b:2}

   // {a:{}，list:[]}

   // 总结 ：（1）对象 
   //  1 Object.defineProperty  有缺点 只能 对象中的一个属性 进行劫持  
   //  2 遍历 {a:1,b:2 ,obj:{}}
   //  3 递归  get   set




   // 2数组 { list:[1,2,3,4], arr:[{a:1}]} 
   //  方法函数劫持 ，劫持数组方法  arr.push（1）