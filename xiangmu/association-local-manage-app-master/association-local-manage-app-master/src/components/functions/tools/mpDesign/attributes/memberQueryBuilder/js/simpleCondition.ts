const uuidTimestamp = require('uuid/v1');
import {formatDate} from '../../../../../../../js/util/utilFunction';

export default class SimpleCondition{

    name: string = "simple";

    id: string;

    code: string = "";

    expression: string = "=";

    comparisonObject: string = "certainValue";

    topicType: number = null; //0,2,5,6 单行 单选 日期 地区

    dateType: string = null;

    comparisonStringValue: null | string = null;

    comparisonArrayValue: null | Array<any> = null;

    constructor(config: any) {
        if(config){
            if(typeof config === 'string'){
                config = JSON.parse(config);
            }
            this.id = config.id;
            this.code = config.code;
            this.expression = config.expression;
            this.comparisonObject = config.comparisonObject;
            this.comparisonStringValue = config.comparisonStringValue;
            this.comparisonArrayValue = config.comparisonArrayValue;
            this.topicType = config.topicType;
            this.dateType = config.dateType;
        }else{
            this.id = uuidTimestamp();
        }

    }

    getCondition(){
        let condition = '';

        if(this.comparisonObject === 'certainValue'){
            let topicType = this.topicType;
            if((topicType === 0 || topicType === 2) && this.comparisonStringValue){
                condition = ` t1.${this.code} ${this.expression} '${this.comparisonStringValue}' `;
            }

            if(topicType === 5 && this.comparisonStringValue){
                let value = formatDate(new Date(this.comparisonStringValue),'yyyy-MM-dd');
                if(this.dateType === 'date'){
                    condition = ` Date(t1.${this.code}) ${this.expression} Date('${value}') `;
                }

                if(this.dateType === 'year'){
                    condition = ` Year(t1.${this.code}) ${this.expression} Year('${value}') `;
                }
            }

            if(topicType === 6 && (this.comparisonArrayValue && this.comparisonArrayValue.length > 0)){
                let length = this.comparisonArrayValue.length;
                condition = '('
                this.comparisonArrayValue.forEach((value,index)=>{
                    if(index === length -1){
                        condition += ` json_extract(t1.${this.code},'$[${index}]') ${this.expression} '${this.comparisonArrayValue[index]}' `;
                    }else{
                        condition += `json_extract(t1.${this.code},'$[${index}]') ${this.expression} '${this.comparisonArrayValue[index]}' and `;
                    }

                });
                condition += ')';
            }
        }

        return condition;
    }
}
