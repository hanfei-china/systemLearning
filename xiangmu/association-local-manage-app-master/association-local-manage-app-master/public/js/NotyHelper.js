/*消息提示
*Depend on jquery.noty.packaged.js
*@text 消息内容
*@type 类型（包括alert、warning、error、information、success），默认为information
*@jNotyBottom 添加原因：录入和建模tab页签不方便操作，进行移位显示
*/
window.jNotyBottom = 0;
window.jNoty = function (text, type) {
    $.noty.closeAll();
    var options = {
        text: text,
        layout: "bottomCenter",
        type: type || "information"
    };
    var theNoty = window.noty(options);
    var theBar = theNoty.$bar, closeFun = function() {
        theNoty.close();
    }, theUl = theBar.parent("ul");
    window.jNotyBottom !== 0 && theUl.css("bottom", window.jNotyBottom);
    var thisTime = window.setTimeout(closeFun, 3000), thatTime;
    theBar.on("mouseover", function () {
        window.clearTimeout(thisTime);
        thatTime && window.clearTimeout(thatTime);
    }).on("mouseleave", function() {
        thatTime = window.setTimeout(closeFun, 500);
    });
    return theNoty;
};
/*根据id获取历史消息
*@id 可选，如果不传，则获取最近一条历史消息
*/
$.getjNoty = function (id) {
    if (id)
        return $.noty.get(id);
    else {
        var noty = null;
        $.each($.noty.store, function (i, s) {
            noty = s;
        });
        return noty;
    }
};
/*
*获取所有历史消息
*/
$.getjNoties = function() {
    return $.noty.store;
};