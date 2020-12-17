/*
    如何判断两个参数是否相等
        一：对于简单数据类型，我们直接使用 === 来判断。既可以判断类型，又可以判断值
        二：对于复杂数据类型。我们直接用全等号判断必然等到一个false的结果。因为引用数据类型，我们比对的是地址，而两个变量的地址必然不相同，所以比对的结果也必然是false。
            思路：那么既然复杂数据类型没办法比对，那我们就想办法把复杂数据类型转换为简单数据类型来进行比对。
            方法：
                1. 递归---先判断类型，然后再进行遍历拿到每个成员，对于成员仍然是复杂数据类型的，进行递归。
                2. JSON转换
                    特点：不管是简单数据类型，还是复杂数据类型，都可以用JSON判断。同时，JSON转换后，还可以判断数据类型。（不仅仅是值）
        三：当只有简单数据类型时，我们可以使用全等号去判断。当可能存在复杂数据类型时，我们直接JSON，没必要去判断其数据类型，然后再根据数据类型去进行比对。
*/


//示例
console.log(1 === 1); //ture
console.log(1 === '1'); //false
console.log([1, 2] === [1, 2]); //false
console.log([1, 2] === { a: 1 }); //false

console.log(JSON.stringify(1) === JSON.stringify(1)); //true
console.log(JSON.stringify(1) === JSON.stringify('1')); //false
console.log(JSON.stringify([1, 2, 3]) === JSON.stringify([1, 2, 3])); //true
console.log(JSON.stringify([1, 2, 3]) === JSON.stringify({ a: 1 })); //false
console.log(JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ a: 1, b: 2 })); //true