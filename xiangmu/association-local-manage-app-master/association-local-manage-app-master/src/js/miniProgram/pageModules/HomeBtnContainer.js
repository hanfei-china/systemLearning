import Module from '../Module';
import Attribute from "../Attribute";
import moduleBuilder from '../moduleBuilder';
import {addItem, deleteItem} from '../../util/arrayUtil';

/**
 * 行列按钮容器
 */
export default class HomeBtnContainer extends Module {

    constructor(config) {
        super('homeBtnContainer');

        let isShowTitle, title, titleColor, titleIcon, titleIconPosition, pageable, onePageRow, rowBtnCount;

        isShowTitle = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '标题显示设置',
                content: '显示标题'
            }).openRequired(() => {
                return true;
            });

        title = new Attribute('textAttr','按钮组')
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

        pageable = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '按钮分页设置',
                content: '开启分页'
            }).openRequired(()=>{
                return true;
            });

        onePageRow = new Attribute('numberAttr', 2)
            .addAttributes({
                title: '每页显示按钮行数',
                min: 1,
                max: Infinity
            }).openRequired(()=>{
                if(!onePageRow.value || onePageRow.value < 1){
                    throw new Error('请设置每页显示按钮行数');
                }else{
                    return true;
                }
            }).setShowMode(()=>{
                return pageable.value;
            });

        rowBtnCount = new Attribute('numberAttr', 4)
            .addAttributes({
                title: '每行显示按钮个数',
                min: 2,
                max: 4
            }).openRequired(()=>{
                return true;
            });


        let attributes = {isShowTitle, title, titleColor, titleIcon, titleIconPosition, pageable, onePageRow, rowBtnCount};

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
        addItem(moduleBuilder('homeBtn',moduleConfig), this.children);
    }

    /**
     * 删除目标位置的按钮
     * @param targetIndex
     */
    deleteButton(targetIndex){
        deleteItem(targetIndex, this.children);
    }
}
