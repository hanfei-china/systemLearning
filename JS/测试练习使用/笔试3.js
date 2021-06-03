// 1. 实现下面这个方法：
// 将一维数组切分成二维数组： 按照第二个参数（数字）的值，来决定二维数组长度
// let a = ['a', 'b', 'c', 'd'];
// let result = chunk(a, 3);
// console.log(result) => [['a','b', 'c'], ['d']];
// let result = chunk(a, 2);
// console.log(result) => [['a','b'], ['c','b']];
// let result = chunk(a, 1);
// console.log(result) => [['a‘],['b‘],['c‘],['d']];
function chunk(arr, num) {
    var sum = 0;
    var res = [];
    var xiabiao = 0;
    res[xiabiao] = [];
    for (let i = 0; i < arr.length; i++) {
        if (sum == num) {
            sum = 1;
            xiabiao++;
            res[xiabiao] = [];
            res[xiabiao].push(arr[i]);
        } else {
            sum++;
            res[xiabiao].push(arr[i]);
        }
    }
    return res;
}
// let a = ['a', 'b', 'c', 'd'];
// console.log(chunk(a, 3));
// console.log(chunk(a, 2));
// console.log(chunk(a, 1));


// 需求：写一个模块函数，实现如下方法：
// let version = V0.11.12;

// fn.patch() // return => V0.11.13
// fn.minor() // return => V0.12.0
// fn.major() // return => V1.0.0
// fn.rollback() // 回退到上一次的版本号
function Fn(version) {
    this.oldVers = version;
    this.ver1 = version.split('.')[0];
    this.ver2 = version.split('.')[1];
    this.ver3 = version.split('.')[2];
}
Fn.prototype.patch = function () {
    this.oldVers = `${this.ver1}.${this.ver2}.${this.ver3}`;
    this.ver3 = (parseInt(this.ver3)) + 1;
    return `${this.ver1}.${this.ver2}.${this.ver3}`
}
Fn.prototype.minor = function () {
    this.oldVers = `${this.ver1}.${this.ver2}.${this.ver3}`;
    this.ver2 = (this.ver2 - 0) + 1;
    this.ver3 = 0;
    return `${this.ver1}.${this.ver2}.${this.ver3}`
}
Fn.prototype.major = function () {
    this.oldVers = `${this.ver1}.${this.ver2}.${this.ver3}`;
    this.ver1 = 'V' + ((this.ver1.split('V')[0] - 0) + 1);
    this.ver2 = 0;
    this.ver3 = 0;
    return `${this.ver1}.${this.ver2}.${this.ver3}`
}
Fn.prototype.rollback = function () {
    this.ver1 = this.oldVers.split('.')[0];
    this.ver2 = this.oldVers.split('.')[1];
    this.ver3 = this.oldVers.split('.')[2];
    return `${this.ver1}.${this.ver2}.${this.ver3}`
}
// let version = 'V0.11.12';
// var fn = new Fn(version);
// console.log(fn.patch()) // return => V0.11.13
// console.log(fn.minor()) // return => V0.12.0
// console.log(fn.major()) // return => V1.0.0
// console.log(fn.rollback()) // 回退到上一次的版本号




// 需求：写一个方法，可以利用字符串路径获取对象集合的值，当值不存在时返回错误信息

// let object = {'a': [{'b': {'c': 3}}]};

// let [err, result] = fn.get(object, 'a[0].b.c');
// console.log(err, result); // => null, 3

// let [err, result] = fn.get(object, 'a[0].d.c');
// console.log(err, result); // => Is err about 'd', null

// function fn(obj,str) {

// }



// 按照调用实例，实现下面的Person方法：
// Person("Li");
// 输出： Hi! This is Li!

// Person("Dan").sleep(10).eat("dinner");
// 输出：
// Hi! This is Dan!
// 等待10秒..
// Wake up after 10
// Eat dinner~

// Person("Jerry").eat("dinner").eat("supper");
// 输出：
// Hi This is Jerry!
// Eat dinner~
// Eat supper~

// Person("Smith").sleepFirst(5).eat("supper");
// 输出：
// 等待5秒
// Wake up after 5
// Hi This is Smith!
// Eat supper
function Person(name) {
    this.arr = [];
    this.arr.push(sayName);
    this.timer = setTimeout(() => {
        this.fn(this.arr);
    }, 0);
    function sayName() {
        var that = this;
        return new Promise(resolve => {
            console.log('Hi This is ' + name);
            resolve();
        })
    }
}
Person.prototype.eat = function () {
    function eatFood() {
        return new Promise(resolve => {
            console.log('Eat dinner~');
            resolve();
        })
    }
    clearTimeout(this.timer);
    this.arr.push(eatFood);
    this.timer = setTimeout(() => {
        this.fn(this.arr);
    }, 0)
    return this;
}
Person.prototype.sleep = function (time) {
    function sleepFn () {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('睡了' + time);
                resolve();
            }, time*1000);
        })
    }
    clearTimeout(this.timer);
    this.arr.push(sleepFn);
    this.timer = setTimeout(() => {
        this.fn(this.arr);
    }, 0)
    return this;
}
Person.prototype.sleepFirst = function (time) {
    function sleepFirstFn() {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('等待' + time);
                resolve();
            },time*1000)
        })
    }
    clearTimeout(this.timer);
    this.arr.unshift(sleepFirstFn);
    this.timer = setTimeout(() => {
        this.fn(this.arr);
    }, 0)
    return this;
}
Person.prototype.fn = function () {
    var res = new Promise(resolve => {
        resolve();
    })
    for (let i = 0; i < this.arr.length; i++) {
        res=res.then(() => {
            return this.arr[i]();
        })
    }
}
// new Person('你好');
// new Person("Dan").sleep(10).eat("dinner");
new Person("Smith").sleepFirst(5).eat("supper");
