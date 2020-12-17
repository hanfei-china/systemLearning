//思路一：递归
//递归式：拿到数组的每个成员，判断是否为简单数据类型，若是，直接放入到结果数组中。如果不是，那么就将其作为一个处理数组进行递归处理
//递归边界---当数组中没有二级数组时自动停止递归
function fn1(arr) {
    function deepFind(arr) {
        var res = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] instanceof Array) {
                res.push(...deepFind(arr[i]))
            } else {
                res.push(arr[i]);
            }
        }
        return res;
    }
    return deepFind(arr);
}

//方法2：使用concat配合ES6的解构赋值方法
//ES6的解构赋值可以将数组扁平一层，然后使用concat方法去合成数组---concat方法既可以传入数组，也可以传入值
//所以，就形成了一个循环。循环的主体代码是通过解构赋值，concat来合并形成新数组。循环的结束条件为数组内部没有二级数组
function fn2(arr) {
    //因为循环次数不定---使用while循环
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}


var arr = [1, 2, [3, [4, 5], 6], 7];
// console.log(fn1(arr)); //[1,2,3,4,5,6,7]
console.log(fn2(arr)); //[1,2,3,4,5,6,7]