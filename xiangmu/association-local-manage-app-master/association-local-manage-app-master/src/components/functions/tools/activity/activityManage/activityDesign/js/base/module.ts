//时间戳的形式获取uuid
const uuidTimestamp = require('uuid/v1');

import AttributeGroup from './attributeGroup';

interface AttributeGroups {
    [id: string]: AttributeGroup
}

export default class Module {

    className: string;
    //模块名
    name: string;
    //模块id
    id: string;
    //模块icon
    icon: string;
    //模块标题
    title: string;
    //模块的属性
    attributes: AttributeGroups;
    //是否为活动模块
    isActivityModule: boolean = true;

    constructor(className: string,name: string, id: string, icon: string, title: string,
                isActivityModule :boolean = true) {
        this.className =className;
        this.name = name;
        this.id = this.setId(id);
        this.icon = icon;
        this.title = title;
        this.isActivityModule = isActivityModule;
    }

    setId(id: string) {
        if (id) {
            return id;
        }
        return `${this.name}-${uuidTimestamp()}`;
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

    toJson(){
        let attributes = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            attributes[key] = attribute.toJson();
        }

        return {
            className: this.className,
            isActivityModule: this.isActivityModule,
            id: this.id,
            name: this.name,
            title: this.title,
            attributes,
        };
    }
}
