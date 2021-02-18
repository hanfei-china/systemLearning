import axios from 'axios';
import Qs from 'qs';
import Vue from 'vue';

import { requestBaseUrl } from "./serviceConfig";
import router from '../router';

var loading = null;
let instance = axios.create({
    baseURL: requestBaseUrl,
    timeout: 100000, // 请求时间超过10秒视为超时
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
    }
});

let rejectError = (data) => {
    Vue.prototype.$message.closeAll();
    Vue.prototype.$message({
        message: data.msg || '操作失败',
        type: 'error',
        duration: 1500
    });
    return Promise.reject(data.msg);
};

instance.interceptors.request.use(config => {
    // NProgress.start();
    // if(config.method === 'get'){
    //     config.params = {
    //         ...config.params,
    //         t: Date.parse(new Date()) / 1000
    //     }
    // }
    if (config.newHeader) {
        config.headers = config.newHeader
    }
    if (config.serialize) {
        config.data = Qs.stringify(config.data, { indices: false });
    }
    // ie下loading不消失bug
    if (config.noLoading || (!!window.MSInputMethodContext && !!document.documentMode)) {
        loading = null
    } else {
        //   loading = Vue.prototype.openLoading();
    }
    return config;
}, error => {
    // NProgress.start();
    return Promise.reject(error);
});

function getParam(href, paramName) {
    let index = href.indexOf("?")

    let params = href.substr(index + 1);

    params = params.split("&"); //各个参数放到数组里
    for (let param of params) {
        let index = param.indexOf("=");
        let key = param.substring(0, index);
        let value = param.substr(index + 1);
        if (paramName === key) {
            return value;
        }
    }

    return false;
}

instance.interceptors.response.use((response) => {
    // NProgress.done();
    // if(loading){ loading.close() }
    let { responseType } = response.config;
    if (responseType && responseType === 'blob') {
        return response;
    } else {
        let data = response.data;
        let { code, success, data: resData } = data;
        if (code === 302) {
            //cas重定向状态
            let index = resData.indexOf("?");
            let service = decodeURIComponent(getParam(resData, 'service'));
            let join = service.indexOf("?") > 0 ? "&" : "?";

            let { origin, pathname } = window.location;
            let href = origin + pathname + '#/console';
            service += join + 'client=' + encodeURIComponent(href);
            window.location.href = resData.substring(0, index) + '?service=' + encodeURIComponent(service);
            return;
        }

        if (code === 506) {
            return Promise.reject(data);
        }

        if (!data || !success) {
            return rejectError(data);
        }
    }
    // Vue.prototype.$message.closeAll();
    return response.data;

}, error => {
    // NProgress.done();
    let config = error.config;

    let path = config.url;
    if (path.indexOf('/api/admin/account/loginCheck') > -1) {
        return Promise.reject('未登录');
    }

    let { status } = error.response;
    if (status === 401) {
        //未登录状态
        rejectError({
            msg: '无权限的请求，需重新登录'
        }).catch(() => {
            router.push('/login');
        });
        return;
    }
    return rejectError(error.response.data);
});

export default instance;