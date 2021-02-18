import {deepCopy} from "../util/objectUtil";

export default class Attribute {

    constructor(type, value,isRetainAttribute = true){
        this.type = type;
        this.value = value;
        //是否为保留属性，该属性的值会在模版化时被保留
        this.isRetainAttribute = isRetainAttribute;
        this.originalValue = deepCopy(value);

        this.attributes = {};
    }

    /**
     * 新增属性
     * @param key
     * @param value
     * @returns {Attribute}
     */
    addAttribute(key, value){
        this.attributes[key] = value;
        return this;
    }

    /**
     * 新增一组属性，会覆盖重名属性
     * @param attributes
     */
    addAttributes(attributes){
        for(let key in attributes){
            let value = attributes[key];
            this.attributes[key] = value;
        }
        return this;
    }

    /**
     * 开启属性必填
     * @param nullCheckFunc
     */
    openRequired(nullCheckFunc){
        this.required = true;

        if(nullCheckFunc && typeof nullCheckFunc == 'function'){
            this.nullCheckFunc = nullCheckFunc;
        }else{
            throw new Error('The 【nullCheckFunc】 cannot be empty and should be a function');
        }

        return this;
    }

    /**
     * 必填校验
     * @returns {*}
     */
    requiredCheck(){
        if(this.required && this.nullCheckFunc){
            return this.nullCheckFunc();
        }else{
            return true;
        }
    }

    /**
     * 设置显示模式，show应该为一个函数
     * @param show
     */
    setShowMode(show){
        if(show && typeof show == 'function'){
            this.show = show;
        }else{
            throw new Error('The 【show】 cannot be empty and should be a function');
        }
        return this;
    }
}
