import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import Vue from "vue";

import {addItem, addItemWithPosition, deleteItem} from '../../util/arrayUtil';
import WsBreadcrumbItem from './wsBreadcrumbItem';

export default class WsBreadcrumb extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '面包屑';
        super('wsBreadcrumb',id,title,'1.0',true);
        this.unChildren();
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 400,
            height: 30,
            left: 509,
            top: 183,
            zIndex: 1,
            position: 'absolute',
            align: 'right'
        }).hiddenTitle().addAttributes({
            width: {show: false}
        });

        layoutGroup.setAttributes({layout});

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

        let dataSrcGroup = new AttributeGroup('dataSrcGroup','数据源设置');

        let dataSrc = new Attribute('页头选择', 'breadcrumbDataSrc',{
            dataSrc: 1,
            pageHeader: ''
        }).hiddenTitle();

        dataSrcGroup.setAttributes({dataSrc});

        let styleGroup = new AttributeGroup('styleGroup', '样式设置');

        let padding = new Attribute('内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        });

        styleGroup.setAttributes({padding});


        let preContent = new Attribute('前置内容','text','').addAttributes({
            type: 'textarea',
            resize: 'none',
            rows: 4,
            placeholder: '请输入前置内容',
            titleStyle:{
                width: '52px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let extendsGroup = new AttributeGroup('extendsGroup', '扩展设置')
            .setAttributes({
                preContent
            });

        let fontGroup = new AttributeGroup('fontGroup','字体设置');

        let font = new Attribute('字体设置','font',{
            fontSize: '14px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        }).hiddenTitle().addAttributes({
            textAlign: {show: false}
        });

        fontGroup.setAttributes({font});


        let attributes = {dataSrcGroup, extendsGroup, fontGroup, layoutGroup, styleGroup ,otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    addModule(index?:number){
        let module = new WsBreadcrumbItem({id:undefined,title:undefined,version:'1.0'});
        if(index || index === 0){
            addItemWithPosition(index,1,this.modules, module);
        }else{
            addItem(module,this.modules);
        }
    }

    addPrefixModule(index?:number){
        let module = new WsBreadcrumbItem({id:undefined,title:'前置子项',version:'1.0'});
        if(index || index === 0){
            addItemWithPosition(index,1,this.prefixModules, module);
        }else{
            addItem(module,this.prefixModules);
        }
    }

    addSuffixModule(index?:number){
        let module = new WsBreadcrumbItem({id:undefined,title:'后置子项',version:'1.0'});
        if(index || index === 0){
            addItemWithPosition(index,1,this.suffixModules, module);
        }else{
            addItem(module,this.suffixModules);
        }
    }

    deleteModule(index){
        if(this.modules.length < 2){
            Vue.prototype.$message.warning('请保留至少一个面包屑子项');
            return;
        }

        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.modules);
        }).catch(()=>{});
    }

    deletePrefixModule(index){
        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.prefixModules);
        }).catch(()=>{});
    }

    deleteSuffixModule(index){
        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.suffixModules);
        }).catch(()=>{});
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsBreadcrumbItem(module),this.modules);
    }

    loadPrefixModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsBreadcrumbItem(module),this.prefixModules);
    }

    loadSuffixModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsBreadcrumbItem(module),this.suffixModules);
    }

    syncModules(modules ?: Array<any>) {
        if(!modules || modules.length < 1){
            this.addModule();
            this.addModule();
        }else{
            for(let module of modules){
                this.loadModule(module);
            }
        }
        return this;
    }

    syncPrefixModules(modules ?: Array<any>) {
        for(let module of modules){
            this.loadPrefixModule(module);
        }
        return this;
    }

    syncSuffixModules(modules ?: Array<any>) {
        for(let module of modules){
            this.loadSuffixModule(module);
        }
        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        this.syncAttributes(moduleConfig.attributes || {});
        this.syncModules(moduleConfig.modules || []);
        this.syncPrefixModules(moduleConfig.prefixModules || []);
        this.syncSuffixModules(moduleConfig.suffixModules || []);
    }

}
