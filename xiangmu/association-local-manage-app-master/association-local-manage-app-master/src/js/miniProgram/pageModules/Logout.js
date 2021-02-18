import Module from '../Module';
import Attribute from "../Attribute";

/**
 * 退出登录
 */
export default class Logout extends Module{

    constructor(config){
        super('logout');

        let title, color, backgroundColor;

        title = new Attribute('textAttr','退出登录')
            .addAttributes({
                title: '按钮名称',
                placeholder: '请输入按钮名称，10字以内',
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

        backgroundColor = new Attribute('colorAttr', '#264CBF')
            .addAttributes({
                title: ' 背景色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });


        let attributes = {title, color, backgroundColor};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }


}