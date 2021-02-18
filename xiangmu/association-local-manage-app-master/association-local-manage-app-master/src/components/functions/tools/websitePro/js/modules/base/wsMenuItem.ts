import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import Vue from "vue";

import {addItem, addItemWithPosition, deleteItem} from '../../util/arrayUtil';

export default class WsMenuItem extends Module{

    parentId: String;

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '菜单项';
        super('wsMenuItem',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){
        let otherGroup = new AttributeGroup('otherGroup','其他设置');

        let customClasses = new Attribute('class','text','').addAttributes({
            placeholder: '自定义class',
            titleStyle:{
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let linkConfig = new Attribute('链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 1, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).hiddenTitle();

        let linkGroup = new AttributeGroup('linkGroup','链接设置').setAttributes({
            linkConfig
        });


        otherGroup.setAttributes({customClasses});

        let attributes = {linkGroup,otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(){
        return this;
    }

    setParentId(parentId){
        this.parentId = parentId;
        return this;
    }

    addModule(index?:number){
        let module = new WsMenuItem({id:undefined,title:'子菜单项',version:'1.0'}).setParentId(this.id);
        if(index || index === 0){
            addItemWithPosition(index,1,this.modules, module);
        }else{
            addItem(module,this.modules);
        }
    }

    deleteModule(index){
        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.modules);
        }).catch(()=>{});
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsMenuItem(module).setParentId(this.id),this.modules);
    }

    syncModules(modules ?: Array<any>) {
        for(let module of modules){
            this.loadModule(module);
        }
        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        let modules = [];
        if (!version) {
            attributes = {
                linkGroup: {
                    linkConfig: {
                        target: moduleConfig.attributes.linkConfig.target,
                        linkType: moduleConfig.attributes.linkConfig.linkType,
                        linkUrl: moduleConfig.attributes.linkConfig.linkUrl,
                        pagePath: moduleConfig.attributes.linkConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    }
                },
                otherGroup: {
                    customClasses: moduleConfig.attributes.customClasses
                }
            };
            this.title = moduleConfig.attributes.title;
            modules = moduleConfig.items;
        } else {
            attributes = moduleConfig.attributes;
            modules = moduleConfig.modules;
        }

        this.syncAttributes(attributes || {});
        this.syncModules(modules || []);
    }

}
