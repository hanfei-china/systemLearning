import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import {moduleBuilder} from "../moduleBuilder";

import {addItem, deleteItem} from '../../util/arrayUtil';

export default class WsFillContainer extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '通栏排版';
        super('wsFillContainer', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {

        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let layout = new Attribute('布局设置', 'layout', {
            width: 100,
            height: 48,
            left: 0,
            top: 183,
            zIndex: 1
        }).addAttributes({
            position: {show: false},
            width: {show: false},
            left: {show: false}
        });

        let autoHeight = new Attribute('自动高度', 'checkbox', false).addAttributes({
            content: '自动高度'
        });

        let minHeight = new Attribute('最低高度', 'number', 0).addAttributes({
            titleStyle:{
                paddingRight: '10px'
            }
        }).setShowMode(()=>{
            return autoHeight.value === true;
        });

        let appendHeight = new Attribute('追加高度', 'number', 0).addAttributes({
            titleStyle:{
                paddingRight: '10px'
            }
        }).setShowMode(()=>{
            return autoHeight.value === true;
        });

        layoutGroup.setAttributes({layout,autoHeight,minHeight,appendHeight});

        let styleGroup = new AttributeGroup('styleGroup', '样式设置');

        let background = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });


        styleGroup.setAttributes({background});


        let otherGroup = new AttributeGroup('otherGroup', '其他设置');

        let customClasses = new Attribute('class', 'text', '').addAttributes({
            placeholder: '自定义class',
            titleStyle: {
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });


        otherGroup.setAttributes({customClasses});

        let attributes = {layoutGroup, styleGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position: { top: number }) {
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
        let {version} = moduleConfig;
        let attributes = {};
        if (!version) {
            attributes = {
                layoutGroup: {
                    layout: {
                        width:  moduleConfig.attributes.height.width,
                        height: moduleConfig.attributes.height,
                        left: 0,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex
                    },
                    autoHeight: moduleConfig.attributes.autoHeight
                },
                styleGroup: {
                    background: {
                        backgroundImage: moduleConfig.attributes.backgroundImage,
                        backgroundColor: moduleConfig.attributes.backgroundColor,
                        backgroundPositionX: moduleConfig.attributes.backgroundPositionX,
                        backgroundPositionY: moduleConfig.attributes.backgroundPositionY,
                        backgroundSize: moduleConfig.attributes.backgroundSize,
                        backgroundRepeatX: moduleConfig.attributes.backgroundRepeatX,
                        backgroundRepeatY: moduleConfig.attributes.backgroundRepeatY,
                    }
                },
                otherGroup: {
                    customClasses: moduleConfig.attributes.customClasses
                }
            }
        } else {
            attributes = moduleConfig.attributes;
        }

        this.syncAttributes(attributes);
        this.syncModules( moduleConfig.modules);
    }
}
