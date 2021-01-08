//需求：创建一个函数foo，这个函数返回首次调用的Date对象


//方法一：创建一个全局变量来记录首次调用的Date对象
var t;

function foo1() {
    if (t) {
        return t
    } else {
        t = new Date();
        return t;
    }
}
//问题：污染的全局变量，而且每次执行的时候都要判断一次


//方法二：闭包
var foo2 = (function() {
    var t;
    return function() {
        if (t) return t;
        t = new Date();
        return t;
    }
})();
//问题：每次执行都要进行一次判断


//函数对象存值
function foo3() {
    if (foo3.t) {
        return foo3.t
    } else {
        foo3.t = new Date();
        return foo3.t;
    }
}
//问题：还是没能解决每次执行都需要判断的问题


//惰性函数
//原理：在函数内部重写函数，并且重写的这个函数内部会使用原函数的自由变量。这样就形成了闭包。同时，这个重写的函数也不需要判断，直接返回我们想要的数即可（它可以直接访问之前的自由变量）
function foo() {
    var t = new Date();
    console.log(111);
    foo = function() {
        return t;
    }
    return foo(); //如果没有这一句，那么第一次执行就没有结果了
}
//测试
var a1 = foo(); //111
var a2 = foo(); //没有执行console，执行的是新函数
var a3 = foo(); //没有执行console，执行的是新函数
var a4 = foo(); //没有执行console，执行的是新函数

console.log(a1); //2020-12-24T07:45:18.766Z
console.log(a2); //2020-12-24T07:45:18.766Z
console.log(a3); //2020-12-24T07:45:18.766Z
console.log(a4); //2020-12-24T07:45:18.766Z


//惰性函数的应用

//应用场合：需用每次判断，但是判断结果其实从第一次以后就不变了，而且执行内容也不再改变的情况

//应用示例---比如在DOM操作中，我们要添加事件，此时就需要去判断是IE浏览器还是现代浏览器。因为IE浏览器添加事件的方法为：el.attachEvent('on' + type, fn);而对于现代浏览器，添加事件的方法为el.addEventListener(type, fn, false);


//普通的写法
function addEvent(type, el, fn) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (window.attachEvent) {
        el.attachEvent('on' + type, fn)
    }
}

//问题：每次添加事件的时候，都需要判断一下。


//使用惰性函数
function addEvent(type, el, fn) {
    if (window.addEventListener) {
        addEvent = function(type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    } else if (window.attachEvent) {
        addEvent = function(type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
    return addEvent(type, el, fn);
}
//优点：这样的话，就只有第一次添加事件的时候会进行判断，后面就不再需要进行判断了。