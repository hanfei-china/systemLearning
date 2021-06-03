//重写console.log方法，使其能够在打印值的时候前面输出输出时的时间戳
// 例：console.log('a') ===> 1584417233054 a
// console.log = (function (oldFn) {
//     return function () {
//         var time = new Date().getTime();
//         oldFn.call(console, time + ' ', ...arguments);
//     }
// })(console.log);
// console.log(1);


// let a= add(1)(2)(3)(4) let b = a(3)(2)(1) let c = b(8)()，如上add方法可以接收数字参数
// 进行传参，当传参空值时返回之前所有参数累加和，此时c = 1+2+3+3+2+1+8 = 20（
var add = (function () {
    var totle = 0;
    return function (val) {
        if (!val && val !== 0) {
            return totle;
        } else {
            totle += val;
            return add
        }
    }
})();
// let a = add(1)(2)
// let b = a(3)
// let c= b(4)()
// console.log(c);


//给定一个数字数组，找出其中不含重复数字子集的最大和
function sum(arr) {
    var obj = {};
    var num = 0;
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true;
            num += arr[i];
        }
    }
    return num;
}


//以尽可能低的代价去除已排序数组中的重复数字，且不要重新创建list，set，object等容器类型
function deleteSame(list) {
    if (!list.length) {
        return
    }
    var i = 0;
    for (let j = 2; j < list.length; j++) {
        if (list[j] != list[i]) {
            i++;
            list[i] = list[j]
        }
    }
    list.length = i + 1;
}
// var list = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3];
// deleteSame(list);
// console.log(list);

// 【JS Coding】树形结构拆分：给定一个树形结构，数据结构类似elementUI级联选择器，输出每层树
// 形结构的数组，并标注其parentId
// // 例：
// // 输入
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
function fn(arr) {
    var res = {};
    function digui(arr, num, parentId) {
        res[num] = [];
        for (let i = 0; i < arr.length; i++) {
            var obj = {
                value: arr[i].value,
                label: arr[i].label
            }
            if (parentId) {
                obj.parentId = parentId;
            }
            res[num].push(obj);
            if (arr[i].children) {
                digui(arr[i].children, num + 1, arr[i].value);
            }
        }
    }
    digui(arr, 0)
    return res;
}
function fn2(options) {
    var res = [];
    function digui(arr, num, parentId) {
        res[num] = [];
        arr.forEach(item => {
            var obj = {};
            obj.value = item.value;
            obj.label = item.label;
            if (parentId) {
                obj.parentId = parentId;
            }
            res[num].push(obj);
            if (item.children) {
                digui(item.children, num+1,item.value);
            }
        });
    }
    digui(options, 0, null);
    return res;
}
// console.log(fn2(options));

function getTargetTime(time) {
    var t1 = time.split('')[0];
    var t2 = time.split('')[2];
    var obj1 = {
        '上': -7,
        '本': 0,
        '下': 7
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
    var nowTime = new Date();
    var day1 = nowTime.getDay();
    var dayChange = obj1[t1] + obj2[t2] - day1;
    nowTime.setDate(nowTime.getDate() + dayChange);
    console.log(nowTime.getFullYear()+'-'+(nowTime.getMonth()+1)+'-'+nowTime.getDate())
}
// getTargetTime('下周五');




/**
 * initialize your data structure here.
 */
var MinStack = function() {
    this.arr=[];
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    this.arr.push(val);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    this.arr.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    var i=this.arr.length-1;
    return this.arr[i];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    var min=0;
    var list=this.arr;
    for(let i=0;i<list.length;i++){
        if(list[i]<min){
            min=list[i]
        }
    }
    return min
};
