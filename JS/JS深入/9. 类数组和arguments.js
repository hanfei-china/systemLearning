/*
    一：类数组：一个在读写、遍历和读取长度方面和数组相同的对象
    二：例子：
        var sameArr={
            0:'刘亦菲',
            1:'女',
            2:'漂亮',
            length:3
        }
        var arr=['刘亦菲','女','漂亮']
        1. 读写：sameArr[1]=='女;
        2. 读取长度：sameArr.length=arr.length;
        3. 遍历
                for(var i = 0, len = arrayLike.length; i < len; i++) {
                    ……
                }
    三：类数组使用数组的方法
        1. 类数组本身是个对象，是不能直接使用数组的方法的，不过我们可以通过call或者apply方法等进行转换，然后使用
                var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
                Array.prototype.join.call(arrayLike,'&');//'name&age&sex'  注意：已经没有length了。因为数组的方法本身其实主要是通过遍历来实现的，所以就不会遍历到length属性的
                Array.prototype.slice(arrayLike,0);//可以获取一个数组
    四：类数组转换为数组
        1. Array.prototype.slice.call(arrayLike,0);
        2. Array.prototype.concat.apply([],arrayLike);
        3. Array.prototype.splice(arrayLike,0);
        4. Array.from(arrayLike);

*/



//arguments
/*
    一：arguments---也是一个类数组
    二：arguments的属性（下标在上面已经提过了）
        1. length属性---实参的个数
        2. callee属性---在函数内部，可以通过arguments的callee属性获取到函数本身
*/

//例子---callee的使用---解决闭包问题


//使用var---没有形成闭包
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = function() {
        console.log(i);
    }
}
data[0](); //3
data[1](); //3
data[2](); //3


//使用var，且形成闭包
/*
    形成闭包的条件：
                  1.创建它的上下文已经销毁，而它还存在---其实就是告诉我们，我们使用的其实就是一个函数的返回值
                  2. 必须是一个函数，同时，函数内部使用了自由变量---结合上一条，就是一个函数返回值为函数，我们使用这个返回的函数。且这个函数内部使用了自由变量 
                  3. 这个自由变量必须是父函数的变量或者参数。
*/
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = (function(i) {
        return function() {
            console.log(i);
        }
    })(i)
}
data[0](); //0
data[1](); //1
data[2](); //2


//注意：父函数必须要传入实参，并设定形参。否则的话内部的函数访问的又变成了最外面的i了。等到执行的时候，这个i值已经是3了。本质就是没有形成闭包。


//如何避免使用闭包


//方法一：使用arguments的callee属性
/*
    分析：
        1. 要想不适用闭包，且保存循环过程中的每个i值。那就需要每次循环，都把i存到某个固定的值上。然后在使用的时候去取出来。
        2. 因为是函数内部要使用这个值，所以最好保存在函数本身上。然后使用的时候取出来即可。
*/
var data = [];
for (var i = 0; i < 3; i++) {
    (data[i] = function() {
        console.log(arguments.callee.i);
    }).i = i;
}
data[0](); //0
data[1](); //1
data[2](); //2


//方法二：使用let，通过块作用域代替闭包
var data = [];
for (let i = 0; i < 3; i++) {
    data[i] = function() {
        console.log(i);
    }
}
data[0](); //0
data[1](); //1
data[2](); //2



//arguments 和对应参数的绑定
// function foo(name, age, sex, hobbit) {

//     console.log(name, arguments[0]); // name name

//     // 改变形参
//     name = 'new name';

//     console.log(name, arguments[0]); // new name new name

//     // 改变arguments
//     arguments[1] = 'new age';

//     console.log(age, arguments[1]); // new age new age

//     // 测试未传入的是否会绑定
//     console.log(sex); // undefined

//     sex = 'new sex';

//     console.log(sex, arguments[2]); // new sex undefined

//     arguments[3] = 'new hobbit';

//     console.log(hobbit, arguments[3]); // undefined new hobbit

// }

// foo('name', 'age')




//结合ES6---转换为数组
// function func(...arguments) {
//     console.log(arguments); // [1, 2, 3]
// }

// func(1, 2, 3);



//传参
// 使用 apply 将 foo 的参数传递给 bar
// function foo() {
//     bar.apply(this, arguments);
// }
// function bar(a, b, c) {
//    console.log(a, b, c);
// }

// foo(1, 2, 3)