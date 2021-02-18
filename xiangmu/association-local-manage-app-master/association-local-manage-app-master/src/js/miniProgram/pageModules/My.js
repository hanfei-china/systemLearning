import Module from '../Module';
import Attribute from "../Attribute";

/**
 * 我的模块
 */
export default class My extends Module{

    constructor(config){
        super('my');

        let title, color, backgroundStyle, backgroundImage, backgroundColor;

        title = new Attribute('textAttr','我的')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，10字以内',
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
                return backgroundStyle.value == 1;
            });

        backgroundImage = new Attribute('imageAttr', '')
            .addAttributes({
                title: '背景图',
                width: 280,
                height: 112,
                maxSize: 500*1024,
                imageStore: null,
            }).openRequired(() => {
                if(backgroundStyle.value == 0 && (!backgroundImage.value || backgroundImage.value == '')){
                    throw new Error('请上传背景图');
                }else{
                    return true;
                }
            }).setShowMode(()=>{
                return backgroundStyle.value == 0;
            });


        let attributes = {title, color, backgroundStyle, backgroundImage, backgroundColor};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }
}
