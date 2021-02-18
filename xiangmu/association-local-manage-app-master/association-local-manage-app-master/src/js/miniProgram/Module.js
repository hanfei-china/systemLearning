import {deepCopy} from "../util/objectUtil";

export default class Module {

    constructor(name) {
        this.name = name;
        this.attributes = {};
    }

    setAttributes(attributes) {
        this.attributes = attributes;
    }

    /**
     * 同步attributes
     * @param config
     * @returns {*} 会返回config的反序列化对象
     */
    syncAttributes(config) {
        if (config && config !== '') {
            if (typeof config == 'string') {
                config = JSON.parse(config);
            }

            let attributes = config.attributes;
            if (attributes) {
                for (let key in this.attributes) {
                    let value = attributes[key];
                    if (value !== undefined && value !== null) {
                        this.attributes[key].value = value;
                    }
                }
            } else {
                //兼容老版本的数据
                for (let key in this.attributes) {
                    let value = config[key];
                    if (value !== undefined && value !== null) {
                        this.attributes[key].value = value;
                    }
                }
            }

        }

        return config;
    }

    /**
     * 返回一个过滤掉其他属性的attributes对象
     * @param isToTemplate 是否是在模版化对象
     */
    getAttributes(isToTemplate = false) {
        let result = {};
        if (isToTemplate) {
            //模版化对象时，只保留需要保留的属性值
            for (let key in this.attributes) {
                let attribute = this.attributes[key];
                let {value, isRetainAttribute, originalValue} = attribute;
                if (isRetainAttribute) {
                    result[key] = value;
                } else {
                    result[key] = originalValue;
                }
            }
        } else {
            for (let key in this.attributes) {
                let attribute = this.attributes[key];
                let {value} = attribute;

                result[key] = value;

                //暂时不校验空值了

                // if (!attribute.required || attribute.requiredCheck()) {
                //     result[key] = value;
                // }
            }
        }

        return result;
    }

    /**
     * 判断对象是否含有某个键
     * @param test
     * @returns {boolean}
     */
    hasKey(test) {
        for (let key in this) {
            if (test === key) {
                return true;
            }
        }

        return false;
    }

    toJson(isToTemplate = false) {
        let obj = deepCopy(this);

        //需要重新替换 attributes 和 list/children/sideStopButtons 等相关数组字段
        obj.attributes = this.getAttributes(isToTemplate);
        if (this.hasKey('list')) {
            let list = [];
            for (let item of this['list']) {
                list.push(item.toJson(isToTemplate));
            }
            obj.list = list;
        }

        if (this.hasKey('children')) {
            let list = [];
            for (let item of this['children']) {
                list.push(item.toJson(isToTemplate));
            }
            obj.children = list;
        }

        if (this.hasKey('sideStopButtons')) {
            let list = [];
            for (let item of this['sideStopButtons']) {
                list.push(item.toJson(isToTemplate));
            }
            obj.sideStopButtons = list;
        }

        if (this.hasKey('modules')) {
            let list = [];
            for (let item of this['modules']) {
                list.push(item.toJson(isToTemplate));
            }
            obj.modules = list;
        }

        return obj;
    }


}
