import { RulesItemType } from './ruleItem';
import BaseRule from './baseRule';
import { deepCopy2 } from '../../../../../../js/util/objectUtil'

export default class DailyCheckRule extends BaseRule {

    constructor(config) {
        super(RulesItemType.PERFECT_INFORMATION.value);
        this.attributes = {
            title: {
                type: 'inputSetting',
                value: RulesItemType.PERFECT_INFORMATION.name,
                required: true,
                disabled: true,
                hideInSetting: true,
                attribute: {
                    title: '名称',
                    maxLength: 20,
                    placeholder: '请输入规则名称，20字以内',
                    titleWidth: 130
                }
            },
            describe: {
                type: 'textareaSetting',
                value: '',
                required: false,
                disabled: false,
                attribute: {
                    title: '描述',
                    maxLength: 50,
                    placeholder: '请输入规则描述，50字以内',
                    titleWidth: 130
                }
            },
        };
        if (config && config.attributes) {
            // this.attributes.minPerfectInformatio = JSON.parse(JSON.stringify(config.attributes.minPerfectInformatio));
            this.attributes.minPerfectInformatio = deepCopy2(config.attributes.minPerfectInformatio, {});
        } else {
            this.attributes.minPerfectInformatio = {
                type: 'persetSetting',
                required: true,
                disabled: false,
                hideInSetting: false,
                attribute: {
                    title: '个人信息完善',
                    attributes: [{
                        persent: {
                            maxLength: 3,
                            titleWidth: '110px'
                        },
                        integral: {
                            max: Infinity,
                            min: 1,
                            titleWidth: 130
                        },
                        value: {
                            persent: '90',
                            integral: 10
                        }
                    }]
                }
            }
        }


        // this.syncAttributes(config);
    }

}