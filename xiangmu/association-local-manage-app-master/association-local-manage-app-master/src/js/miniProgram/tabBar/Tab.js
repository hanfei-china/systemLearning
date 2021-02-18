import Module from '../Module';
import Attribute from '../Attribute';
import {isEmptyStr} from '../../util/nullValueCheck';

export default class Tab extends Module{

    constructor(config){
        super('tab');

        let text, iconPath, selectedIconPath,pageType, pagePath, appId, localPagePath, funcType, title, titleColor, titleBackgroundColor;

        let requiredCheck = () => {
            if(isEmptyStr(text.value)){
                if(isEmptyStr(iconPath.value) && isEmptyStr(selectedIconPath.value)){
                    throw new Error('请上传图标或设置菜单项名称')
                }
            }

            if(isEmptyStr(iconPath.value) && !isEmptyStr(selectedIconPath.value)){
                throw new Error('请上传默认图标')
            }

            if(!isEmptyStr(iconPath.value) && isEmptyStr(selectedIconPath.value)){
                throw new Error('请上传选中图标')
            }

            return true;
        }

        text = new Attribute('textAttr','菜单项')
            .addAttributes({
                title: '菜单项名称',
                placeholder: '请输入菜单项名称',
                maxLength: 10,
            }).openRequired(requiredCheck);

        iconPath = new Attribute('imageAttr','')
            .addAttributes({
                title: '默认图标',
                width: 40,
                height: 40,
                maxSize: 60*1024,
                imageStore: null,
                showClear: true
            }).openRequired(requiredCheck);

        selectedIconPath = new Attribute('imageAttr','')
            .addAttributes({
                title: '选中图标',
                width: 40,
                height: 40,
                maxSize: 60*1024,
                imageStore: null,
                showClear: true
            }).openRequired(requiredCheck);

        pageType = new Attribute('selectAttr', 'design')
            .addAttributes({
                title: '菜单绑定页面类型',
                items: [
                    {value:'design', title: '自定义页面'},
                    {value:'local', title: '小程序内置页面'},
                    {value:'func', title: '功能页面'},
                    {value:'miniprogram', title: '打开另一个小程序'}
                ],
            });

        appId = new Attribute('textAttr','')
            .addAttributes({
                title: '小程序AppID',
                placeholder: '请输入小程序AppID'
            }).setShowMode(()=>{
                return pageType.value === 'miniprogram';
            });

        pagePath = new Attribute('mpPageChooseAttr', '')
            .addAttributes({
                title: '自定义页面',
                placeholder: '请选择菜单跳转的页面'
            }).openRequired(()=>{
                if(!pagePath.value || pagePath.value === ''){
                    throw new Error('请选择菜单跳转的页面');
                }

                return true;
            }).setShowMode(()=>{
                return pageType.value === 'design';
            });
        funcType = new Attribute('funcTypeAttr', 0)
            .addAttributes({
                title: '功能页选择',
                supportFuncType: [0, 1, 2, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,36,37,38],
            }).setShowMode(() => {
                return pageType.value === 'func';
            });

        localPagePath = new Attribute('selectAttr', 1)
            .addAttributes({
                title: '小程序内置页面',
                items: [
                    {value: 1, title: '组织列表'}
                ],
            }).setShowMode(()=>{
                return pageType.value === 'local';
            });

        title = new Attribute('textAttr','页面')
            .addAttributes({
                title: '页面标题',
                placeholder: '请输入页面标题',
                maxLength: 10,
            }).setShowMode(()=>{
                return pageType.value === 'local';
            });

        titleColor = new Attribute('selectAttr', '#ffffff')
            .addAttributes({
                title: '标题颜色',
                items: [
                    {value:'#000000', title: '黑色'},
                    {value:'#ffffff', title: '白色'}
                ],
            }).openRequired(() => {
                return true;
            }).setShowMode(()=>{
                return pageType.value === 'local';
            });

        titleBackgroundColor = new Attribute('colorAttr', '#1c7ccf')
            .addAttributes({
                title: '标题背景色',
                showAlpha: false,
                showClear: false,
                showPick: false,
                predefine: []
            }).openRequired(() =>{
                return true;
            }).setShowMode(()=>{
                return pageType.value === 'local';
            });

        let attributes = { text, iconPath, selectedIconPath, pageType, pagePath, appId,
            localPagePath, funcType, title, titleColor, titleBackgroundColor};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
