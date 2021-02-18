export const fonts = [
    {name: '宋体,Simsun,STSong', title: '宋体'},
    {name: '新细明体,PMingLiu', title: '新细明体'},
    {name: '仿宋_GB2312,FangSong_GB2312,FangSong', title: '仿宋_GB2312'},
    {name: '微软雅黑,Microsoft YaHei', title: '微软雅黑'},
    {name: 'Arial,微软雅黑', title: 'Arial'},
    {name: '隶书,SimLi,LiSu,STLiti', title: '隶书'},
    {name: '幼圆,YouYuan', title: '幼圆'},
    {name: '华文楷体,STKaiti', title: '华文楷体'},
    {name: '方正舒体,FZShuTi', title: '方正舒体'},
    {name: '华文行楷,STXingkai', title: '华文行楷'},
    {name: '华文彩云,STCaiyun', title: '华文彩云'},
    {name: '华文宋体,STSong', title: '华文宋体'},
    {name: '楷体,楷体_GB2312,SimKai,KaiTi', title: '楷体'},
    {name: '黑体,SimHei,STHeiti', title: '黑体'},
    {name: 'Tahoma,微软雅黑', title: 'Tahoma'},
    {name: 'impact,微软雅黑', title: 'impact'},
    {name: 'Arial Serif,微软雅黑', title: 'Arial Serif'},
    {name: 'Times New Roman,微软雅黑', title: 'Times New Roman'},
    {name: 'Georgia,微软雅黑', title: 'Georgia'},
    {name: 'Garamond,微软雅黑', title: 'Garamond'},
    {name: 'andale mono,微软雅黑', title: 'andale mono'},
    {name: 'arial black,微软雅黑', title: 'arial black'},
    {name: 'comic sans ms,微软雅黑', title: 'comic sans ms'},
];


export const fontSizes = [10, 12, 14, 16, 18, 20, 24, 36, 48];

//时间格式化函数
export function formatDate(dateObj, format) {
    let o = {
        "M+": dateObj.getMonth() + 1,
        "d+": dateObj.getDate(),
        "h+": dateObj.getHours() % 12 == 0 ? 12 : dateObj.getHours() % 12,
        "H+": dateObj.getHours(),
        "m+": dateObj.getMinutes(),
        "s+": dateObj.getSeconds(),
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),
        "S": dateObj.getMilliseconds()
    };
    let week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[dateObj.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}

export function openLink(router,attributes){

    let {target,linkType,linkUrl,pagePath,linkParams} = attributes;

    if(linkType === 2 && pagePath){
        window.open(router.resolve({path:`/page/${pagePath}?${linkParams}`}).href, target);
    }

    if(linkType === 1 && linkUrl){
        window.open(linkUrl, target);
    }

}

export function menuOpenLink(router,attributes){

    let {target,linkType,linkUrl,pagePath,pageParamType,contentId,classId,labelId} = attributes;

    if(linkType === 2 && pagePath){
        if(pageParamType === 0){
            window.open(router.resolve({path:`/page/${pagePath}`}).href, target);
        }

        if(pageParamType === 1){
            window.open(router.resolve({path:`/page/${pagePath}?contentId=${contentId}`}).href, target);
        }

        if(pageParamType === 2){
            window.open(router.resolve({path:`/page/${pagePath}?classId=${classId}&labelId=${labelId}`}).href, target);
        }
    }

    if(linkType === 1 && linkUrl){
        window.open(linkUrl, target);
    }

}

