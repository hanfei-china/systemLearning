// 重写console.log方法，使其能够在打印值的时候前面输出输出时的时间戳
// 例：console.log('a') ===> 1584417233054 a

// console.log = (function (oldFn) {
//     return function () {
//         var time = new Date().getTime();
//         oldFn.call(console, time, ...arguments);
//     }
// })(console.log);
// console.log(1);




//let a= add(1)(2)(3)(4) let b = a(3)(2)(1) let c = b(8)()，如上add方法可以接收数字参数
// 进行传参，当传参空值时返回之前所有参数累加和，此时c = 1+2+3+3+2+1+8 = 20
var add=(function () {
    var totle = 0;
    return function (data) {
        if (data!==0&&!data) {
            return totle
        } else {
            totle += data;
            return add;
        }
    }
})()
// let a = add(1)(2)(3)(0);
// let b = a(3)(2)(1);
// let c = b(8)();
// console.log(c);





//给定一个数字数组，找出其中不含重复数字子集的最大和
var list = [1, 1, 2, 2, 3, 3, 4, 4];
function deleteSame(arr) {
    var obj = {};
    var sum=0;
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            sum += arr[i];
            obj[arr[i]] = true;
        }
    }
    return sum;
}
// console.log(deleteSame(list));






//用户输入中文的目标日期话术，返回具体时间
// 假定当前为2020-07-24 则getTargetTime('下周三') 输出2020-07-29
function fn(str) {
    var t1 = str.split('')[0];
    var t2 = str.split('')[2];
    var obj1 = {
        '上': -7,
        '本': 0,
        '下':7
    };
    var obj2 = {
        '一': 1,
        '二': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6,
        '日': 7,
    };
    var now = new Date();
    var today = now.getDay();
    var changeTime = obj1[t1] + obj2[t2] - now.getDay();
    now.setDate(now.getDate() + changeTime);
    var year = now.getFullYear();
    var month = fn2(now.getMonth() + 1);
    var day = fn2(now.getDate());
    console.log(`${year}-${month}-${day}`);
}
function fn2(time) {
    if (time<10) {
        return '0' + time;
    }else{
        return time;
    }
}
// fn('本周日');
// fn('本周四');
// fn('上周日');








//以尽可能低的代价去除已排序数组中的重复数字，且不要重新创建list，set，object等
// 容器类型
function fun(list) {
    var i = 0;
    for (let j = 1; j < list.length; j++) {
        if (list[j]!=list[i]) {
            i++;
            list[i] = list[j];
        }
    }
    list.length = i + 1;
    return list;
}
// console.log(fun([1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5]));
// console.log(fun([1, 2, 2, 2, 3, 3, 4, 5]));







//树形结构拆分：给定一个树形结构，数据结构类似elementUI级联选择器，输出每层树
// 形结构的数组，并标注其parentId
const options = [
    {
        name: "",
        value: 1,
        label: "家长原因",
        children: [
            {
                name: "",
                value: 11,
                label: "家长没时间辅导",
                children: [
                    {
                        name: "",
                        value: 111,
                        label: "三级测试用",
                    },
                ],
            },
            {
                name: "",
                value: 12,
                label: "家长不想上传",
            },
            {
                name: "",
                value: 13,
                label: "老人不会用设备",
            },
        ],
    },
    {
        name: "",
        value: 2,
        label: "孩子原因",
        children: [
            {
                name: "",
                value: 21,
                label: "没时间做",
            },
            {
                name: "",
                value: 22,
                label: "不想做",
            },
            {
                name: "",
                value: 23,
                label: "生病了",
            },
        ],
    },
    {
        name: "",
        value: 3,
        label: "其他",
    },
];
// // 输出
k = {
    0: [
        { value: 1, label: "家长原因" },
        { value: 2, label: "孩子原因" },
        { value: 3, label: "其他" },
    ],
    1: [
        { value: 11, label: "家长没时间辅导", parentId: 1 },
        { value: 12, label: "家长不想上传", parentId: 1 },
        { value: 13, label: "老人不会用设备", parentId: 1 },
        { value: 21, label: "没时间做", parentId: 2 },
        { value: 22, label: "不想做", parentId: 2 },
        { value: 23, label: "生病了", parentId: 2 },
    ],
    2: [{ value: 111, label: "三级测试用", parentId: 11 }],
}