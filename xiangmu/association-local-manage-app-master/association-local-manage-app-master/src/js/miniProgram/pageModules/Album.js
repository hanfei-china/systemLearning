import Module from '../Module';
import Attribute from "../Attribute";

/**
 * 相册组件
 */
export default class Album extends Module {

    constructor(config) {
        super('album');

        let isShowTitle, title, titleColor, titleIcon, titleIconPosition, albumType, dataMaxCount;

        isShowTitle = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '标题显示设置',
                content: '显示标题'
            }).openRequired(() => {
                return true;
            });

        title = new Attribute('textAttr','相册')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，10字以内',
                maxLength: 10,
            });

        titleColor = new Attribute('colorAttr', '#333333')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).setShowMode(()=>{
                return isShowTitle.value;
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
            }).setShowMode(()=>{
                return isShowTitle.value;
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

        albumType = new Attribute('albumTypeAttr', '', false)
            .addAttributes({
                title: '相册分组选择',
                showClear: true
            });

        dataMaxCount = new Attribute('numberAttr', 4)
            .addAttributes({
                title: '相册最大查询数量',
                min: 2,
                max: 10
            });

        let attributes = {isShowTitle, title, titleColor, titleIcon, titleIconPosition, albumType, dataMaxCount};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
