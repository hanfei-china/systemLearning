/*--------------------------消息机制---------------------------*/
window._listeners = {};
window.addListener = function (type, fnc, scope) {
    //添加监听

    var lis = window._listeners[type];
    if (!lis) {
        lis = [];
        window._listeners[type] = lis;
    }
    lis.push({ scope: scope, fnc: fnc });
};

window.removeListener = function (type, fnc, scope) {
    //卸载监听,fcn,scope都可省略
    var lis = window._listeners[type];
    if (lis) {
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            if (!fnc || (fnc == li.fnc && (!scope || scope == li.scope))) {
                lis.splice(i, 1);
                i--;
            }
        }
        if (lis.length == 0) {
            delete window._listeners[type];
        }
    }
};

window.sendMessage = function (type, msg, sender) {
    //发送消息

    window._sendMessage(type, msg, sender);
};

window._sendMessage = function (type, msg, sender) {
    //发送消息

    var lis = window._listeners[type];
    if (lis) {
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            //if ((li.scope && li.scope == sender) || !li.scope) {
            var r = li.fnc.call(li.scope, sender, msg);
            if (r !== undefined && r === false) {
                return false;
            }
            //}
        }
    }

    return true;
};