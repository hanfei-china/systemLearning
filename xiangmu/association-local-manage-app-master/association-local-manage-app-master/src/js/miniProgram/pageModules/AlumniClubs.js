import Module from '../Module';
import Attribute from "../Attribute";

/**
 * 社群模块
 */
export default class AlumniClubs extends Module{

    constructor(config){
        super('alumniClubs');

        let title, color, backgroundStyle, backgroundImage,
            backgroundColor, buttonName, memberQueryBuilders;

        title = new Attribute('textAttr','社群')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题',
                maxLength: 10,
            });

        color = new Attribute('colorAttr', '#FFFFFF')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });

        backgroundStyle = new Attribute('selectAttr', 1)
            .addAttributes({
                title: '背景模式选择',
                items: [
                    {value: 1, title: '纯色背景'},
                    {value: 0, title: '图片背景'}
                ],
            });

        backgroundColor = new Attribute('colorAttr', '#264CBF')
            .addAttributes({
                title: ' 背景色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).setShowMode(()=>{
                return backgroundStyle.value === 1;
            });

        backgroundImage = new Attribute('imageAttr', null)
            .addAttributes({
                title: '背景图',
                width: 280,
                height: 131,
                maxSize: 500*1024,
                imageStore: null,
            }).openRequired(() => {
                if(backgroundStyle.value === 0 && (!backgroundImage.value || backgroundImage.value === '')){
                    throw new Error('请上传背景图');
                }else{
                    return true;
                }
            }).setShowMode(()=>{
                return backgroundStyle.value === 0;
            });

        buttonName = new Attribute('textAttr','切换分会')
            .addAttributes({
                title: '社群切换按钮显示文字',
                placeholder: '请输入社群切换按钮显示文字',
                maxLength: 10,
            }).openRequired(() => {
                if(!buttonName.value || buttonName.value === ''){
                    throw new Error('请输入社群切换按钮显示文字');
                }else{
                    return true;
                }
            });

        memberQueryBuilders = new Attribute('memberQueryBuilderAttr', {tabItems:[]}, false)
            .addAttributes({
                title: '通讯录页签管理',
                showClear: true
            });


        let attributes = {title, color, backgroundStyle, backgroundImage, backgroundColor, buttonName, memberQueryBuilders};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }
}
