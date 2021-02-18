
import {RulesItemType} from './ruleItem';

import BaseRule from './baseRule';

export default class IdentityRule extends BaseRule {

    constructor(config) {
        super(RulesItemType.VERIFY_IDENTITY.value);

        this.attributes = {
            title: {
                type: 'inputSetting',
                value: RulesItemType.VERIFY_IDENTITY.name,
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
            onceGainIntegralNum: {
                type: 'numberSetting',
                value: 1,
                required: true,
                disabled: false,
                attribute: {
                    title: '每次可获得积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
        };

        this.syncAttributes(config);
    }

}
