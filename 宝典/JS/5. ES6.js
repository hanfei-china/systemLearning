/*
    1. let const
        1. 不能进行变量提升
        2. 不能重复声明
        3. 和for循环结合会形成块作用域
        4. 不绑定全局变量

    2. 模板字符串
        1. 支持变量---原先的字符串只能使用+运算符
        2. 保留空格、缩进、换行等---字符串不能保留
        3. 模板字符串可以通过trim方法消去首行的换行符
    
    3. 箭头函数
        1. 没有this，其内部this指向是其外部最近的一个函数的this指向
            一般我们使用这个特性去做一些事情的

    4. forof和迭代器
        1. 为什么会出现forof---for循环在使用的时候，我们要提前定义索引变量和长度变量，但是使用中我们很多情况是只需要拿到成员即可。这样的话，很可能由于变量引用的错误引发报错。进而在ES6中就提供了forof
        2. forof能作用的数据类型---必须是迭代器对象---有interator属性
            1. 数组
            2. 类数组
            3.map
            4. set
            5. 字符串
        3. 迭代器对象的特点
            1. 有interator属性
            2. 上面有一个next方法，每次执行这个方法返回一个对象。这个对象上有两个属性：done：是否可以继续循环，value：当前循环下的变量值
        4. 内建迭代器---迭代器对象自带的一个方法，可以直接通过forof使用
            1. keys()   获取迭代器对象上的键名  for (const iterator of obj.keys()) {}
            2. values()   获取迭代器对象上的键值  for (const iterator of obj.keys()) {}
            3. entries()   获取迭代器对象上的[键名,键值]值  for (const iterator of obj.keys()) {}

    5. set
        1. 是一个迭代器对象，所以迭代器上的方法它都可以使用
        2. 目前一般用于数组去重

    6. promise 和 eventloop
        1. promise
            通过微任务来实现异步代码同步执行
            async  await  就是promise的一个语法糖。async类似于一个声明，await则是一个区域的一个划分，结合起来的话就是将await这个语句后面的所有代码放入到外太后面函数的promise的then方法中。所以，也要求await后面的函数或者代码块必须返回一个promise对象。同时，还要注意这个promise内部resolve的调用时机。
        2. eventloop 
            整个JS执行顺序分为同步代码和异步代码两块。同时，异步代码又分为宏任务和微任务。
            执行逻辑为：首先执行同步代码，并将遇到的异步代码分别放入到宏任务列表和微任务列表中。当同步代码执行完毕后，执行微任务列表，清空微任务列表。然后开始执行宏任务列表中最近一个完成的宏任务，执行过程中，再次将异步任务放入到对应的宏任务列表和微任务列表中。执行完毕一个宏任务后，再次执行微任务列表，清空微任务列表。依次直至宏任务列表清空，微任务列表清空。代码执行完毕。
    7. 模块加载
        1. commonjs
            同步加载方式。当遇到require的时候才去加载。
            使用方式：
                导出：module.exports.{}
                导入：require
        2. ES6模块加载
            异步加载方式，提前加载资源。加载完毕以后执行后续代码。
        3. 区别：
            1. commonjs一般用于服务器环境。因为服务器环境中，资源一般都在本地，加载速度较块。所以不需要考虑加载速度问题。因此，服务器端一般采用commonjs的同步加载方式。
            2. ES6的模块加载方式一般用于浏览器环境。因为浏览器环境加载资源一般需要发起请求，当文件较大时，可能会导致卡顿以及白屏的情况。因此在浏览器端一般都采用ES6的异步加载方式。
*/

//let const
// let a = 1;
// console.log(window.a);//undefined


// var arr = [];
// for (var i = 0; i < 3; i++) {
    // arr[i]=function () {
        // console.log(i);
    // }
// }
// arr[0]();//3
// arr[1]();//3
// arr[2]();//3


// var arr1 = [];
// for (var i = 0; i < 3; i++) {
    // arr1[i]=(function (i) {
        // return function () {
            // console.log(i);
        // }
    // })(i)
// }
// arr1[0]();//0
// arr1[1]();//1
// arr1[2]();//2


// var arr2 = [];
// for (let i = 0; i < 3; i++) {
//     arr2[i]=function () {
//             console.log(i);
//     }
// }
// arr2[0]();//0
// arr2[1]();//1
// arr2[2]();//2


//迭代器
//1. 创建迭代器的方法---有next方法，这个方法的特点也要注意
function createInterator(obj) {
    var i = 0;//循环的下标
    return {
        next:function () {
            var done = i >= obj.length ? false : true;
            var value = done ? obj[i] : undefined;
            i++;
            return {
                done,
                next
            }
        }
    }
}
//2. 模拟forof方法
function forof(obj,callback) {
    if (typeof obj[Symbol.interator]!='function') {
        throw new TypeError(obj + 'is not interator');
    }
    if (typeof callback!='function') {
        throw new TypeError(callback+'is not function')
    }
    var interator = obj[Symbol.interator]();//通过这个方法获取到一个迭代器对象
    var result = interator.next();
    while (result.done) {
        callback(result.value);
        result=interator.next();
    }
}

//set
var arr = [1, 2, 3, 2, 1, 1, 2, 2, 4, 5, 6, 6];
var set = new Set(arr);
var newArr = Array.from(set);
// console.log(newArr);