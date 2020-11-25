//要想模拟实现，可以根据其使用过程来反推出来
var promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2);
            resolve(3); //当执行resolve的时候，然后就会调用then方法
        }, 0);
        console.log(1);
    }).then(res => {
        console.log(res);
        console.log(4);
    })
    //运行结果： 1 2 3 4


var promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1); //执行reject的时候，就是调用catch
            console.log(2);
            resolve(3) //当先执行了reject以后，就不会执行resolve了
        }, 0);
        console.log(4);
    }).then(res => {
        console.log(res);
        console.log(5);
    }).catch(res => {
        console.log(res); //这一步的输出要慢与console.log(2)，因为这是在一个微任务中，必须要等同步任务先完成---Promise的then方法和catch方法都是异步任务的微任务
        console.log(6);
    })
    //运行结果： 4 2 1 6