//call的模拟实现
function newCall(obj) {
    //修改函数内部的this指向
    obj.fn = this;
    //拿到传入的参数
    var arr = [];
    for (let i = 1; i < arguments.length; i++) {
        arr.push(arguments[i]);
    }
    //执行函数
    var res = obj.fn(...arr);
    //删除对象增加的属性
    delete obj.fn;
    //返回执行结果
    return res;
}
//apply的模拟实现
function apply(obj) {
    obj.fn = this;
    var arr = [];
    for (let i = 1; i < arguments.length; i++) {
        arr.push(arguments[i])
    }
    var res = obj.fn(arr);
    delete obj.fn;
    return res;
}
//bind的模拟实现
function bind(obj) {
    obj.fn = this;
    var arr = Array.prototype.slice.call(arguments, 1);
    return function () {
        var res = obj.fn(...(arr.concat(...arguments)));
        delete obj.fn;
        return res;
    }
}

//new的模拟实现
function newFn(Fn) {
    var obj = {};
    Fn.call(obj);
    obj.__proto__ = Fn.prototype;
    return obj;
}

//闭包的使用
var arr = [];
for (var i = 0; i < 3; i++) {
    arr[i] = function () {
        console.log(i);
    }
}
// arr[0]();
// arr[1]();
// arr[2]();

var arr1 = [];
for (var j = 0; j < 3; j++) {
    arr1[j] = (function (j) {
        return function () {
            console.log(j);
        }
    })(j)
}
// arr1[0]();
// arr1[1]();
// arr1[2]();


//数组去重
//第一步肯定是双重循环
//外层循环用于拿到每一个元素，内层循环用于判断结果数组中是否有这个元素
function f1(arr) {
    var res = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < res.length; j++) {
            if (res[j] == arr[i]) {
                break;
            }
        }
        if (j == res.length) {
            res.push(arr[i])
        }
    }
    return res;
}
//我们发现这个方法有循环嵌套，所以要考虑优化。然后发现内部的循环其实就是为了判断数组内部是否有这个成员。那么其实对象的键值对方式更加简单。所以，我们可以通过对象的方法来简化内层的循环
function f2(arr) {
    var obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true;
        }
    }
    var res = [];
    for (const key in obj) {
        res.push(key);
    }
    return res;
}
//ES6的方法---Set
function f3(arr) {
    var set = new Set(arr);
    var res = Array.from(set);
    return res;
}

//深拷贝
function deepCopy(obj, copyObj) {
    for (const key in obj) {
        if (obj[key] instanceof Array) {
            var res = [];
            copyObj[key] = deepCopy(obj[key], res);
        } else if (obj[key] instanceof Object) {
            var newObj = {};
            copyObj[key] = deepCopy(obj[key], newObj);
        } else {
            copyObj[key] = obj[key];
        }
    }
    return copyObj;
}

//数组的扁平化
function fn(arr) {
    var res = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            res.push(...fn(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
// console.log(fn([1,[2,3,[4,5,[6,7,[8,[9]]]]]]))


//红绿灯
function red(time) {
    return new Promise(resolve => {
        console.log('红灯亮了');
        setTimeout(() => {
            console.log('红灯关了');
            resolve();
        }, time);
    })
}
function green(time) {
    return new Promise(resolve => {
        console.log('绿灯亮了');
        setTimeout(() => {
            console.log('绿灯关了');
            resolve();
        }, time)
    })
}
function yellow(time) {
    return new Promise(resolve => {
        console.log('黄灯亮了');
        setTimeout(() => {
            console.log('黄灯关了');
            resolve();
        }, time);
    })
}
function streetLamp() {
    red().then(res => {
        return green();
    }).then(res => {
        yellow();
    })
}

streetLamp();