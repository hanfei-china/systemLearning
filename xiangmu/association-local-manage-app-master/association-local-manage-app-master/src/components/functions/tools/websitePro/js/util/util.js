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

import {hostName,requestBaseUrl} from "../../../../../../js/config/serviceConfig";

const download = requestBaseUrl + '/api/common/content/anon/download/';


export const fontSizes = [10, 12, 14, 16, 18, 20, 24, 36, 48];

export function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj));
}


export function commonLink(router,attributes,design = false){

    if(design){
        return 'javascript:;';
    }

    let {linkType,linkUrl,pagePath,pageParamType,contentId,classId,labelId} = attributes;

    if(linkType === 2 && pagePath){
        if(pageParamType === 0){
            return router.resolve({path:`/page/${pagePath}`}).href;
        }

        if(pageParamType === 1){
           return router.resolve({path:`/page/${pagePath}?contentId=${contentId}`}).href;
        }

        if(pageParamType === 2){
            return  router.resolve({path:`/page/${pagePath}?classId=${classId}${labelId ? `&labelId=${labelId}`:''}`}).href;
        }
    }

    if(linkType === 1 && linkUrl){
        return linkUrl;
    }

    return 'javascript:;';

}

export function moreLink(router,attributes,classId,labelId,design = false){

    if(design){
        return 'javascript:;';
    }

    let {linkType,linkUrl,pagePath} = attributes;

    if(linkType === 2 && pagePath && classId){
        return  router.resolve({path:`/page/${pagePath}?classId=${classId}${labelId ? `&labelId=${labelId}`:''}`}).href;
    }

    if(linkType === 1 && linkUrl){
        return linkUrl;
    }

    return 'javascript:;';

}

export function articleClick(router,attributes,content,design = false,menuId){

    if(design){
        return 'javascript:;';
    }

    let {id,contentType,linkAddress,otherId} = content;

    if(contentType === 1){
        //外部链接
        return linkAddress;
    }

    if(contentType === 2){
        //其他内容
        return router.resolve({path:`/page/${otherId}?contentId=${id}`}).href;
    }

    if(contentType === 3){
        //活动
        return `${hostName}events/${otherId}`;
    }

    if(contentType === 5){
        return download + id;
    }

    let {linkType,linkUrl,pagePath} = attributes;

    if([0,4,6,7].indexOf(contentType) > -1 && pagePath){
        return router.resolve({path:`/page/${pagePath}?contentId=${id}${menuId ? `&menuId=${menuId}` :''}`}).href;
    }

    if(linkType === 1 && linkUrl){
        return linkUrl;
    }

    return 'javascript:;';

}

export function contentClick(router,content,design = false){

    if(design){
        return 'javascript:;';
    }

    let {id,contentType,linkAddress,otherId} = content;

    if(contentType === 1){
        //外部链接
        return linkAddress;
    }

    if(contentType === 2){
        //其他内容
        return router.resolve({path:`/page/${otherId}?contentId=${id}`}).href;
    }

    if(contentType === 3){
        //活动
        return `${hostName}events/${otherId}`;
    }

    if(contentType === 5){
        return download + id;
    }


    return 'javascript:;';

}
