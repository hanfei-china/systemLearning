function Promises(excutor) {
    this.callbacks = [];

    function resolve(value) {
        setTimeout(() => {
        this.data = value;
        this.callbacks.forEach((callback) => callback(value));
        });
    }

    excutor(resolve.bind(this));
}

Promises.prototype.then = function (onResolved) {
    return new Promises((resolve) => {
        this.callbacks.push(() => {
        const result = onResolved(this.data);
        if (result instanceof Promises) {
            result.then(resolve);
        } else {
            resolve(result);
        }
        });
    });
};

var obj=new Promises(resolve=>{
    console.log(1);
    resolve();
});
obj.then(res=>{
    
})