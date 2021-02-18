export default class Attribute{

    //设置栏名称
    title: string;

    //属性类型， input checkbox position layout
    type: string;

    //属性的值
    value: any;

    //属性的其他配置
    attributes: Object;

    //该属性是否显示，需要为函数
    show: Function;

    //是否限制标题
    showTitle: boolean;

    constructor(title: string, type: string, value: any){
        this.title = title;
        this.type = type;
        this.setValue(value);
        this.showTitle = true;
    }

    addAttributes(attributes){
        this.attributes = attributes;
        return this;
    }

    setShowMode(show: Function){
        if(show && typeof show == 'function'){
            this.show = show;
        }else{
            throw new Error('The 【show】 cannot be empty and should be a function');
        }
        return this;
    }

    setValue(value){
        this.value = value;
    }

    getValue(){
        return this.value;
    }

    hiddenTitle(){
        this.showTitle = false;
        return this;
    }
}
