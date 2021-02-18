/*
    说明：
    1.除了直接加载的工具方法，还可以通过extendManager添加其他扩展；
    2.添加其他扩展前请在extendManager中的dependentFiles配置好资源路径，然后在tools中添加相应的代理接口；
    3.还有不明白的就问scq。
*/
(function ($) {
    var extendManager = (function () {
        var dependentFiles = {
            loading: ["https://event.huiyixing.com/Areas/Event/Content/lib/loading/loading.css", "https://event.huiyixing.com/Areas/Event/Content/lib/loading/loading.js"],
            jNoty: ["/Content/base/js/jquery.noty.packaged.me.js", "/Content/base/js/NotyHelper.js"],
            slideInOrderDetail: ["https://event.huiyixing.com/Areas/Event/Content/lib/slideIn/slideIn.css", "https://event.huiyixing.com/Areas/Event/Content/lib/slideIn/slideInOrderDetail.css", "https://event.huiyixing.com/Areas/Event/Content/lib/slideIn/slideIn.js", "https://event.huiyixing.com/Areas/Event/Content/lib/slideIn/slideInOrderDetail.js"],
            confirm: ["https://event.huiyixing.com/Areas/Event/Content/lib/confirm/confirm.css", "https://event.huiyixing.com/Areas/Event/Content/lib/confirm/confirm.js"],
            fileUploader: ["/Content/base/css/fileUploader.css", "/Content/base/js/jquery.form.js", "/Content/base/js/fileUploader.js"],
            flowOfPath: ["https://event.huiyixing.com/Areas/Event/Content/lib/flow/flow.css", "https://event.huiyixing.com/Areas/Event/Content/lib/flow/flowOfPath.css", "https://event.huiyixing.com/Areas/Event/Content/lib/flow/flow.js", "https://event.huiyixing.com/Areas/Event/Content/lib/flow/flowOfPath.js"],
            alt: ["https://event.huiyixing.com/Areas/Event/Content/lib/alt/alt.css", "https://event.huiyixing.com/Areas/Event/Content/lib/alt/alt.js"],
            popwin: ["https://event.huiyixing.com/Areas/Event/Content/lib/popwin/popwin.css", "https://event.huiyixing.com/Areas/Event/Content/lib/popwin/popwin.js"],
            redPacketRain: ["https://event.huiyixing.com/Areas/Screen/Content/widgets/redPacketRain/redPacketRain.css", "https://event.huiyixing.com/Areas/Screen/Content/widgets/redPacketRain/redPacketRain.js"]
        };
        var todoList = [], isExcuting = false;

        function excute() {
            if (todoList.length == 0) {
                isExcuting = false;
                return;
            }
            var param = todoList.shift();

            if (param.aimedObj) {
                param.callBack();
                excute();
            } else if (dependentFiles[param.name]) {
                var files = dependentFiles[param.name].map(function (item) {
                    // return tools.origin + item;
                    return item;
                });
                tools.loadFile(files, function () {
                    param.callBack();
                    excute();
                });
            } else {
                excute();
            }
        }

        return {
            tryDo: function (name, aimedObj, callBack) {
                var param = { name: name, aimedObj: aimedObj, callBack: callBack };
                todoList.push(param);
                if (!isExcuting) {
                    isExcuting = true;
                    excute();
                }
            },
            extend: function (data) {
                $.extend(dependentFiles, data);
            }
        };
    })();

    window.tools = window.tools || {
        /*---------------------------------当前服务地址的根，如http://www.97jgg.com---------------------------------*/
        origin: location.origin || location.protocol + "//" + location.host,
        /*---------------------------------创建元素---------------------------------*/
        createElement: function (option) {
            var eTag = option.tag, attr = option.attr, parent = option.parent, prepend = option.prepend, innerHtml = option.innerHtml, events = option.events;
            var e = document.createElement(eTag);
            var key;
            if (attr) {
                for (key in attr) {
                    e.setAttribute(key, attr[key]);
                }
            }
            if (parent) {
                if (!parent.append) {
                    parent = $(parent);
                }
                if (prepend) {
                    parent.prepend(e);
                } else {
                    parent.append(e);
                }
            }
            if (innerHtml != undefined) {
                e.innerHTML = innerHtml;
            }
            if (events) {
                for (key in events) {
                    $(e).on(key, events[key]);
                }
            }
            return e;
        },
        /*---------------------------------生成Id---------------------------------*/
        generateId: (function () {
            var baseNameToIndexDic = {};
            return function (baseName) {
                var index = baseNameToIndexDic[baseName];
                if (index == undefined) {
                    index = baseNameToIndexDic[baseName] = 0;
                }
                var id = baseName + index;
                baseNameToIndexDic[baseName]++;
                if (document.getElementById(id)) {
                    return arguments.callee(baseName);
                }
                return id;
            };
        })(),
        /*---------------------------------加载资源文件---------------------------------*/
        loadFile: (function () {
            var files = [];
            return function (paths, callback) {
                if (paths == undefined || paths.length == 0) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                var path = paths.shift(),
                    me = arguments.callee;
                var f = files.find(function (e) {
                    return e == path;
                });
                if (f) {
                    me(paths, callback);
                    return;
                }
                var indexOfDot = path.lastIndexOf(".");
                var extendName = path.substr(indexOfDot + 1);
                var elementObj;
                if (extendName == "js") {
                    elementObj = document.createElement("script");
                    elementObj.src = path;
                } else if (extendName == "css") {
                    elementObj = document.createElement("link");
                    elementObj.rel = "stylesheet";
                    elementObj.href = path;
                } else {
                    elementObj = document.createElement("div");
                    elementObj.setAttribute("data-url", path);
                }
                elementObj.onload = function () {
                    files.push(path);
                    me(paths, callback);
                };
                document.head.appendChild(elementObj);
            };
        })(),
        extend: function (opt) {
            extendManager.extend(opt.data);
            var dls = opt.delegate;
            for (var key in dls) {
                this[key] = function (callback, data) {
                    dls[key](extendManager, callback, data);
                };
            }
        },
        /*---------------------------------以下是各种扩展---------------------------------*/
        /*---------------------------------加载中画面---------------------------------*/
        loading: {
            show: function () {
                var thisArgs = arguments;
                extendManager.tryDo("loading", window.loading, function () {
                    window.loading.show.apply(null, thisArgs);
                });
            },
            hide: function () {
                var thisArgs = arguments;
                extendManager.tryDo("loading", window.loading, function () {
                    window.loading.hide.apply(null, thisArgs);
                });
            }
        },
        /*---------------------------------确认提示框---------------------------------*/
        confirm: function () {
            //简单示例
            //window.tools.confirm("标题","描述",function(r){//回调函数});
            //更高深的用法见"\src\server\速速报\JoinCheer.JCP.SSB\Areas\Event\Content\lib\confirm\confirm.js"里的说明
            var thisArgs = arguments;
            extendManager.tryDo("confirm", window.jggConfirm, function () {
                window.jggConfirm.apply(null, thisArgs);
            });
        },
        /*---------------------------------普通提示框---------------------------------*/
        jNoty: function () {
            var thisArgs = arguments;
            extendManager.tryDo("jNoty", window.jNoty, function () {
                window.jNoty.apply(null, thisArgs);
            });
        },
        /*---------------------------------文件上传---------------------------------*/
        getFileUploader: function (callback) {
            extendManager.tryDo("fileUploader", window.fileUploader, function () {
                callback(window.fileUploader);
            });
        },
        /*---------------------------------订单详情侧边栏---------------------------------*/
        getSlideInOrderDetail: function (callback, opt) {
            extendManager.tryDo("slideInOrderDetail", window.SlideInOrderDetail, function () {
                var obj = new window.SlideInOrderDetail(opt);
                callback(obj);
            });
        },
        /*---------------------------------行程展示---------------------------------*/
        getFlowOfPath: function (callback, opt) {
            extendManager.tryDo("flowOfPath", window.FlowOfPath, function () {
                var obj = new window.FlowOfPath(opt);
                callback(obj);
            });
        },
        /*---------------------------------设置提示信息---------------------------------*/
        setAlt: function () {
            var thisArgs = arguments;
            extendManager.tryDo("alt", window.alt, function () {
                window.alt.set.apply(null, thisArgs);
            });
        },
        /*---------------------------------弹窗---------------------------------*/
        getPopwin: function (callback, opt) {
            extendManager.tryDo("popwin", window.Popwin, function () {
                var obj = new window.Popwin(opt);
                callback(obj);
            });
        },
        getRedPacketRain: function (callback, opt) {
            extendManager.tryDo("redPacketRain", window.RedPacketRain, function () {
                var obj = window.RedPacketRain.init(opt);
                callback(obj);
            });
        },
    };
})(jQuery);

////你运行的时候就把下面的示例代码注释了
////资源扩展示例
//var sourceFiles = {
//    abc: ["abc.js"]
//};
//window.tools.extend({
//    data: sourceFiles,
//    delegate: {
//        abc: function (extMgr, callback, data) {
//            extMgr.tryDo("abc", window.abc, function () {
//                window.abc.apply(null, data);
//            });
//        },
//        getAbc: function (extMgr, callback) {
//            extMgr.tryDo("abc", window.abc, function () {
//                callback(window.abc);
//            });
//        }
//    }
//});
////扩展示例结束

////资源使用示例
//window.tools.abc(null, 123);//这个地方的callback没用，传空就行
//window.tools.getAbc(function(o) {
//    //o就是abc对象了
//});
////使用示例结束
