import Module from '../Module';
import Attribute from "../Attribute";
import moduleBuilder from '../moduleBuilder';
import {addItem, deleteItem} from '../../util/arrayUtil';

/**
 * 入口组
 */
export default class EntryGroup extends Module {

    constructor(config) {

        super('entryGroup');

        let title;

        title = new Attribute('textAttr','按钮组')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，10字以内',
                maxLength: 10,
            });


        let attributes = {title};

        this.setAttributes(attributes);
        config = this.syncAttributes(config);

        this.list = [];
        if(config && config.list && config.list.length > 0){
            this.loadEntries(config.list);
        }else{
            this.addEntry();
        }
    }

    /**
     * 加载已有入口
     * @param children
     */
    loadEntries(list){
        for(let entry of list){
            this.addEntry(entry);
        }

    }

    /**
     * 新增按钮
     * @param moduleConfig
     */
    addEntry(moduleConfig){
        addItem(moduleBuilder('entry',moduleConfig), this.list);
    }

    /**
     * 删除目标位置的入口
     * @param targetIndex
     */
    deleteEntry(targetIndex){
        deleteItem(targetIndex, this.list);
    }

}