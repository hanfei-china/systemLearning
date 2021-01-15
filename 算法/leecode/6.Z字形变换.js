// 将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。

// 比如输入字符串为 "LEETCODEISHIRING" 行数为 3 时，排列如下：

// L   C   I   R
// E T O E S I I G
// E   D   H   N
// 之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："LCIRETOESIIGEDHN"。

// 请你实现这个将字符串进行指定行数变换的函数：

// string convert(string s, int numRows);
// 示例 1:

// 输入: s = "LEETCODEISHIRING", numRows = 3
// 输出: "LCIRETOESIIGEDHN"
// 示例 2:

// 输入: s = "LEETCODEISHIRING", numRows = 4
// 输出: "LDREOEIIECIHNTSG"
// 解释:

// L     D     R
// E   O E   I I
// E C   I H   N
// T     S     G

//从这个结构和输出结果我们可以发现，其实就是每一行都是一个数组，然后在最终的时候合并四个数组。
//所以，主要问题在于每个字母如何判断它应该放到哪个数组当中去。
//我们从左到右去迭代字符串，然后可以当前行和当前的移动方向去确定当前字母在哪一行。当前的方向要么向上，要么向下。而且恰好每次在最上面或者最下面转换方向。
//根据移动方向，对当前行进行加或者减的移动
//那么如何判断当前是否移动到最高点或者最低点呢？
//之间验证当前行不就可以了


function turnZ(str, num) {
    //特殊情况的处理
    if (num == 1) {
        return str;
    }
    var arrow = true; //初始化移动方向---true为向下，false为向上
    var row = 0; //初始化当前行
    var obj = {};
    //初始化数组
    for (let i = 0; i < num; i++) {
        obj[i + 1] = [];
    }

    for (let i = 0; i < str.length; i++) {
        //每移动一个点，当前行就要移动
        if (arrow) {
            row++;
        } else {
            row--;
        }
        //当前行移动完毕后，就要验证是否为最高行或者最低行，从而进行方向的改变
        if (row == 1) {
            arrow = true;
        } else if (row == num) {
            arrow = false;
        }
        //将每个字母放置到对应的数组中
        obj[row].push(str[i]);
    }

    //拼接结果
    var res = [];
    for (let i = 0; i < num; i++) {
        res = res.concat(obj[i + 1]);
    }
    return res.join('');
}
// 输入: s = "LEETCODEISHIRING", numRows = 3
// 输出: "LCIRETOESIIGEDHN"
// 示例 2:

// 输入: s = "LEETCODEISHIRING", numRows = 4
// 输出: "LDREOEIIECIHNTSG"
var res1 = turnZ('LEETCODEISHIRING', 3);
var res2 = turnZ('LEETCODEISHIRING', 4);
console.log(res1);
console.log(res2);