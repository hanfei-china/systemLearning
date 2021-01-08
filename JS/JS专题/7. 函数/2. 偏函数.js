//偏函数：将一个函数固定某个参数，进而将其转变为一个更小元的函数（参数更少）---几个参数就是几元函数
/*
    偏函数和柯里化的区别：
                        1. 偏函数要固定其中的某个或者某些参数的值
                        2. 函数柯里化是转换为一系列只是用一个参数的函数，而偏函数主要是进行函数的降元，并不一定是只有一个参数。
*/


//需要的知识点：一个函数fn，想要知道这个函数的形参的个数的方法：fn.length；想要知道实参的个数：在函数内部使用arguments.length


//示例
function add(a, b) {
    console.log(a + b);
    console.log(this);
}


//方法一：使用bind，但是会改变this指向，所以严格来讲，并不是偏函数
var add1 = add.bind(null, 1);
add1(2); //3
//此时add1的this指向了window



//方法二：不改变this指向
/*
    思路：
        1. 目的：写一个  偏函数  ，通过这个函数执行目标函数，然后返回一个新的函数
        2. 特点：偏函数传入的参数个数为a，目标函数的参数的个数为b，那么返回的这个函数的参数个数则为b-a。且会自动去甄别这个数到底有没有达到预期。
        3. 如果没有达到目标函数预期的参数数量，那么不会执行目标函数。如果达到了，那么就会执行---所以，偏函数和函数柯里化都有很重要的一步：那就是判断参数的个数
*/

function partial(fn) {
    var args = [].slice.apply(arguments, 1);
    return function() {
        var arg2 = args.concat([].slice.apply(arguments, 0));
        return fn.apply(this, arg2);
    }
}