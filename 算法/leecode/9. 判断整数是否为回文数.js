// 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

// 示例 1:

// 输入: 121
// 输出: true
// 示例 2:

// 输入: -121
// 输出: false
// 解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
// 示例 3:

// 输入: 10
// 输出: false
// 解释: 从右向左读, 为 01 。因此它不是一个回文数。

// 方法一：转换为字符串
function chackIf(num) {
    var str = num + '';
    var length = str.length;
    var len = Math.floor(str.length / 2);
    var flag = true;
    for (let i = 0; i < len; i++) {
        if (str[i] != str[length - 1 - i]) {
            flag = false;
            break;
        }
    }
    return flag;
}
console.log(chackIf(1234321)); //true
console.log(chackIf(1234)); //false
console.log(chackIf(12344321)); //true
console.log(chackIf(01210)); //false


//方法二：不转换为字符串