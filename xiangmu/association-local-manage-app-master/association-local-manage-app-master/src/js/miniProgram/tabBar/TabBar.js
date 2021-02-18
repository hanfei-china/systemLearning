import Module from '../Module';
import Attribute from '../Attribute';
import moduleBuilder from '../moduleBuilder';
import {addItem, moveItem, deleteItem} from '../../util/arrayUtil';

export default class TabBar extends Module{

    constructor(config){
        super('tabBar');

        let backgroundColor, color, selectedColor;

        backgroundColor = new Attribute('colorAttr', '#1c7ccf')
            .addAttributes({
                title: '导航条背景色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).openRequired(() =>{
                return true;
            });

        color = new Attribute('colorAttr', '#FFFFFF')
            .addAttributes({
                title: '文字颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).openRequired(() =>{
                return true;
            });

        selectedColor = new Attribute('colorAttr', '#FFFFFF')
            .addAttributes({
                title: '选中文字颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).openRequired(() =>{
                return true;
            });

        this.setAttributes({backgroundColor, color, selectedColor});
        config = this.syncAttributes(config);

        this.list = [];

        if(config){
            this.loadTabs(config.list);
        }
    }

    /**
     * 加载已有tab
     * @param tabs
     */
    loadTabs(tabs){
        if(tabs){
            for(let tab of tabs){
                addItem(moduleBuilder('tab',tab),this.list);
            }
        }
    }

    /**
     * 新增页签
     * @param tabConfig
     * @returns {MiniProgramTab}
     */
    addTab(tabConfig){
        if(this.list.length >= 5){
            throw new Error('最多只能添加五个页签');
        }
        let tab = moduleBuilder('tab',tabConfig);
        addItem(tab, this.list);
    }

    /**
     * 删除页签
     * @param index
     */
    deleteTab(index){
        if(this.list.length <= 1){
            throw new Error('请至少保留一个页签');
        }
        deleteItem(index, this.list);
    }

    /**
     * 移动页签
     * @param srcIndex 源位置
     * @param targetIndex 目标位置
     * @param dropPosition 1目标之后 -1目标之前
     */
    moveTab(srcIndex, targetIndex, dropPosition){
        moveItem(targetIndex, dropPosition, srcIndex, this.list);
    }

    /**
     * 获取指定tab
     * @param index
     * @returns {*}
     */
    getTab(index){
        return this.list[index];
    }
}