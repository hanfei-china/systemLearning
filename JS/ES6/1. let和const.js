//let和const的特点

//1. 不能进行变量提升

console.log(value1);
var value1 = 1;
//结果：undefined
console.log(value2);
let value2 = 2;
//结果：报错


//2. 不绑定全局变量
var a1 = 1;
console.log(window.a1); //1
let a2 = 2;
console.log(window.a2); //undefined


//3. 重复声明报错
let b1 = 1;
let b1 = 2; //此时会报错


//4. 形成块级作用域      块----{}之间的区域

//例1---if循环
if (false) {
    var value = 1;
}
console.log(value); //undefined;
if (false) {
    let value = 2;
}
console.log(value); //报错



//例2：for循环
var arr = [];
for (let i = 0; i < 3; i++) {
    arr[i] = function() {
        console.log(i);
    }
}
//代替闭包



// 在我们开发的时候，可能认为应该默认使用 let 而不是 var ，这种情况下，对于需要写保护的变量要使用 const。然而另一种做法日益普及：默认使用 const，只有当确实需要改变变量的值的时候才使用 let。这是因为大部分的变量的值在初始化后不应再改变，而预料之外的变量之的改变是很多 bug 的源头。