/*
 1. 数组去重
    1. 首先最直观的方法就是去双重遍历。首先遍历这个数组，然后内部遍历结果数组。如果在内部遍历结束的时候，没有找到相同的数，那么就放入到结果数组中。
        那么如何去判断结果数组中是否有这个数呢？当有这个数的时候，打断内部循环，然后判断此时的内部循环的次数和结果数组的长度。如果相同，说明最后没有找到。---因为遍历的时候，哪怕最后一次遍历的结果相同，也不会将遍历次数达到数组的长度的。

    2. 从上面这种方法我们可以看出来，双层循环。必然效率很低。那么如何去优化呢？因为这里双层循环的原因是去判断是否数组中有这个值，那么对应这种关系的，最简单直接的就是对象。所以我们可以通过对象来优化。

    3. 在ES6中还为我们提供了set类型，可以快速的实现去重

 2. 类型判断
    1. typeof
        1. 使用方法：typeof 'asdf'    返回   string
        2. 特点：对于复杂数据类型，返回的都是object
            Undefined返回的是undefined
            Null和其他复杂数据类型，返回的都是object
        3. 注意：返回的结果都是小写的

    2. instanceof
        1. 使用方法：obj instanceof Object        true
        2. 特点：
            1. 返回的是布尔值
            2. 用来判断的类型都是大写的
            3. 对于函数、数组等，他们满足Function、Array，但是同时他们还满足Object
                arr instanceof Array    true
                arr instanceof Object   true
                fn instanceof Function true
                fn instanceof Object true
                obj instanceof Object true 
                obj instanceof Array false
                obj instanceof Function false

    3. Object.prototype.toString方法
        1. 使用方法
            1. 本身是对象的(注意：这里只能是对象类型)
                Object.prototype.toString(obj)   "[object Object]"
                但是，也可以使用 Object.prototype.toString.call({})
            2. 对象类型以外的其他类型
                Object.prototype.toString.call(arr)   "[objecgt Array]"
        2. 特点：
            1. 返回的是一个字符串
            2. 如果要判断的数据类型不 是对象，那么就要使用call来改变其this指向。这里能用call改变this指向后可以使用，也是和其方法本身有关的。
            3. 注意其格式。前面的都是一个小写的object，然后一个空格，再一个大写的这个数据的类型
 3. 深浅拷贝
    1. 浅拷贝
        1. 数组
            1. 数组的方法，如  splice  slice   concat等
                var arr=[1,2,3];
                var copyArr=arr.splice(0);
                var copyArr=arr.slice();
                var copyArr=[].concat(arr);
            2. 一层遍历
            3. ES6的结构赋值  copyArr=[...arr]
        2. 对象
            1. Obejct.assign方法
            2. 一层遍历
            3. ES6的结构赋值  copyObj={...obj}

    2. 深拷贝
        1. 递归
        2.JSON转换

 4. 数组的最大值和最小值
    1. 使用一次遍历
    2.使用Math的方法
        1. Math.max.apply(arr);
        2. Math.max(...arr);

 5. 数组的扁平化
    基本思路：遍历数组，拿到每个值，判断是否为数组
    注意：由于并不知道这个数组可能会有多少层，所以最终会使用到递归

 6. 如何判断两个参数是否相等
    1. 对于简单数据类型，我们直接使用全等   ===
    2. 对于复杂数据类型
        1. 使用递归。先拿到每个值，然后判断类型是否相同。类型相同的话，我们再去判断值是否相同。在此期间，如果说值也是复杂数据类型，那么就要进行递归了
        2. 最简单的方式，我们就直接转换成JSON格式进行判断。
        3. 如果说不知道是复杂数据类型，还是简单数据类型。那么我们最好直接用JSON来进行判断。这样就不需要进行类型的判断了。

 7. 惰性函数---返回函数第一次调用时的Date对象
    用途：比如，我们在页面初始化的时候，要判断当前浏览器是什么浏览器，进而决定事件添加的方法使用什么，那么我们就可以使用惰性函数，以避免我们在后续添加事件的时候，要一直去判断浏览器的类型。
*/

//1. 数组去重
function deleteSame(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < res.length; j++) {
            if (res[j] === arr[i]) {
                break;
            }
        }
        if (j === res.length) {
            res.push(arr[i])
        }
    }
    return res;
}

function deleteSame2(arr) {
    var obj = {};
    var res = [];
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = arr[i];
        }
    }
    for (const key in obj) {
        res.push(obj[key]);//这里不使用键，是因为对象的键最终都是字符串格式
    }
    return res;
}

function deleteSame3(arr) {
    var set = new Set(arr);
    var res = Array.from(set);
    return res;
}

// var arr = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 2, 3, 4, 3, 3, 3];
// var res = deleteSame(arr);
// var res2 = deleteSame2(arr);
// var res3 = deleteSame3(arr);
// console.log(res);
// console.log(res2);
// console.log(res3);



//2. 类型判断

function typeJudeg(data) {
    var typeArr = ['Object', 'Array', 'Function', 'Null', 'String', 'Number', 'Undefined', 'Boolean'];
    var type = Object.prototype.toString.call(data);
    var res = '';
    typeArr.forEach(item => {
        if ("[object " + item + "]" === type) {
            res = item.toLowerCase();
        }
    })
    return res;
}
// var data = 'asdf';
// console.log(typeJudeg(data));



//深拷贝
function deepCopy(obj,copyObj) {
    for (const key in obj) {
        if (obj[key] instanceof Array) {
            copyObj[key] = [];
            copyObj[key] = deepCopy(obj[key],copyObj[key]);
        } else if (obj[key] instanceof Object) {
            copyObj[key] = {};
            copyObj[key] = deepCopy(obj[key],copyObj[key]);
        } else {
            copyObj[key] = obj[key];
        }
    }
    return copyObj;
}

// var obj = {
//     a: {
//         b:1
//     },
//     b: [1, 2, 3],
//     c:2
// }
// var copy = deepCopy(obj,{});
// console.log(copy);


//数组的扁平化
function fn(arr) {
    var res = [];
    arr.forEach(item => {
        if (item instanceof Array) {
            res.push(...fn(item));
        } else {
            res.push(item);
        }
    })
    return res;
}

// var arr = [[1, 2, 3], 4, 5, [[6, 7], 8]];
// console.log(fn(arr));



//惰性函数---单纯使用闭包
var fn = (function fn1() {
    var t;
    return function () {
       if (t) {
           console.log(t)
       } else {
           t = new Date();
           console.log(data);
       }
   } 
})()
//缺点：每次都要判断

//惰性函数---闭包和惰性函数相结合
function fn2() {
    var t = new Date();
    fn2=function () {
        console.log(t);
    }
    return fn2();
}