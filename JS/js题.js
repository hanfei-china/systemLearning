//1. 将一维数组切分为二维数组，由第二个参数决定二维数组的最长长度
// let a = ['a', 'b', 'c', 'd'];
// let result = chunk(a, 3);// console.log(result) => [['a','b', 'c'], ['d']];
// let result = chunk(a, 2);
// console.log(result) => [['a','b'], ['c','b']];
// let result = chunk(a, 1);
// console.log(result) => [['a‘],['b‘],['c‘],['d']];

let a = ['a', 'b', 'c', 'd'];

function chank(arr, len) {
    if (len > arr.length) {
        return false;
    }
    let i = 0;
    let arr_new = [];
    while (arr.length) {
        arr_new[i] = arr.splice(0, len);
        i++;
    }
    return arr_new;
}




/*
    二：第二题
    当前版本号为 v <major>. <minor>. <patch>，则版本号的增常策略如下：
    每次调用对应函数方法时，对应版本号 +1, 下级版本号清零，
    例子：
    当前版本号V0.11.13调用fn.minor()， 
    结果为V0.12.0，<minor> + 1， <patch>归 0
    需求：写一个模块函数，实现如下方法：
    let version = V0.11.12;
    fn.patch() // return => V0.11.13
    fn.minor() // return => V0.12.0
    fn.major() // return => V1.0.0
    fn.rollback() // 回退到上一次的版本号
*/

function Fn() {
    this.old = '';
}
Fn.prototype.patch = function(str) {
    this.old = str;
    var arr = str.split('.');
    arr[2] = (arr[2] - 0) + 1;
    return arr.join('.');
}
Fn.prototype.minor = function(str) {
    this.old = str;
    var arr = str.split('.');
    arr[1] = (arr[1] - 0) + 1;
    arr[2] = 0;
    return arr.join('.');
}
Fn.prototype.major = function(str) {
    this.old = str;
    var arr = str.split('.');
    var newStr = arr[0];
    var num = (newStr.split('V')[0] - 0) + 1;
    arr[0] = 'V' + num;
    arr[1] = 0;
    arr[2] = 0;
    return arr.join('.');
}
Fn.prototype.rollback = function() {
    return this.old;
}
var fn = new Fn();
let version = 'V0.11.12';

// version = fn.patch(version);
// console.log(version);
// version = fn.minor(version);
// console.log(version);
// version = fn.major(version);
// console.log(version);
// console.log(fn.rollback());



/*
    第三题
    // 需求：写一个方法，可以利用字符串路径获取对象集合的值，当值不存在时返回错误信息
    let object = {'a': [{'b': {'c': 3}}]};
    let [err, result] = fn.get(object, 'a[0].b.c');
    console.log(err, result); // => null, 3
    let [err, result] = fn.get(object, 'a[0].d.c');
    console.log(err, result); // => Is err about 'd', null
*/
function getUrl(obj, str) {
    var arr1 = str.split('.');
    var arr2 = [];
    arr1.forEach(item => {
        if (item.split('[').length > 1) {
            arr2.push({
                first: item.split('[')[0],
                second: item.split('[')[1].split(']')[0]
            })
        } else {
            arr2.push(item);
        }
    });
    var zhi = JSON.parse(JSON.stringify(obj));
    let err = null;
    // console.log(arr2);
    arr2.some(item => {
        if (typeof item == 'object') {
            zhi = zhi[item.first][item.second - 0];
        } else {
            zhi = zhi[item];
        }
        if (!zhi) {
            err = 'Is err about ' + (item.first || item);
            return true;
        }
    })
    return { err, zhi }
}
let object = { 'a': [{ 'b': { 'c': 3 } }] };
// var res = getUrl(object, 'a[0].b.c');
// console.log(res);

// var res2 = getUrl(object, 'a[0].d.c');
// console.log(res2);





//第四题
// Person("Li");
// 输出： Hi! This is Li!

//Person("Dan").sleep(10).eat("dinner");
// 输出：// Hi! This is Dan!// 等待10秒..
// Wake up after 10
// Eat dinner~

//Person("Jerry").eat("dinner").eat("supper");
// 输出：// Hi This is Jerry!
// Eat dinner~
// Eat supper~

//Person("Smith").sleepFirst(5).eat("supper");
// 输出：
// 等待5秒
// Wake up after 5
// Hi This is Smith!
// Eat supper

//1. 链式使用
//2. 有异步代码，但是要做到同步执行---利用promise或者回调
//再结合链式特点---上一个方法不返回this，那么下一个方法是调用不了的
//3. 在最后一个例子中，有一个异步不管在什么位置，都是第一个去执行。

function Person(name) {
    this.name = name
}

Person.prototype.sleep = function(time) {
    newPromise
}