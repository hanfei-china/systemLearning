//迭代器
function createIterator(str) {
    var len = str.length;
    var i = 0;
    return {
        next() {
            var value = len <= i ? undefined : str[i];
            var done = len <= i;
            return {
                value: value,
                done: done
            }
        }
    }
}

//模拟forof
function forof(obj, callback) {
    var iterator = obj.createIterator();
    var result = iterator();
    while (!result.done) {
        callback(result.value);
        result = iterator.next();
    }
}