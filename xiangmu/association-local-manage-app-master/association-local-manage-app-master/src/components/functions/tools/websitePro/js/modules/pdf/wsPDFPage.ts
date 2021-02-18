import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import {moduleBuilder} from "../moduleBuilder";
import {addItem, deleteItem} from '../../util/arrayUtil';

export default class WsPDFPage extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '自由容器';
        super('wsPDFPage',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let layout = new Attribute('布局设置','layout',{
            width: 794,
            height: 1122,
            left: 0,
            top: 0,
            zIndex: 1,
            position: 'relative',
            align: 'center'
        }).addAttributes({
            position: {
                show: false
            },
            top: {
                show: false
            },
            left: {
                show: false
            },
            zIndex: {
                show: false
            },
        });

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置').setAttributes({layout});

        let background = new Attribute('背景设置','background',{
            backgroundImage:'',
            backgroundColor:'#FFFFFF',
            backgroundPositionX:'center',
            backgroundPositionY:'center',
            backgroundSize:'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        }).addAttributes({
            showAlpha: false
        });

        let styleGroup = new AttributeGroup('styleGroup','样式设置').setAttributes({background})

        let attributes = {layoutGroup, styleGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{top:number,left:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
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
        let  attributes = moduleConfig.attributes;
        this.syncAttributes(attributes);
        this.syncModules(moduleConfig.modules);
    }

}
