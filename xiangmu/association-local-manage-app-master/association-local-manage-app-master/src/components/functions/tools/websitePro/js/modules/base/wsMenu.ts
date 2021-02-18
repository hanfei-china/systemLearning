import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import Vue from "vue";

import {addItem, addItemWithPosition, deleteItem} from '../../util/arrayUtil';
import WsMenuItem from './wsMenuItem';

export default class WsMenu extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '菜单';
        super('wsMenu',id,title,'1.0',true);
        this.unChildren();
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 400,
            height: 60,
            left: 509,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        layoutGroup.setAttributes({layout});

        let menuGroup = new Attribute('菜单颜色设置','group','');

        let menuBackgroundColor = new Attribute('背景色：','color', '#FFFFFF')
            .addAttributes({
                showAlpha: false,
                titleStyle:{
                    width: '70px',
                    textAlign: 'right',
                    paddingRight: '10px'
                }
            });

        let menuTextColor = new Attribute('文字颜色：','color', '#303133')
            .addAttributes({
                showAlpha: false,
                titleStyle:{
                    width: '70px',
                    textAlign: 'right',
                    paddingRight: '10px'
                }
            });

        let menuActiveTextColor = new Attribute('激活颜色：','color', '#409EFF')
            .addAttributes({
                showAlpha: false,
                titleStyle:{
                    width: '70px',
                    textAlign: 'right',
                    paddingRight: '10px'
                }
            });

        let isUserHover = new Attribute('鼠标动画', 'checkbox', false).addAttributes({
            content: '鼠标浮过菜单时开启动画'
        });

        let isOpenBackgroundTransparent = new Attribute('鼠标动画', 'checkbox', true).addAttributes({
            content: '开启背景透明'
        });

        let viewGroup = new AttributeGroup('viewGroup', '显示设置')
            .setAttributes({menuGroup, menuBackgroundColor, menuTextColor, menuActiveTextColor, isUserHover,isOpenBackgroundTransparent});

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

        let attributes = {layoutGroup,viewGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    addModule(index?:number){
        let module = new WsMenuItem({id:undefined,title:undefined,version:'1.0'});
        if(index || index === 0){
            addItemWithPosition(index,1,this.modules, module);
        }else{
            addItem(module,this.modules);
        }
    }

    deleteModule(index){
        if(this.modules.length < 2){
            Vue.prototype.$message.warning('请保留至少一个菜单项');
            return;
        }

        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.modules);
        }).catch(()=>{});
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsMenuItem(module),this.modules);
    }

    syncModules(modules ?: Array<any>) {
        if(!modules || modules.length < 1){
            this.addModule();
        }else{
            for(let module of modules){
                this.loadModule(module);
            }
        }
        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        let modules = [];
        if (!version) {
            attributes = {
                layoutGroup: {
                    layout: {
                        width: moduleConfig.attributes.width,
                        height: moduleConfig.attributes.height,
                        left: moduleConfig.attributes.left,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex
                    }
                },
                otherGroup: {
                    customClasses: moduleConfig.attributes.customClasses
                }
            };

            modules = moduleConfig.items;

        } else {
            attributes = moduleConfig.attributes;
            modules = moduleConfig.modules;
        }

        this.syncAttributes(attributes || {});
        this.syncModules(modules || []);
    }

}
