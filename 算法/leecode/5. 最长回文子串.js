// 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

// 示例 1：

// 输入: "babad"
// 输出: "bab"
// 注意: "aba" 也是一个有效答案。
// 示例 2：

// 输入: "cbbd"
// 输出: "bb"


//判断是否为回文字符串
function ifStr(str) {
    var len = str.length;
    var max = Math.floor(len / 2);
    var flag = true;
    for (let i = 0; i < len; i++) {
        if (str[i] != str[len - 1 - i]) {
            flag = false;
            break;
        }
    }
    return flag;
}