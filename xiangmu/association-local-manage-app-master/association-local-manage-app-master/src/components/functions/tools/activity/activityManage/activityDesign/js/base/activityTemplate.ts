import Module from './module';

import AttributeGroup from './attributeGroup';
import ButtonModule from "../module/buttonModule";
import FallFlowModule from "../module/fallFlowModule";

function deleteItem(index,srcArray=[]){
    srcArray.splice(index,1);
}

interface AttributeGroups {
    [id: string]: AttributeGroup
}

import Vue from 'vue';

export default class ActivityTemplate {

    name: string;

    templateSample: string;

    activityModules: Array<Module> = [];

    customModules: Array<Module> = [];

    modules: Array<Module> = [];

    //模版的属性
    attributes: AttributeGroups;

    constructor(name:string, templateSample:string) {
        this.name = name;
        this.templateSample = templateSample;
    }

    setActivityModule(activityModules: Array<Module>){
        this.activityModules = activityModules;
    }

    setCustomModules(customModules: Array<Module>){
        this.customModules = customModules;
    }

    setAttributes(attributes: AttributeGroups) {
        this.attributes = attributes;
        return this;
    }

    syncAttributes(attributes: Object) {
        if (attributes) {
            for (let key in attributes) {
                if(attributes.hasOwnProperty(key) && this.attributes.hasOwnProperty(key)){
                    let attributeGroup = this.attributes[key];
                    attributeGroup.syncAttributes(attributes[key])
                }
            }
        }

        return this;
    }

    loadModules(modules: Array<any>){
        for(let module of modules){
            let {className,name,id,title,isActivityModule} = module;
            if(className === 'buttonModule'){
                let _module = new ButtonModule(name,id,'',title,'',isActivityModule)
                    .syncAttributes(module.attributes);
                this.modules.push(_module);
            }else if(className === 'fallFlowModule'){
                let _module = new FallFlowModule(name,id,'',title,isActivityModule)
                    .syncAttributes(module.attributes);
                this.modules.push(_module);
            }else {
                throw new Error('不支持的模块类型：'+className);
            }
        }

        return this;
    }

    toJson(){
        let modules = [];
        for(let module of this.modules){
            modules.push(module.toJson());
        }

        let attributes = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            attributes[key] = attribute.toJson();
        }

        return {
            name: this.name,
            modules,
            attributes
        }
    }

    loadDefaultModules(){
        for(let module of this.activityModules){
            let {className,icon,name,id,title,isActivityModule} = module;

            if(className === 'buttonModule'){
                let iconBackgroundColor = module.attributes.iconGroup.attributes.iconBackgroundColor.value;
                let _module = new ButtonModule(name,id,icon,title,iconBackgroundColor,isActivityModule);
                this.modules.push(_module);
            }else if(className === 'fallFlowModule'){
                let _module = new FallFlowModule(name,id,icon,title,isActivityModule);
                this.modules.push(_module);
            }else {
                throw new Error('不支持的模块类型：'+className);
            }
        }
        return this;
    }

    deleteModule(index){
        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.modules);
        }).catch(()=>{});
    }
}
