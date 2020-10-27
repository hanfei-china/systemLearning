/* 
    watch监听器
     目的：创建一个方法，当引入这个方法时，传入要监听的watch对象，然后就可以监听watch内部的成员，同时当改变值时调用watch对象内部的方法---类似与vue的watch监听器

     步骤：
        1. 解析传入的watch对象。注意：这里的watch对象内部有两种形式：一种是直接监听对象；另一种是监听对象内部的成员（"obj.name"）
            所以，就需要注意两个方面：
                                    1. 要传入watch内部成员所在的对象---因为这些成员要被监听，其实是作为其父对象的一个属性实现监听的。比如vue中的this对象和data中的成员的关系。
                                    2. 要对watch内部的所有成员进行处理---（"obj.name"）格式的监听器处理
        2. 使用Object.defineProperty方法进行监听器的添加
*/
function watchAdd(obj, keys) {
    //1. 先进行监听对象集合的解析
    Object.keys(keys).forEach(key => {
        //2. 进行（"obj.name"）格式的处理
        //如果是（"obj.name"）格式，那么就表明我们使用Object.defineProperty方法时传入的对象发生了变化
        //原来是大对象---watch成员所在的父对象
        //现在是小对象---watch成员本身
        let setObj = null;
        let setMember = null;
        let zhi = null;
        if (key.split('.').length > 1) {
            setObj = obj[key.split('.')[0]];
            setMember = key.split('.')[1];
            zhi = obj[key.split('.')[0]][key.split('.')[1]];
        } else {
            setObj = obj;
            setMember = key;
            zhi = obj[key];
        }

        //3. 使用Object.defineProperty方法进行监听
        Object.defineProperty(setObj, setMember, {
            get() {
                return zhi;
            },
            set(val) {
                zhi = val;
                console.log('检测到这个值发生变化了');
                keys[key]();
            }
        })
    })
}


var data = {
    obj: {},
    a: 2
};

function setWatch(obj, key) {
    let val = obj[key];
    Object.defineProperty(obj, key, {
        get() {
            return val
        },
        set(newVal) {
            console.log(newVal);
            val = newVal;
        }
    })
}
setWatch(data, 'obj');
setWatch(data, 'a');
// data.obj.a = 3; //没有输出
data.obj = null; //null
data.a = 3; //3


//结论：
/**
    1. Object.defineProperty方法不能检测到对象属性的添加与否;
    2. Object.defineProperty能检测到这个值的类型变化或者值的有无（复杂数据也是）
    3. vue中watch监听器，我们经常用来监听props数据，其实就是监听这个数据的有无，而不是监听数据本身的变化
    4. vue中watch监听器的deep属性，其实就是将对象进行了遍历，然后分别进行监听器的注册。所以使用deep属性，性能消耗很大。
 */