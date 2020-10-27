//bind的定义：bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。
//总结：bind方法会返回一个改变了this指向的函数，同时，这个过程是可以传参的

//例1
// var obj = {
//     value: 1
// }

// function bar() {
//     console.log(this.value);
// }

// var res = bar.bind(obj);
// res();


//模拟实现第一步---实现this指向的改变，同时返回一个函数
// Function.prototype.bind2 = function(obj) {
//     var self = this;
//     return function() { //第一个return返回值是函数，这是因为bind返回的就是一个函数
//         return self.apply(obj); //第二个return的作用：应对函数本身有返回值的情况
//     };
// }


//模拟实现第二步---实现传参---在bind方法中可以传，同时返回的函数也可以接受参数
Function.prototype.bind2 = function(obj) {
    var self = this;
    var arr = Array.prototype.slice.call(arguments, 1); //巧妙的使用call方法，从而让某些对象可以借用其他的方法
    return function() { //第一个return返回值是函数，这是因为bind返回的就是一个函数
        var arr1 = Array.prototype.slice.call(arguments);
        return self.apply(obj, arr.concat(arr1)); //第二个return的作用：应对函数本身有返回值的情况
        //注意，这里拼接后的数组没有结构，因为我们使用的是apply方法
    };
}
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind2(foo, 'daisy');
bindFoo('18');


//第三步：构造函数有关---没看懂，所以这里并没有亲手实现