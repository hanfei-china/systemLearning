let onLoad = async function(options) {
        // console.log(options);
        if (options.togetherShareId) {
            this.setData({
                    isTogether: 1,
                    togetherId: options.togetherShareId,
                    donatetype: '2'
                })
                //这里使用await的目的是保证下面使用团体信息的时候，这个请求已经完成，不会造成误判
            await this.getDonationTogetherDetail(options.togetherShareId);
            this.inputDonationName();
        }
        //如果是团体捐赠，且捐赠金额有限制，那么这个就不展示了
        if (options.togetherShareId && this.data.togetherInfo.limitAmountType) {
            this.setData({
                dontatemoney: this.data.togetherInfo.limitAmount,
                amount: this.data.togetherInfo.limitAmount,
            })
        } else {
            this.getPrepaymentInfo();
        }
    },
    //获取一起捐的信息
    function getDonationTogetherDetail(id) {
        let param = {
            togetherId: id
        }
        return new Promise(resolve => {
            GET(app.globalData.apiUrl + url.GETDONATIONTOGETHERDETAIL, param, true).then(res => {
                if (res.success) {
                    this.setData({
                        togetherInfo: res.data,
                    })
                    resolve();
                }
            })
        })
    }


//async其实就是把后面的代码放入到await返回的promise的then方法中了。从而将其放入了事件流的异步事件的微任务中。实现了异步代码同步话


//这种方法的话就是错误的
function getDonationTogetherDetail2(id) {
    let param = {
        togetherId: id
    }
    GET(app.globalData.apiUrl + url.GETDONATIONTOGETHERDETAIL, param, true).then(res => {
        if (res.success) {
            this.setData({
                togetherInfo: res.data,
            })
            return new Promise(resolve => {
                resolve();
            })
        }

    })
}

//下面这种就不行，因为在中心函数的时候，首先就遇到了异步任务，所以会跨国这个异步任务去执行同步任务。即便有await在前面也没啥用了。