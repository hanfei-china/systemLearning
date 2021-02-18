import Module from '../Module';
import Attribute from "../Attribute";
import moduleBuilder from '../moduleBuilder';
import {addItem, deleteItem} from '../../util/arrayUtil';

/**
 * 行列按钮容器
 */
export default class HomeBtnArea extends Module {

    constructor(config) {
        super('homeBtnArea');

        let isShowTitle, title, titleColor, titleIcon, titleIconPosition;

        isShowTitle = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '标题显示设置',
                content: '显示标题'
            }).openRequired(() => {
                return true;
            });

        title = new Attribute('textAttr','块状按钮')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，15字以内',
                maxLength: 15,
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

        let attributes = {isShowTitle, title, titleColor, titleIcon, titleIconPosition};

        this.setAttributes(attributes);
        config = this.syncAttributes(config);
        this.children = [];
        if(config && config.children && config.children.length > 0){
            this.loadButtons(config.children);
        }else{
            this.addButton();
        }
    }

    /**
     * 加载已有按钮
     * @param children
     */
    loadButtons(children){
        for(let button of children){
            this.addButton(button);
        }

    }

    /**
     * 新增按钮
     * @param moduleConfig
     */
    addButton(moduleConfig){
        addItem(moduleBuilder('homeAreaBtn',moduleConfig), this.children);
    }

    /**
     * 删除目标位置的按钮
     * @param targetIndex
     */
    deleteButton(targetIndex){
        deleteItem(targetIndex, this.children);
    }
}
