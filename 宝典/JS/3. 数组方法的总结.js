/*
    1. 删除、添加的方法
        1. 方法：
            1. push、pop  从数组的后面添加、删除
            2. unshift、shift   从数组前面添加、删除的方法
        2. 特点：
            1. 添加的方法，可以添加一个，也可以添加多个
                push(1)  push(...arr)
            2. 删除的方法，不传入参数，同时每次只能删除一个
                pop()   shift()
            3. 这几个方法都是直接修改原数组的
            4. 添加的方法，返回的是修改后的数组的长度。删除的方法，返回的是删除的值
*/
// var arr = [1, 2];
// console.log(arr, arr.push(1));//[1,2,3]  3
// console.log(arr.pop());//1

/*
    2. 截取及筛选的方法
        1. splice---删除、添加、替换的方法
            1. 使用方法：传入三个参数，依次分别是：开始的下表、删除的个数、插入的值。返回的是处理后的数组
                1. 第一个参数为必传参数
            2. 特点
                1. 修改原数组
                2. 返回的并不是原数组，而是截取到的那部分成员组成的数组
                    如果操作只是添加元素，那么此时就返回的是空数组。因为返回的是删除的那部分成员组成的数组
            3. 使用方法
                1. 删除  arr.splice(0,1)
                2. 添加  arr.splice(0,0,4);
                3. 替换  arr.splice(0,1,4);
        2. slice---截取
            1. 使用方法
                1. 传入两个参数，分别为截取开始的参数和截取结束的参数。
                2. 不修改原数组，返回的为截取的成员组成的数组。
                3. 当不传入参数时，默认截取全部。当截取结束参数不传入时，表示从开始参数截取值尾部
                4. 传入的两个参数---包左不包右
            2. 使用
                1. arr.slice()---全部截取
                2. arr.slice(2)---从下标为2的地方截取到尾部
                3. arr.slice(1,4)---从下标1截取到下标4

        3. substr
            1. 使用方法
                1.传入两个参数，开始的下标和截取的个数
            2. 其他的特点及使用方法和slice相同

    3. concat---拼接
        1. 使用方法
            1. 可以传入数组，也可以直接传入值
            2. 可以传入一个参数，也可以传入多个参数
            3. 不修改原数组，返回拼接后的新数组

    4. join---数组转换为字符串，和字符串的split方法对应

    5. 查找
        1. indexOf
            1. 传入到从数组中查询的元素
            2. 如果有，返回下标
            3.如果没有，返回-1
            4. 所以，使用indexOf查询的时候，要判断有没有，可以判断其返回值是否小于0
        2. findIndex
            1. 传入的参数是一个函数，这个函数的参数和filter的参数相同
            2. 这个函数的使用方式类似于some，返回第一个满足条件的元素的下标
    6. 排序
        1. sort
            1. 可以实现升序或者降序
            2. 参数是一个函数，通过设置函数的返回值来实现升序或者降序
            3. 直接修改原数组，返回值就是原数组

    7. forEach  filter   some   map
        1. 这几个方法其实本质上来讲是for循环的一个应用，这几个方法的区别可以从用途上来实现区分。
        2. 区分
            1. forEach---就是for循环的一个语法糖，没有特殊的作用。
            2. filter---返回的是一个满足条件的数组的集合。不可以修改原数组中的元素的值。
            3. some---返回一个布尔值。主要的功能是查找这个数组中是否有满足条件的值，当找到第一个满足的值后立即停止循环，返回true。
            4. map---返回一个数组，这个数组中的元素是我们在原数组的元素基础上进行处理后的元素组成的。
*/


//splice
// var arr = [1, 2, 3];
// console.log(arr.splice());//[]---第一个参数为必传参数
// console.log(arr, arr.splice(1));//[1]  [2,3]
// console.log(arr, arr.splice(0, 0, 4));//[4,1,2,3]   []  ---只返回删除的成员组成的数组


//slice
// var arr = [1, 2, 3, 4];
// console.log(arr, arr.slice());//[1,2,3,4]  [1,2,3,4]
// console.log(arr, arr.slice(1));//[1,2,3,4]  [2,3,4]
// console.log(arr.slice(1, 3));//[2,3]


//concat
// var arr = [1];
// console.log([].concat(arr));//[1]
// console.log([].concat(arr,[2]));//[1,2]
// console.log([].concat(arr,2,3));//[1,2,3]
// console.log([].concat(1,2,3));//[1,2,3]
// console.log(arr);//[1]


//findIndex
// var arr = [1, 2, 3, 4, 5];
// var res=arr.findIndex(item => {
//     return item>2
// })
// console.log(res);//2---下标

//sort
// var arr = [1, 3, 2, 4, 6, 5];
// var res1 = arr.sort((a, b) => {
//     return a - b
// })//升序
// console.log(res1);//[1,2,3,4,5,6]
// var res2 = arr.sort((a, b) => {
//     return b - a
// })//降序
// console.log(res2);//[6,5,4,3,2,1]


//reverse
// var arr = [1, 2, 3];
// console.log(arr.reverse());//[3,2,1];


//forEach filter some map
var arr = [1, 2, 3, 4, 5, 6];
var res = arr.filter(item => {
    return item > 4
});
// console.log(res);//[5,6];

var res2 = arr.some(item => {
    console.log(item);
    return item>2
})
// console.log(res2)//1  2  3  true


var res3 = arr.map(item => {
    return item + 2;
})
// console.log(res3);//[3,4,5,6,7,8];