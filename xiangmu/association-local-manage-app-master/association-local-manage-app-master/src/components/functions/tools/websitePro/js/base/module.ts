//时间戳的形式获取uuid
const uuidTimestamp = require('uuid/v1');

import AttributeGroup from './attributeGroup';

interface AttributeGroups {
    [id: string]: AttributeGroup
}

export default class Module {

    //模块的id
    id: string;
    //模块的名称，固定唯一
    name: string;
    //明快的标题
    title: string;
    //模块的属性
    attributes: AttributeGroups;
    //模块设置面板显示方式 tab（tab）、collapse（折叠面板，是用于设置比较少的组件）、...
    attributePanel: string;
    //是否开启了子级，开启子集会加载子集管理面板
    openModules: boolean = false;
    //子级
    modules: Array<Module> = [];
    //前置子级
    prefixModules: Array<Module> = [];
    //后置子级
    suffixModules: Array<Module> = [];
    //组件版本号，用于数据做兼容性处理
    version: string;

    otherSetting: any = {};

    children: Array<Module> = [];

    constructor(name: string, id: string, title: string, version: string, openModules? :boolean) {
        this.name = name;
        this.id = this.setId(id);
        this.title = title;
        this.attributePanel = 'tab';
        this.version = version;
        if(openModules){
            this.openModules = openModules;
        }
        this.children = this.modules;
    }

    setId(id: string) {
        if (id) {
            return id;
        }
        return `${this.name}-${uuidTimestamp()}`;
    }

    unChildren(){
        this.children = null;
    }

    setAttributes(attributes: AttributeGroups) {
        this.attributes = attributes;
    }

    syncModules(){
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

    }

    syncOtherSetting(otherSetting: any) {
        if (otherSetting) {
            if(typeof otherSetting === 'string'){
                otherSetting = JSON.parse(otherSetting);
            }
            for (let key in otherSetting) {
                if(otherSetting.hasOwnProperty(key)){
                    this.otherSetting[key] = otherSetting[key];
                }
            }
        }

    }

    setAttributePanel(attributePanel){
        this.attributePanel = attributePanel;
        return this;
    }

    toJsonWithoutId(){
        let attributes = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            attributes[key] = attribute.toJson();
        }

        let modules = [];
        for(let module of this.modules){
            modules.push(module.toJsonWithoutId());
        }

        let prefixModules = [];
        for(let module of this.prefixModules){
            prefixModules.push(module.toJsonWithoutId());
        }

        let suffixModules = [];
        for(let module of this.suffixModules){
            suffixModules.push(module.toJsonWithoutId());
        }

        return {
            id: '',
            name: this.name,
            title: this.title,
            version: this.version,
            attributes,
            modules,
            prefixModules,
            suffixModules,
            otherSetting:{...this.otherSetting}
        };
    }

    toJson(){
        let attributes = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            attributes[key] = attribute.toJson();
        }

        let modules = [];
        for(let module of this.modules){
            modules.push(module.toJson());
        }

        let prefixModules = [];
        for(let module of this.prefixModules){
            prefixModules.push(module.toJson());
        }

        let suffixModules = [];
        for(let module of this.suffixModules){
            suffixModules.push(module.toJson());
        }

        return {
            id: this.id,
            name: this.name,
            title: this.title,
            version: this.version,
            attributes,
            modules,
            prefixModules,
            suffixModules,
            otherSetting:{...this.otherSetting}
        };
    }
}
