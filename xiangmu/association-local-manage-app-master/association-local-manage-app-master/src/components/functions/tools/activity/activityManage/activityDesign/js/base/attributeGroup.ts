import Attribute from './attribute';

interface Attributes {
    [id: string]: Attribute
}

export default class AttributeGroup {

    id: string;

    title: string;

    attributes: Attributes;

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

    toJson(){
        let obj = {};
        for(let key in this.attributes){
            let attribute = this.attributes[key];
            obj[key] = attribute.getValue();
        }
        return obj;
    }

}
