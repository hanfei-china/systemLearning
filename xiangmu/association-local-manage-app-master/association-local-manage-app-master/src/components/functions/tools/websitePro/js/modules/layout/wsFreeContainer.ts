import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import {moduleBuilder} from "../moduleBuilder";
import {addItem, deleteItem} from '../../util/arrayUtil';

export default class WsFreeContainer extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '自由容器';
        super('wsFreeContainer',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 300,
            height: 150,
            left: 0,
            top: 183,
            zIndex: 1,
            position: 'absolute',
            align: 'center'
        });

        let autoHeight = new Attribute('自动高度','checkbox', false).addAttributes({
            content: '自动高度'
        });

        let minHeight = new Attribute('最低高度', 'number', 500).addAttributes({
            titleStyle:{
                paddingRight: '10px'
            }
        }).setShowMode(()=>{
            return autoHeight.value === true;
        });

        let appendHeight = new Attribute('追加高度', 'number', 50).addAttributes({
            titleStyle:{
                paddingRight: '10px'
            }
        }).setShowMode(()=>{
            return autoHeight.value === true;
        });

        layoutGroup.setAttributes({layout,autoHeight,minHeight,appendHeight});

        let styleGroup = new AttributeGroup('styleGroup','样式设置');

        let background = new Attribute('背景设置','background',{
            backgroundImage:'',
            backgroundColor:'',
            backgroundPositionX:'center',
            backgroundPositionY:'center',
            backgroundSize:'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });


        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let border = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        });

        let boxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });

        styleGroup.setAttributes({background, border, borderRadius, boxShadow});


        let otherGroup = new AttributeGroup('otherGroup','其他设置');

        let customClasses = new Attribute('class','text','').addAttributes({
            placeholder: '自定义class',
            titleStyle:{
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });


        otherGroup.setAttributes({customClasses});

        let attributes = {layoutGroup, styleGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{top:number,left:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;
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
                        width: moduleConfig.attributes.width,
                        height: moduleConfig.attributes.height,
                        left: moduleConfig.attributes.left,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex,
                        position: moduleConfig.attributes.position,
                        align: moduleConfig.attributes.align
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
        this.syncModules(moduleConfig.modules);
    }

}
