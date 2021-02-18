import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem, deleteItem} from '../../../util/arrayUtil';

export default class WsRow extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '行';
        super('wsRow', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {

        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let height = new Attribute('行高度', 'number', 1).addAttributes({
            titleStyle:{
                paddingRight: '10px'
            }
        });

        let margin = new Attribute('外边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        });

        layoutGroup.setAttributes({height, margin});

        let attributes = {layoutGroup};

        this.setAttributes(attributes);
    }

    setPosition() {
        return this;
    }

    syncModules(modules ?: Array<any>) {
        if(modules){
            for(let module of modules){
                this.loadModule(module);
            }
        }
        return this;
    }

    addModule(module){
        addItem(module,this.modules);
    }

    deleteModule(index){
        deleteItem(index,this.modules);
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(moduleBuilder(module.name,module),this.modules);
    }

    formatModuleConfig(moduleConfig: any) {
        let attributes = moduleConfig.attributes;

        this.syncAttributes(attributes);
        this.syncModules( moduleConfig.modules);
    }
}
