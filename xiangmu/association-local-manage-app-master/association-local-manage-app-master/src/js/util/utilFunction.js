//时间格式化函数
export function formatDate(dateObj, format) {
    let o = {
        "M+": dateObj.getMonth() + 1,
        "d+": dateObj.getDate(),
        "h+": dateObj.getHours() % 12 === 0 ? 12 : dateObj.getHours() % 12,
        "H+": dateObj.getHours(),
        "m+": dateObj.getMinutes(),
        "s+": dateObj.getSeconds(),
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),
        "S": dateObj.getMilliseconds()
    };
    let week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[dateObj.getDay() + ""]);
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}


export function currency(money, needDecimal = true, needComma = true) {
    // 格式化货币显示
    if (money == null || typeof money == 'undefined') {
        return '--';
    }
    let value = ('' + money).split('.');

    let num;
    if (needComma) {
        num = value[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    } else {
        num = value[0];
    }

    if (needDecimal) {
        if (value.length === 2) {
            num = num + '.' + value[1];
        } else {
            num = num + '.00';
        }

    }
    return num;
}


export function transferData(field, value, branchList) {
    if (value === null || value === undefined || value === '' || value === 'null') {
        return '';
    }
    let {topicType, parameter} = field;

    if (!parameter) {
        parameter = {};
    }

    if (typeof parameter == 'string') {
        parameter = JSON.parse(parameter);
    }

    if (topicType === 0 || topicType === 1) {
        //多行文本或单行文本
        return value;
    }

    if (topicType === 2 || topicType === 10 || topicType === 15) {
        let {options} = parameter;
        if (options.length != 0) {
            for (let option of options) {
                if (option.key === value) {

                    return option.title;
                }
            }
        } else {
            // return value;
            return ""
        }

    }

    if (topicType === 3) {

        let {options} = parameter;
        let str = '';
        if (options) {
            for (let option of options) {
                if (value.includes(option.key)) {
                    str += option.title + "；";
                }
            }
        }
        return str.slice(0, -1);
    }

    // 加入分会列表，先获取分会list；
    if (topicType === 14) {
        var options = branchList;
        let str = '';
        if (options) {
            for (let option of options) {
                // if (value.includes(option.id)) {
                str += option.branchName + "；";
                // }
            }
        }
        return str.slice(0, -1);
    }

    if (topicType === 5) {

        let {dateType} = parameter;
        if (dateType === 'date') {
            return formatDate(new Date(value), 'yyyy-MM-dd');
        }

        if (dateType === 'datetime') {
            return formatDate(new Date(value), 'yyyy-MM-dd HH:mm:ss');
        }

        if (dateType === 'year') {
            return formatDate(new Date(value), 'yyyy');
        }
    }


    if (topicType === 6 || topicType === 8) {
        let str = '';
        let valueArray;
        if (typeof value === 'string') {
            try {
                valueArray = JSON.parse(value);
            } catch (e) {
                return value;
            }
        } else {
            valueArray = value;
        }

        for (let i = 0; i < valueArray.length; i++) {
            str += valueArray[i] + "-";
        }
        return str.slice(0, -1);
    }

    return '';
}


export function encryptedPhone(value) {
    if (!value) {
        return '';
    }
    let reg = /^(\d{3})\d{4}(\d{4})$/;
    return value.replace(reg, "$1****$2");
}

const translatorMenus = (parents, children, parentId = 'parentId') => {

    //遍历父节点数据
    parents.forEach(parent => {
        //遍历子节点数据
        children.forEach((current, index) => {
            //若该节点是对应的父级节点的子节点
            if (current[parentId] === parent.id) {
                //深拷贝一份子节点数组
                let temp = JSON.parse(JSON.stringify(children));
                //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                temp.splice(index, 1);
                //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                translatorMenus([current], temp);
                //把找到子节点放入父节点的children属性中
                parent.children ? parent.children.push(current) : parent.children = [current];
            }
        });
    });

};

const translatorKeys = (menus, keys, results, parentId = 'parentId') => {

    keys.forEach(key => {
        let menu = menus.find(menu => {
            return menu[parentId] === key;
        })
        if (!menu) {
            results.push(key);
        }
    })

}

export {translatorMenus, translatorKeys};


/**
 * 级联数组转字符串
 * @param value
 * @param split
 * @returns {string}
 */
export function cascadeArrayToString(value, split = '-') {

    if (!value) return '';

    if (typeof value === 'string') {
        value = JSON.parse(value);
    }

    let str = '';

    value.forEach(item => {
        str += item + split;
    });

    return str.slice(0, -1);
}

/**
 * 对象数组转字符串
 * @param objects
 * @param key
 * @param split
 * @returns {string}
 */
export function objectArrayToString(objects, key, split = '；') {
    let str = '';

    objects.forEach(industry => {
        str += industry[key] + split;
    });

    return str.slice(0, -1);
}

/**
 * 数组或对象以“-”分割为字符串返回
 * @param temp (Array|Object)
 * @param key
 * @param split
 * @returns {string}
 */
export function objectArraySplit(temp, split = '-') {
    let valueObj;
    if (temp && typeof temp === "string") {
        valueObj = JSON.parse(temp)
    } else if (temp && typeof temp === "object") {
        valueObj = temp;
    } else {
        return ''
    }
    if (Object.keys(valueObj).length) {
        let arr = []
        Object.keys(valueObj).forEach(key => {
            arr.push(valueObj[key])
        })
        return arr.join(split)
    } else {
        return ''
    }
}

let imgExt = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];//图片文件的后缀名
let docExt = [".doc", ".docx"];//word文件的后缀名
let xlsExt = [".xls", ".xlsx"];//excelel文件的后缀名
let pptExt = [".ppt", ".pptx"];//ppt文件的后缀名
let pdfExt = [".pdf"];
let zipExt = [".zip", ".tar", ".gz", ".war"];
let txtExt = [".txt"];//css文件的后缀名

export function getFileExt(fileName) {
    if (!fileName) return null;
    let ext = null;
    let name = fileName.toLowerCase();
    let i = name.lastIndexOf(".");
    if (i > -1) {
        ext = name.substring(i);
    }
    return ext;
}

export function isImg(ext) {
    return imgExt.indexOf(ext) !== -1;
}


export function isWord(ext) {
    return docExt.indexOf(ext) !== -1;
}


export function isExcel(ext) {
    return xlsExt.indexOf(ext) !== -1;
}


export function isPPT(ext) {
    return pptExt.indexOf(ext) !== -1;
}


export function isPDF(ext) {
    return pdfExt.indexOf(ext) !== -1;
}


export function isZIP(ext) {
    return zipExt.indexOf(ext) !== -1;
}

export function isTxt(ext) {
    return txtExt.indexOf(ext) !== -1;
}
