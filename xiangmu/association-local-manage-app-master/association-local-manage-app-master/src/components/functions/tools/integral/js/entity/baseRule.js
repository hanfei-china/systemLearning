import { isNullValue } from "./ruleItem";
import { exDeepCopy } from "@/js/util/objectUtil"
import { deepCopy2 } from '../../../../../../js/util/objectUtil'

/**
 * 规则项基类
 */
const uuid = require('uuid')
export default class BaseRule {

    constructor(rulesItemType) {
        this.rulesItemType = rulesItemType;
        this.attributes = [];
        this.rulesArrayAttr = null;
        this.rulesArray = [];
    }

    syncAttributes(config) {
        if (config) {
            if (typeof config === 'string') {
                config = JSON.parse(config);
            }

            for (let key in this.attributes) {
                let value = config.attributes[key];
                if (!isNullValue(value)) {
                    this.attributes[key].value = value;
                }
            }
            if (this.rulesArrayAttr) {
                if (config.attributes.rules) {

                    for (let rule of config.attributes.rules) {
                        this.rulesArray.push(this.addRule(rule));
                    }
                } else {
                    this.rulesArray = []
                }
            }
        }

    }

    addRule(ruleValues) {
        let rule = exDeepCopy(this.rulesArrayAttr);
        if (ruleValues) {
            for (let key in rule) {
                let value = ruleValues[key];
                if (!isNullValue(value)) {
                    rule[key].value = value;
                }
            }
        } else {
            if (rule.id) {
                rule.id.value = uuid.v4();
            }
        }
        return rule;
    }

    getAttributes() {
        let attributes = {};

        for (let key in this.attributes) {
            if (this.attributes[key].type === 'persetSetting') {
                // attributes[key] = JSON.parse(JSON.stringify(this.attributes[key]));
                attributes[key] = deepCopy2(this.attributes[key], {});
            } else {
                attributes[key] = this.attributes[key].value;
            }
        }
        if (this.rulesArrayAttr) {
            attributes.rules = this.rulesArray.map(item => {
                let rule = {}
                for (let key in item) {
                    rule[key] = item[key].value;
                }
                return rule
            })
        }

        return attributes;
    }

    getEntity() {
        return {
            rulesItemType: this.rulesItemType,
            attributes: this.getAttributes()
        }
    }
}