// 斐波那契数，通常用 F(n) 表示，形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：

// F(0) = 0，F(1) = 1
// F(n) = F(n - 1) + F(n - 2)，其中 n > 1
// 给你 n ，请计算 F(n) 。

//例子：
// 输入：2
// 输出：1
// 解释：F(2) = F(1) + F(0) = 1 + 0 = 1

//思路：除了F（0）和F（1），我们并不知道仍和数字。所以，我们想要求出F(n)的值，必须要通过公式重复的进行分解，直到分解为F(0)和F(1)的值。

//所以，我们要使用递归（重复进行某个操作）
//递归式：公式的调用，将F(n)向前分解
//递归边界：为0或者1时











function fib(n) {
    if (n == 0) {
        return 0;
    } else if (n == 1) {
        return 1;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}

function fib2(n) {
    var obj = {};
    obj[0] = 0;
    obj[1] = 1;
    for (let i = 2; i <= n; i++) {
        obj[i] = obj[i - 1] + obj[i - 2];
    }
    return obj[n];
}

console.log(fib2(0)); //0
console.log(fib2(1)); //1
console.log(fib2(2)); //1
console.log(fib2(3)); //2
console.log(fib2(4)); //3
console.log(fib2(5)); //5
console.log(fib2(6)); //8