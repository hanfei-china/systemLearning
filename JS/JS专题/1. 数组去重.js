/*
    数组去重
        一：常规思路：
            1. 思路：将数组的每一项一次放入到一个空数组中，放入之前，先遍历判断结果数组中是否已经有这一项，如果没有的话就放入。
            2. 缺点：两层嵌套遍历，时间复杂度是平方级别的

        二：进阶
            1. 因为常规的思路需要有两层嵌套的循环，对于这种做法肯定是不太合适的。我们需要去进行优化。
            2.对于双层嵌套的优化，我们的思路一般是将两层的功能合并，然后通过一层循环实现，或者可以分成两个平行的循环，这样就可以优化时间复杂度了
            3. 对于数组去重，我们内层的目的是为了检验是否重复，那我们就可以使用键值对的方式（对象），来实现。通过一个循环，将存值和检验一起进行。

        三：ES6
            1. 在ES6中有了map和set。在这里，map的功能和对象相似，我们不做讨论了。
            2. 主要是使用set可以快速的进行去重。
*/

//常规做法：
function noRepeat1(arr) {
    let res = [];
    // 外层的循环用于拿到目标数组中的每一项
    for (let i = 0; i < arr.length; i++) {
        for (var j = 0; j < res.length; j++) {
            if (res[j] === arr[i]) {
                break;
            }
        }
        // 如果内层循环使用let的话，这里就用不了了。因为let和for循环会形成一个类似局部作用域的东西
        if (j == res.length) {
            res.push(arr[i]);
        }
    }
    return res;
}

//优化---键值对
function noRepeat2(arr) {
    let obj = {};
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true;
            res.push(arr[i]);
        }
    }
    return res;
}
//进一步优化=》通过数组的方法，进行代码数量的优化，但是在算法上并没有优化
function noRepeat2_1(arr) {
    let obj = {};
    return arr.filter(item => (!obj[item]) && (obj[item] = true))
}

//ES6的方法---set
function noRepeat3(arr) {
    return Array.from(new Set(arr));
}

var arr = [1, 1, 2, 3, 4, 2, 5, 6, 6];
// var res1 = noRepeat1(arr);
// var res2 = noRepeat2(arr);
// var res3 = noRepeat2_1(arr);
var res4 = noRepeat3(arr);
console.log(res4); //[ 1, 2, 3, 4, 5, 6 ]