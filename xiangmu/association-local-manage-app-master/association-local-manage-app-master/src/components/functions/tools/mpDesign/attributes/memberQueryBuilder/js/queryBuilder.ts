import GroupCondition from "./groupCondtion";

const uuidTimestamp = require('uuid/v1');
export default class QueryBuilder{

    id: string;

    title: string;

    condition: GroupCondition;

    constructor(config) {
        if(config){
            if(typeof config === 'string'){
                config = JSON.parse(config);
            }
            this.id = config.id;
            this.title = config.title;
            this.condition = new GroupCondition(config.condition);
        }else{
            this.id = uuidTimestamp();
            this.title = '页签名';
            this.condition = new GroupCondition(null);
        }
    }

    copy(config){
        this.id = config.id;
        this.title = config.title;
        this.condition = new GroupCondition(config.condition);
    }

}
