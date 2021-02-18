import Module from '../Module';
import Attribute from '../Attribute';

/**
 * 头部logo区域
 */
export default class TopLogoArea extends Module{

    constructor(config){
        super('topLogoArea');

        let title, logoSrc, logoMaxHeight, backgroundSrc, height;
        title = new Attribute('textAttr','头部logo')
            .addAttributes({
                title: '功能名称',
                placeholder: '请输入功能名称',
                maxLength: 10,
            });

        logoSrc = new Attribute('imageAttr','')
            .addAttributes({
                title: '小程序logo',
                width: 80,
                height: 80,
                maxSize: 200*1024,
                imageStore: null,
                showClear: true
            });

        logoMaxHeight = new Attribute('numberAttr',24).addAttributes({
            title: 'logo最大高度',
            max: Infinity,
            min: 0
        });

        backgroundSrc = new Attribute('imageAttr','')
            .addAttributes({
                title: '容器背景',
                width: 270,
                height: 80,
                maxSize: 200*1024,
                imageStore: null,
                showClear: true
            });

        height = new Attribute('numberAttr',40).addAttributes({
            title: '容器高度',
            max: Infinity
        });


        let attributes = {title, logoSrc, logoMaxHeight, backgroundSrc,height};

        this.setAttributes(attributes);
        this.syncAttributes(config);

    }

}
