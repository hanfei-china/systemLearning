import Module from '../Module';
import Attribute from '../Attribute';
import moduleBuilder from '../moduleBuilder';
import {addItem, addItemWithPosition, moveItem, deleteItem} from '../../util/arrayUtil';

const uuid = require('uuid');

export default class Page extends Module{

    constructor(config){
        super('page');

        // let isShowTitle = new Attribute('checkboxAttr', true)
        //     .addAttributes({
        //         title: '标题栏显示设置',
        //         content: '显示标题栏'
        //     }).openRequired(() => {
        //         return true;
        //     });

        let title = new Attribute('textAttr','页面')
            .addAttributes({
                title: '页面标题',
                placeholder: '请输入页面标题',
                maxLength: 10,
            });

        let titleColor = new Attribute('selectAttr', '#ffffff')
            .addAttributes({
                title: '标题颜色',
                items: [
                    {value:'#000000', title: '黑色'},
                    {value:'#ffffff', title: '白色'}
                ],
            }).openRequired(() => {
                return true;
            });

        let titleBackgroundColor = new Attribute('colorAttr', '#1c7ccf')
            .addAttributes({
                title: '标题背景色',
                showAlpha: false,
                showClear: false,
                showPick: false,
                predefine: []
            }).openRequired(() =>{
                return true;
            });

        let attributes = {title, titleColor, titleBackgroundColor};

        this.setAttributes(attributes);
        config = this.syncAttributes(config);


        this.modules = [];
        this.sideStopButtons = [];
        this.pageId = uuid.v1();

        if(config){
            if(config.pageId){
                this.pageId = config.pageId;
            }
            this.loadModules(config.modules);
            this.loadSideStopButtons(config.sideStopButtons);
        }

    }

    /**
     * 用于加载已有数据
     * @param modules
     */
    loadModules(modules){
        if(modules){
            for(let module of modules){
                try {
                    addItem(moduleBuilder(module.name,module),this.modules);
                } catch(e) {
                    console.error(e)
                }
            }
        }
    }

    /**
     * 新增一个模块
     * @param moduleName
     */
    newModule(moduleName){
        addItem(moduleBuilder(moduleName),this.modules);
    }

    /**
     * 用于新增模块
     * @param moduleName 模块名称
     * @param targetIndex 目标位置
     * @param dropPosition 1目标之后 -1目标之前
     */
    addModule(moduleName, targetIndex, dropPosition){
        addItemWithPosition(targetIndex, dropPosition, this.modules, moduleBuilder(moduleName));
    }

    /**
     * 删除目标位置的模块
     * @param targetIndex
     */
    deleteModule(targetIndex){
        deleteItem(targetIndex, this.modules);
    }

    /**
     * 移动模块
     * @param srcIndex 源位置
     * @param targetIndex 目标位置
     * @param dropPosition 1目标之后 -1目标之前
     */
    moveModule(srcIndex, targetIndex, dropPosition){
        moveItem(targetIndex, dropPosition, srcIndex, this.modules);
    }


    /**
     * 用于加载已有侧停按钮
     * @param modules
     */
    loadSideStopButtons(sideStopButtons){
        if(sideStopButtons){
            for(let sideStopButton of sideStopButtons){
                addItem(moduleBuilder('sideStopButton',sideStopButton),this.sideStopButtons);
            }
        }
    }

    /**
     * 用于新增侧停按钮
     */
    addSideStopButton(){
        addItem(moduleBuilder('sideStopButton'),this.sideStopButtons);
    }

    /**
     * 删除目标位置的侧停按钮
     * @param targetIndex
     */
    deleteSideStopButton(targetIndex){
        deleteItem(targetIndex, this.sideStopButtons);
    }
}
