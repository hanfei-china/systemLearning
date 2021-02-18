import SimpleCondition from "./simpleCondition";
import {addItem, deleteItem} from "../../../../../../../js/util/arrayUtil";

const uuidTimestamp = require('uuid/v1');

export default class GroupCondition {

    name: string = "group";

    id: string;

    //逻辑关系 and/or
    logicalRelationship: string = "and";

    //子级
    children: Array<SimpleCondition | GroupCondition> = [];

    constructor(config: any) {
        if(config){
            if(typeof config === 'string'){
                config = JSON.parse(config);
            }
            this.id = config.id;
            this.logicalRelationship = config.logicalRelationship;
            this.loadChildren(config.children);
        }else{
            this.id = uuidTimestamp();
        }
    }

    addItem(type){
        if(type === 'simple'){
            addItem(new SimpleCondition(null),this.children);
        }else if(type === 'group'){
            addItem(new GroupCondition(null),this.children);
        }else{
            throw new Error(`不支持的条件类型：${type}`);
        }
    }

    deleteItem(index){
        deleteItem(index,this.children);
    }

    loadChildren(children){
        for(let config of children){
            let {name} = config;
            if(name === 'simple'){
                addItem(new SimpleCondition(config),this.children);
            }else if(name === 'group'){
                addItem(new GroupCondition(config),this.children);
            }else{
                throw new Error(`不支持的条件类型：${name}`);
            }

        }
    }

    getCondition(){
        let condition = '';
        let logicalRelationship = this.logicalRelationship;
        let children = [];
        for(let child of this.children){
            let _condition = child.getCondition();
            if(_condition){
                children.push(_condition);
            }
        }

        let length = children.length;

        if(length > 0){
            children.forEach((_condition,index)=>{
                if(index === length - 1){
                    condition += _condition;
                }else{
                    condition += `${_condition} ${logicalRelationship} `;
                }
            });

            if(length > 1){
                condition = `( ${condition} )`;
            }
        }

        return condition;
    }


}
