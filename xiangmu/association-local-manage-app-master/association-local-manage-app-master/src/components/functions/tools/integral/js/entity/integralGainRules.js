import { getRuleItem } from './ruleItem';
import { deleteItem } from "../../../../../../js/util/arrayUtil";

export default class IntegralGainRules {
    constructor(config) {
        this.isOpen = false;
        this.integralRules = [];
        this.integralPerRMB = 100;
        if (config) {
            this.isOpen = config.isOpen;

            if (typeof config.integralRules == 'string') {
                config.integralRules = JSON.parse(config.integralRules);
            }
            this.loadRules(config.integralRules);
            this.integralPerRMB = config.integralPerRMB;
        }

    }

    loadRules(rules) {
        this.integralRules = [];
        for (let rule of rules) {
            this.newRule(rule.rulesItemType, rule);
        }
    }

    newRule(type, config) {
        let rule = getRuleItem(type, config);
        this.integralRules.push(rule);
        return rule;
    }

    deleteRule(index) {
        deleteItem(index, this.integralRules);
    }

    getEntity() {
        let integralRules = [];
        for (let rule of this.integralRules) {
            integralRules.push(rule.getEntity());
        }

        return {
            isOpen: this.isOpen,
            integralPerRMB: this.integralPerRMB,
            integralRules: JSON.stringify(integralRules)
        }
    }

}