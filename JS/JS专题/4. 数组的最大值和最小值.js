//1. 循环遍历
function getMax(arr) {
    var max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
        }
    }
    return max;
}


//使用Math的方法
var arr = [1, 2, 3];
Math.max.apply(arr);
Math.max(...arr);

//排序，然后取最后一个



//综上，其实从算法的角度来看，第一种方式相对来说比较好。