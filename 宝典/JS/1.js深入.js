/*
    1. 原型和原型链
        一：原型
            1. 首先，我们要先知道什么是原型。我们在创建了一个对象后会发现，这个对象即便我们不操作，本身也会携带一些属性或者方法。那么这些属性或者方法从哪儿来的？就是从原型来的。
            2. 那原型的属性和方法从哪儿来的呢？从构造函数而来。或者说我们在创建了一个构造函数以后，就已经同步的创建了一个原型。
            3. 假设我们现在创建了一个构造函数Person，那么这个原型就是 Person.prototype。Person.prototype.constructor=Person;
            4. 那么构造函数如何设置那些想要给对象共有的属性和方法呢？通过原型来实现。Person.prototype本身可以看作是一个对象，我们可以给它去添加属性和方法。如  Person.prototype.a=function(){};Person.prototype.b=2;
            5. 那么，什么时候我们会将属性或者方法放到这里呢？因为构造函数本身也可以给实例对象上添加属性或者方法。---一般是那些固定的属性以及那些方法。对于一些在创建对象时需要传参的属性，我们一般选择在构造函数内部执行。对于固定的属性  以及  方法  则选择放到原型上。为什么呢？---避免每次创建对象的时候都要去执行那么多代码。
        二：原型链
            知道了什么是原型，接下来我们说一下什么是原型链。从上面知道，我们在创建一个对象后，会发现对象可以使用一些我们并没有创建的方法。比如数组都可以使用map、some、forEach等方法。从前面可以知道，这些方法使用原型上来的。那么对象是如何从原型上找到的呢？这个就是通过原型链找到的。我们在使用对象的属性或者方法的时候，首先会直接去找这个对象本身上有没有。有的话就直接使用，没有的话，就会通过__proto__去当前对象的原型上找。加入这个原型上没有，那么由于原型也是对象，就会向着这个原型的原型继续往上找。直至到达最终的原型（Object.prototype----Null）。那么这条顺着对象的  __proto__  属性向上找的链条就是原型链。
    
    2. JS 的作用域
        JS针对变量的有效范围有局部作用域和全局作用域。全局作用域中声明的变量为全局变量，针对全局范围内有效。但是代码中不能大量的使用全局变量，会造成内存泄漏。
        同时，JS本身是静态作用域（也叫词法作用域）。就是说函数的作用域在函数创建的时候就已经确定了，不会根据去执行的所在作用域而改变。
            比如 var a=1; function f1(){ var a=2;  f2();   }  function f2(){console.log(a)}  结果为1；
    
    3. 执行上下文栈
        JS代码在执行过程中，遇到可执行代码（全局代码、函数代码和eval代码）会进行分段。在分段前要进行准备工作：变量提升、作用域链和this。
            1. 变量提升：声明的变量会进行变量提升。
            2. 作用域链：局部作用域的变量会根据作用域链去外部寻找内部没有的变量。函数作用域在函数声明的时候就已经确定了。
            3. this指向---谁调用，指向谁。
    4. 闭包
        1. 如何形成：返回一个函数，这个函数内部使用了自由变量（即不是函数的参数，也不是函数内部变量的变量）
        2. 用处：可以保存函数内部的一个值，当函数执行完毕并销毁后，这个值不销毁，可供其他地方继续使用。
        3. 注意：不能使用太多的闭包，否则会造成内存泄漏。
        4. ES6以后可以，有些地方可以通过let和for配合来进行替换。let和for会形成一个个块作用域。进而代替闭包。
        4. 实例如下。

    5. 参数按值传递
        当我们给函数传入一个参数，且在函数内部对这个参数进行修改时，会有什么变化？
        如果，我们传入的是一个简单数据类型，那么此时就相当于直接复制了这个值。所以，函数内部使用的是修改后的值，但是并不会影响值本身
        如果，我们传入的是一个复杂数据。那么就相当于复制了一个堆的地址。我们如果直接改这个值，效果和简单数据类型的修改结果一样。如果是修改这个复杂数据中的一个属性或方法，那么就会让原数据跟着修改。

    6. call和apply的模拟实现
        call和apply的区别：传参的区别，apply传参是传入数组
        效果：改变函数内部的this指向
        注意事项：是可以传参的
        分析：改变函数的this指向，而函数在创建的时候就已经确定了作用域，也就是其所处的位置，也就是this指向已经确定了。那在这里我们想要使用这个方法，并且改变其内部的this指向，只能重新复制这个方法，然后在创建这个新方法的时候，修改其内部的this指向（即所处环境）.
            如何改变：对于对象而言，想指向那个对象，那么这个方法就是哪个对象上的方法。
        使用范围：函数内部针对其this做相关处理，即和调用此函数的对象有关
            比如我们会通过Object.prototype.toString.call('asdf')实现字符串使用对象的一个判断数据类型的方法
                为什么能使用？因为这个toString方法就是返回其内部this对象的数据类型。而这个函数内部的this指向谁？---谁调用指向谁！！！

    7. bind的模拟实现
        bind和call以及apply的区别是：bind返回的是一个函数，这个函数在创建的时候（通过bind创建的时候）以及使用的时候，都可以传参。
        返回的这个函数，内部结构和原函数一样，只是改变了this指向。
        具体的思路和call差不多，要注意的就是传参的问题。

    8. new的模拟实现
        new的过程其实就是创建了一个对象，然后这个对象可以通过原型以及构造函数内部的执行代码来获取到属性和方法。

    9.arguments
        特点：是一个类数组。只能使用for进行遍历，不能使用数组的其他方法
        属性：
            1. length属性
            2. callee属性---在函数内部可以通过arguments的这个属性获取到函数本身---可以用来解决闭包问题

    10. 继承的多种方法及优缺点
*/


//闭包使用示例
// var arr = [];
//ES5，不借助闭包的时候
// for (var i = 0; i < 3; i++) {
//     arr[i] = function() {
//         console.log(i);
//     }
// }
// arr[0]();
// arr[1]();
// arr[2]();

//ES5，借助闭包
// for (var i = 0; i < 3; i++) {
//     arr[i] = (function(i) {
//             return function() { //注意：这里千万不能传参，不然就不是自由变量了
//                 console.log(i);
//             }
//         })(i) //注意：这里要是不传参，那么最后使用的又是全局的那个变量了。
// }
// arr[0]();
// arr[1]();
// arr[2]();


//ES5，借助arguments的callee属性
// for (var i = 0; i < 3; i++) {
//     arr[i] = function() {
//         console.log(arguments.callee.i);
//     };
//     arr[i].i = i;
// }
// arr[0]();
// arr[1]();
// arr[2]();

//ES6
// for (let i = 0; i < 3; i++) {
//     arr[i] = function() {
//         console.log(i);
//     }
// }
// arr[0]();
// arr[1]();
// arr[2]();



//call的模拟实现
Function.prototype.call2 = function(obj) {
    //首先获取到原函数---this
    //然后改变其指向
    obj.fn = this;
    //传参
    var arr = [];
    for (let i = 1; i < arguments.length; i++) {
        arr.push(arguments[i]);
    }
    var res = obj.fn(...arr);
    delete obj.fn;
    return res;
}

//apply的模拟实现
Function.prototype.apply2 = function(obj) {
        obj.fn = this;
        var res = obj.fn(...arguments[1]);
        delete obj.fn;
        return res;
    }
    // var arr = [2, 3, 1, 5, 4, 6];
    // console.log(Math.max.apply2(arr, arr));



//bind的模拟实现
Function.prototype.bind2 = function(obj) {
    var self = this;
    obj.fn = self;
    var arr1 = Array.prototype.slice.call(arguments, 1);
    return function fn() {
        var arr2 = Array.prototype.slice.call(arguments);
        return obj.fn(...(arr1.concat(arr2)));
    }
}

// new的模拟实现
function sameNew() {
    //这里是将new看作是一个函数，然后构造函数也作为一个参数传入
    var Fun = arguments[0]; //构造函数
    var obj = {};
    var arr = Array.prototype.slice.call(arguments, 1);
    Fun.apply(obj, arr);
    obj.__proto__ = Fun.prototype;
    return obj;
}


//组合继承
function Parent(uname) {
    this.name = uname
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

function Son(uname, age) {
    Parent.call(this, uname);
    this.age = age;
}
Son.prototype = new Parent();
Son.prototype.constructor = Son; //要将子构造函数的原型指回去。因为前面为了通过原型去继承父构造函数的属性和方法，将子构造函数的原型指向了父构造函数的实例对象。那么为了保证原型链不出问题，我们必须把子