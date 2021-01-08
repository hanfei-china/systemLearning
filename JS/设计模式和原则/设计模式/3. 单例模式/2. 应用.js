//例1：实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。

//实现方法---闭包。类的静态方法后续补充
let Storage = (function() {
    var instance = null;
    return function() {
        if (!instance) {
            instance = new BaseStorage();
        }
        return instance;
    }
})()

function BaseStorage() {};
BaseStorage.prototype.setItem = function(key, value) {
    return localStorage.setItem(key, value);
}
BaseStorage.prototype.getItem = function(key) {
    return localStorage.getItem(key);
}