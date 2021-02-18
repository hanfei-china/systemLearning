import Module from '../Module';
import Attribute from "../Attribute";

/**
 * 在线捐赠列表
 */
export default class OnlineDonationList extends Module{

    constructor(config){
        super('onlineDonationList');

        let title, titleColor, titleIcon, titleIconPosition, funcType, dataMaxCount;

        title = new Attribute('textAttr','捐赠项目列表')
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


        funcType = new Attribute('funcTypeAttr', 20)
            .addAttributes({
                title: '模块支持功能选择',
                supportFuncType: [20],
            }).openRequired(() => {
                return true;
            });


        dataMaxCount = new Attribute('numberAttr', 4)
            .addAttributes({
                title: '项目最大查询数量',
                min: 2,
                max: 10
            }).setShowMode(()=>{
                return funcType.value == 20;
            });


        let attributes = {title, titleColor, titleIcon, titleIconPosition, funcType, dataMaxCount};

        this.setAttributes(attributes);
        this.syncAttributes(config);


    }

}
