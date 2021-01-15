// 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。

//  

// 注意：

// 假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−2^31,  2^31 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。
//  

// 示例 1：
// 输入：x = 123
// 输出：321

// 示例 2：
// 输入：x = -123
// 输出：-321

// 示例 3：
// 输入：x = 120
// 输出：21

// 示例 4：
// 输入：x = 0
// 输出：0



//方法一：使用字符串变换的方法。缺点：用了很多基本库，影响性能的其实。
function reverse(num) {
    var intMax = Math.pow(2, 31);
    var symbol = num > 0 ? '' : '-';
    var str = Math.abs(num) + '';
    var arr = [];
    for (let i = 0; i < str.length; i++) {
        arr.unshift(str[i]);
    }
    var res = (symbol + arr.join('')) - 0;
    if (res > intMax - 1 || res < -intMax) {
        return 0;
    } else {
        return res
    }
}
// console.log(reverse(123456));
// console.log(reverse(123400));
// console.log(reverse(-123400));


//方法二：使用数学方法.因为是十进制的数，所以可以根据这个规则去进行数字的获取。
function reverse2(num) {
    var intMax = Math.pow(2, 31);
    var res = 0;
    var pop = 0;
    while (num != 0) {
        pop = num % 10;
        num = parseInt(num / 10);
        res = res * 10 + pop;
        if (res > intMax - 1 || res < -intMax) {
            return 0
        }
    }
    return res;
}
console.log(reverse2(123456));
console.log(reverse2(123400));
console.log(reverse2(-123400));