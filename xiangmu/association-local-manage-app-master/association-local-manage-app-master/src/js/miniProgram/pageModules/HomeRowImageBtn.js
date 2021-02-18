import Module from '../Module';
import Attribute from "../Attribute";
import {ROW_IMAGE_BTN} from '../../config/defaultImages';

/**
 * 行列按钮
 */
export default class HomeRowImageBtn extends Module {

    constructor(config) {
        super('homeRowImageBtn');

        let title, titleColor, describe, describeColor, image, funcType, appId, listStyle, memberQueryBuilders, privilege,
            contentClass, counselClass, content, onlineForm, pagePath, informationExchangeType;

        title = new Attribute('textAttr','图片按钮')
            .addAttributes({
                title: '模块标题',
                placeholder: '请输入模块标题，10字以内',
                maxLength: 10,
            });

        titleColor = new Attribute('colorAttr', '#FFFFFF')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });

        describe = new Attribute('textareaAttr','模块描述')
            .addAttributes({
                title: '模块功能描述',
                placeholder: '请输入模块功能描述，50字以内',
                maxLength: 50,
            });

        describeColor = new Attribute('colorAttr', '#FFFFFF')
            .addAttributes({
                title: '功能描述字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });

        image = new Attribute('imageAttr', ROW_IMAGE_BTN)
            .addAttributes({
                title: '按钮背景图',
                width: 280,
                height: 131,
                maxSize: 500*1024,
                imageStore: null,
            }).openRequired(() => {
                if (!image.value || image.value === '') {
                    throw new Error('请上传按钮背景图');
                } else {
                    return true;
                }
            });

        funcType = new Attribute('funcTypeAttr', 0)
            .addAttributes({
                title: '按钮功能选择',
                supportFuncType: [0, 1, 2, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
            }).openRequired(() => {
                return true;
            });

        appId = new Attribute('textAttr','')
            .addAttributes({
                title: '小程序AppID',
                placeholder: '请输入小程序AppID'
            }).setShowMode(()=>{
                return funcType.value === 34;
            });

        listStyle =  new Attribute('selectAttr', 0)
            .addAttributes({
                title: '列表样式',
                items: [
                    {value: 0, title: '大图列表'},
                    {value: 1, title: '小图列表'}
                ],
            }).setShowMode(() => {
                return funcType.value === 0;
            });

        contentClass = new Attribute('contentClassAttr', '', false)
            .addAttributes({
                title: '内容分类选择',
                showClear: true
            }).setShowMode(() => {
                return funcType.value === 0;
            }).openRequired(() => {
                if(funcType.value === 0 && (!contentClass.value || contentClass.value === '')){
                    throw new Error('请选择内容分类');
                }
                return true;
            });

        counselClass = new Attribute('counselClassAttr', '', false)
            .addAttributes({
                title: '咨询分类选择',
                showClear: true
            }).setShowMode(() => {
                return funcType.value === 25;
            }).openRequired(() => {
                if (funcType.value === 25 && (!contentClass.value || contentClass.value === '')) {
                    throw new Error('请选择咨询分类');
                }
                return true;
            });

        content = new Attribute('contentAttr', '', false)
            .addAttributes({
                title: '内容选择',
                showClear: true
            }).setShowMode(() => {
                return funcType.value === 2;
            }).openRequired(() => {
                if(funcType.value === 2 && (!content.value || content.value === '')){
                    throw new Error('请选择内容');
                }
                return true;
            });

        memberQueryBuilders = new Attribute('memberQueryBuilderAttr', {tabItems:[]}, false)
            .addAttributes({
                title: '通讯录页签管理',
                showClear: true
            }).setShowMode(() => {
                return funcType.value === 8;
            });

        onlineForm = new Attribute('onlineFormAttr', '', false)
            .addAttributes({
                title: '在线表单选择',
                showClear: true
            }).setShowMode(() => {
                return funcType.value === 17 || funcType.value === 18;
            }).openRequired(() => {
                if((funcType.value === 17 || funcType.value === 18) && (!content.value || content.value === '')){
                    throw new Error('请选择在线表单');
                }
                return true;
            });

        pagePath = new Attribute('mpPageChooseAttr', '')
            .addAttributes({
                title: '菜单跳转页面选择',
                placeholder: '请选择菜单跳转的页面'
            }).setShowMode(() => {
                return funcType.value === 26;
            }).openRequired(() => {
                if(funcType.value === 26 && !pagePath.value){
                    throw new Error('请选择按钮跳转的页面');
                }
                return true;
            });

        informationExchangeType = new Attribute('commonGroupAttr',null)
            .addAttributes({
                title: '信息交换分类选择',
                maxLevel: 1,
                groupType: '4',
                typeName: '分类',
            }).setShowMode(() => {
                return funcType.value === 7;
            });

        privilege = new Attribute('privilegeAttr', {
            open: false,
            onlyForMember: false,
            memberType:{
                memberRange: 'all',
                memberTypes: [],
                blacklist: []
            }
        }).addAttributes({
            title: '按钮权限设置'
        });


        let attributes = {title, titleColor, describe, describeColor, image, memberQueryBuilders,
            funcType, appId, listStyle, contentClass, counselClass, content, onlineForm, informationExchangeType, pagePath,  privilege};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
