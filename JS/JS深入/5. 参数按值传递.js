//这里主要是研究函数的参数传递的方式

//下面看三种情况

//基本数据类型传值
var a = 1;

function f1(b) {
    var b = 2;
    console.log(b);
}

f1(a);
console.log(a);
//结果：2  1   
//结论：当函数的参数为基本数据时，采用的按值传递的方式，类似与拷贝。在函数内部修改参数的值，不会影响这个参数本身的值。



//复杂数据类型---直接修改复杂数据本身
var obj = {
    a: 1
};

function f2(o) {
    o = 3;
    console.log(o);
}
f2(obj);
console.log(obj);
//结果：3  {a:1} 
//结论：如果传入的值为复杂数据，且要直接修改这个值，那么修改会失效




//复杂数据---修改复杂数据的某个属性（或者数组的某个成员的值）
var obj2 = {
    b: 11
};

function f3(o) {
    o.b = 22;
    console.log(o)
}
f3(obj2);
console.log(obj2);
//结果：{b:22}    {b:22}
//结论：传入的是复杂数据，修改其上的某个成员或属性时，修改会影响到这个值本身



//总结：函数的参数传递过程可以总结为按值传递。对于基本数据类型，相当于直接复制。对于复杂数据类型，相当于拷贝了复杂数据类型的在堆上存储的地址。所以当修改属性值或者某个成员时，我们通过地址直接知道了堆上面，是会影响到数值的。然而当我们直接修改拷贝的值时，其实我们是在试图改变一个宝贝的栈的值（也就是堆上的地址）。所以，并没有什么用，不会影响到值本身的。