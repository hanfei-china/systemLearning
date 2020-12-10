//可以用来执行异步代码
function* fn(num) {
    console.log(0);
    var res1 = yield fn2(1);
    var res1 = yield fn2(res1);
    var res1 = yield fn2(3);
}

function fn2(num) {
    console.log(num);
    return num;
}
var f = fn(); //执行这个generator函数，并不会执行内部代码，会返回一个内部的指针。然后使用这个指针的next方法，内部代码才开始执行
var r1 = f.next(); //第一次调用next，从头部执行，当地一个yield部分执行完毕时停止
console.log(r1); //{value:1,done:false}---将yield后面的执行结果传入到value，done标识指针是否已经到达末尾
var r2 = f.next(222); //一般情况下，next 方法不传入参数的时候，yield 表达式的返回值是 undefined 。当 next 传入参数的时候，该参数会作为上一步yield的返回值。
console.log(r2); //{value:222,done:false}
var r3 = f.next();
console.log(r3); //{value:3,done:true};
var r4 = f.next(); //啥也不输出了
console.log(r4); //{value:undefined,done:true};




//具体在实际中的应用：没用过，也没见过。个人感觉直接使用async   await更好一点啊
//追加评论：在异步处理上，async其实就是generator的语法糖


// 问题一：async 会取代 Generator 吗？
// Generator 本来是用作生成器，使用 Generator 处理异步请求只是一个比较 hack 的用法，在异步方面，async 可以取代 Generator，但是 async 和 Generator 两个语法本身是用来解决不同的问题的。

// 问题二： async 会取代 Promise 吗？
// async 函数返回一个 Promise 对象

// 面对复杂的异步流程，Promise 提供的 all 和 race 会更加好用

// Promise 本身是一个对象，所以可以在代码中任意传递

// async 的支持率还很低，即使有 Babel，编译后也要增加 1000 行左右。


//异步处理的一个发展过程：回调--promise--generator--async