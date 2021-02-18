import Module from '../Module';
import Attribute from "../Attribute";

export default class PublicArticleList extends Module{

    constructor(config){
        super('publicArticleList');

        let title, titleColor, titleIcon, titleIconPosition, dataMaxCount;

        title = new Attribute('textAttr','公众号文章列表')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，10字以内',
                maxLength: 10,
            });

        titleColor = new Attribute('colorAttr', '#EC0D42')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });

        titleIcon = new Attribute('imageAttr', '')
            .addAttributes({
                title: '标题图标',
                width: 30,
                height: 30,
                maxSize: 25 * 1024,
                imageStore: null,
                showClear: true,
                isContain: true
            });

        titleIconPosition = new Attribute('selectAttr', 'left')
            .addAttributes({
                title: '标题图标位置',
                items: [
                    {value:'left', title: '标题左侧'},
                    {value:'right', title: '标题右侧'}
                ],
            }).openRequired(() => {
                return true;
            });

        dataMaxCount = new Attribute('numberAttr', 4)
            .addAttributes({
                title: '内容最大查询数量',
                min: 1,
                max: 20
            }).openRequired(() => {
                return true;
            });


        let attributes = {title, titleColor, titleIcon, titleIconPosition,dataMaxCount};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
