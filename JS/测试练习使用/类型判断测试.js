let obj = {
    a: 1,
    b: 2
};
let arr = [1, 2, 3];

function fn(params) {
    console.log(1);
}

console.log(obj instanceof Object); //true
console.log(arr instanceof Array); //true
console.log(fn instanceof Function); //true
console.log(obj instanceof Array); //false
console.log(arr instanceof Object); //true
console.log(arr instanceof Function); //false