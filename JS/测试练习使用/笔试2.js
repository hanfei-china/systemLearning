//实现友好时间
function friendlyTime(time) {
    var t1 = new Date(time);
    var t2 = new Date();
    var t3 = t2 - t1;
    var month = t3 / (60 * 60 * 24 * 30);
    var day = t3 / (60 * 60 * 24);
    var hour = t3 / (60 * 60);
    var min = t3 / 60;
    if (month >= 1) {
        return parseInt(month) + '个月前';
    } else if (day >= 1) {
        return parseInt(day) + '天前';
    } else if (hour >= 1) {
        return parseInt(hour) + '个小时前';
    } else if (min >= 1) {
        return parseInt(min) + '分钟前';
    } else {
        return '刚刚';
    }
}

//数组去重
var arr = [1, 1, 2, 2, 1, 1, 3, 3];
function f1(list) {
    var res = [];
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < res.length; j++) {
            if (res[j] == list[i]) {
                break;
            }
        }
        if (j == res.length) {
            res.push(list[i])
        }
    }
    return res;
}
// console.log(f1(arr));
function f2(list) {
    var obj = {};
    var res = [];
    for (let i = 0; i < list.length; i++) {
        if (!obj[list[i]]) {
            obj[list[i]] = true;
            res.push(list[i]);
        }
    }
    return res;
}
// console.log(f1(arr));
// 请实现如下函数，可以批量请求数据,所有的 url 地址在 urls 参数中，同时可以通过 max 参数控制请求的并行数，当所有请求结束之后，需要执行 callback 回调函数，发送请求的函数可以直接使用 fetch 即可

function sendRequest(urls, max, callback) {
    if (max>=urls.length) {
        return 
    }
    function create(url) {
        return new Promise(resolve => {
            fetch(url, () => {
                resolve();
            })
        })
    }
    var arr = [];
    for (let i = 0; i < urls.length; i++) {
        arr.push(create(urls[i]));
    }
    Promise.all(arr).then(res => {
        callback(res);
    })
}