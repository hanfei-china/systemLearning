//题目:红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？
//就是按顺序依次亮起红灯和黄灯以及绿灯.时间间隔分别是3s  2s   1s
function red() {
    console.log('red');
}

function green() {
    console.log('green');
}

function yellow() {
    console.log('yellow');
}

function light(timer, callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, timer);
    })
}

function loop() {
    light(3000, red).then(function() {
        return light(2000, green)
    }).then(function() {
        return light(1000, yellow)
    }).then(function() {
        loop();
    })
}
loop();