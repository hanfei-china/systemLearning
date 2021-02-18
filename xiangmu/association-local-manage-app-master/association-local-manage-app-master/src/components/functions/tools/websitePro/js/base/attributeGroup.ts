import Attribute from './attribute';

interface Attributes {
    [id: string]: Attribute
}

export default class AttributeGroup {

    id: string;

    title: string;

    attributes: Attributes;

    //该属性是否显示，需要为函数
    show: Function;

    constructor(id: string,title: string) {
        this.id = id;
        this.title = title;
    }

    setAttributes(attributes: Attributes){
        this.attributes = attributes;
        return this;
    }


    syncAttributes(attributes: any) {
        for (let key in attributes) {
            if(attributes.hasOwnProperty(key) && this.attributes.hasOwnProperty(key)){
                this.attributes[key].setValue(attributes[key])
            }
        }
    }

    setShowMode(show: Function) {
        if (show && typeof show == 'function') {
            this.show = show;
        } else {
            throw new Error('The 【show】 cannot be empty and should be a function');
        }
        return this;
    }

    toJson(){
        let obj = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            obj[key] = attribute.getValue();
        }
        return obj;
    }

}
