// JS的作用域为词法作用域(静态作用域)---函数的作用域在函数定义的时候就已经决定了。
// 动态作用域---函数的作用域在函数执行的时候才决定

//词法作用域例子：
var value = 1;

function f1() {
    console.log(value);
}

function f2() {
    let value = 2;
    f1();
}

f2(); //结果为1
//因为JS采用的是词法作用域，在函数定义的时候就已经确定了函数的作用域。这里，虽然f1函数是在f2内部执行的，但是f1函数本身是在全部中定义的，而不是在f2定义的。所以在作用域链上，f1的局部作用域向上只能是去找全局作用域了。



//例2
var v = 1;

function f3() {
    let v = 2;
    f4();

    function f4() {
        console.log(v);
    }
}

f3(); //2



//例3
var scope = "global scope";

function checkscope() {
    var scope = "local scope";

    function f() {
        return scope;
    }
    return f();
}
checkscope(); //local scope


//例4
var scope = "global scope";

function checkscope() {
    var scope = "local scope";

    function f() {
        return scope;
    }
    return f;
}
checkscope()(); //还是local scope