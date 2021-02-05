// 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

// 示例 1：
// 输入：[1,8,6,2,5,4,8,3,7]
// 输出：49 
// 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。---从8到7，此时两个边界形成的容器高度为7，长度为7.所以最大值为49

// 示例 2：
// 输入：height = [1,1]
// 输出：1

// 示例 3：
// 输入：height = [4,3,2,1,4]
// 输出：16

// 示例 4：
// 输入：height = [1,2,1]
// 输出：2



//解析:这道题最麻烦的问题在于多种可能性.如果使用粗暴法去解决的话也是可以的,但是那样就会出现嵌套的循环,这不符合我们的需求.然后,看到这里,就会想到使用指针去优化.那如何使用指针呢?对于缩减范围的需求,我们很多情况下都是使用的双指针.

//暴力破解法
function fn1(arr) {
    var res = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            var height = arr[i] > arr[j] ? arr[j] : arr[i]; //容器的高度去最矮的
            var width = j - i; //容器的宽度
            var max = width * height;
            if (max > res) {
                res = max;
            }
        }
    }
    return res;
}

//使用双指针
//因为容器的特性.我们让指针指向边界.此时如果希望能够让容器变大,我们要做的就是往内部移动较小的那个指针(容器体积的高度和最小的那个值有关).这样,随着指针的移动,范围就在逐步减小.

function fn2(arr) {
    var i = 0;
    var j = arr.length - 1;
    var res = 0;
    while (i != j) {
        var height = arr[i] > arr[j] ? arr[j] : arr[i]; //容器的高度去最矮的
        var width = j - i; //容器的宽度
        var max = width * height;
        if (max > res) {
            res = max;
        }
        //指针移动
        arr[i] > arr[j] ? j-- : i++;
    }
    return res;
}

var arr1 = [1, 8, 6, 2, 5, 4, 8, 3, 7]; //49
var arr2 = [1, 1]; //1
var arr3 = [4, 3, 2, 1, 4]; //16
var arr4 = [1, 2, 1]; //2

// console.log(fn1(arr1));
// console.log(fn1(arr2));
// console.log(fn1(arr3));
// console.log(fn1(arr4));


console.log(fn2(arr1));
console.log(fn2(arr2));
console.log(fn2(arr3));
console.log(fn2(arr4));