function fn(str) {
    var len = Math.floor(str.length / 2);
    var arr = str.split('');
    var flag = true;
    for (let i = 0; i <= len; i++) {
        if (arr[i] !== arr[str.length - 1 - i]) {
            flag = false;
        }
    }
    return flag;
}
var str = '123454321';
var str1 = 'abccba';
var str2 = 'asdfsa';
var res = fn(str);
var res1 = fn(str1);
var res2 = fn(str2);
console.log(res);
console.log(res1);
console.log(res2);