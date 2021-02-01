var num = 0.027959306227701437;

function fn(val) {
    var per = (val * 100) + '';
    var intNum = per.split('.')[0];
    var floatNum = per.split('.')[1];
    if (!floatNum) {
        if (intNum > 0) {
            return intNum + '%'
        } else {
            return intNum
        }
    }
    var floatRes = [];
    var len = 0;
    for (let i = 0; i < floatNum.length; i++) {
        if (len == 1) {
            // if (floatNum[i + 1] > 4) {
            //     floatRes.push((floatNum[i] - 0) + 1);
            // } else {
            //     floatRes.push(floatNum[i]);
            // }
            floatRes.push(floatNum[i]);
            break;

        } else {
            if (floatNum[i] > 0) {
                len++;
            }
            floatRes.push(floatNum[i]);
        }
    }
    return [intNum, floatRes.join('')].join('.') + '%';
}

function fn2(num) {
    var num1 = ((num - 0) * 100).toFixed(2);
    return num1 + '%';
}