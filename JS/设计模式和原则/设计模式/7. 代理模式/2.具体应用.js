/*  
    所有的代理模式，其实本质上来说都是不直接去操作或访问目标元素，而是进行一个中间者，这个中间者就是代理。而又根据使用场景的不同，将代理模式分为了  事件代理  保护代理   缓存代理   虚拟代理。
    一：事件代理
        通过事件冒泡，将一大堆子元素的事件转换为一个父元素的事件。减少事件数量，提高性能。
            关于事件冒泡的一个特殊点：
                1. blur和focus事件不能冒泡。
                2. 当点击一个元素时，另外一个input元素失焦。这两个事件会先执行blur事件，再执行click事件。

            案例：当我们使用下拉框时，要求，下拉框展开后，当我们点击其中的一个选项时，下拉框收回去，同时展示选中的内容。

            问题：只执行了blur事件中的内容，就是下拉框收回。而点击事件的监听函数并没有执行。

            分析：由于blur事件是要先执行的，所以就会把下拉框收回。那这样的话点击事件其实并没有触发。因为点击事件执行的时候，下拉框收回了。所以下拉框上的点击事件的监听没有起作用。

            本质：就是执行顺序的问题，以及没有冒泡的问题。

            解决方法：给blur事件加一个定时器，让click事件的监听函数先执行了，然后再去执行blur事件的监听内容。或者将click事件更换为mousedown事件。mousedown事件要比blur事件先执行。
    二：保护代理
        就是在1中的案例。我们在进行保护代理时，首要考虑的就是proxy，因为它就是为了拦截而生的。
    三：缓存代理---就是将某些可能后续会使用到的数据通过闭包或者其它手段进行存储。当下一次遇到的时候，不需要再次进行计算，而是直接从缓存中取出结果即可。
*/

// 缓存代理

//没有缓存代理之前
// 有一个函数，对传入的参数进行求和
function addAll() {
    console.log('进行了一次新的计算')
    var num = 0;
    for (let i = 0; i < arguments.length; i++) {
        num += arguments[i]
    }
    return num;
}


//使用缓存代理
let proxyAdd = (function() {
    var resultCache = {};
    // 使用闭包，用于结果的缓存
    return function() {
        var str = Array.prototype.join.call(arguments, ',');
        if (resultCache[str]) {
            return resultCache[str];
        } else {
            return resultCache[str] = addAll(...arguments);
        }
    }
})()

// console.log(proxyAdd(1, 2, 3, 4, 5));
/*
    结果：
        1. 进行了一次新的计算
        2. 15
*/

// console.log(proxyAdd(1, 2, 3, 4, 5));
/*
    结果：
        1. 15
*/