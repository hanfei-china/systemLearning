import {RulesItemType} from './ruleItem';
import BaseRule from './baseRule';

export default class ActivityRule extends BaseRule {

    constructor(config) {
        super(RulesItemType.ACTIVITY.value);

        this.attributes = {
            title: {
                type: 'inputSetting',
                value: RulesItemType.ACTIVITY.name,
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
        this.rulesArrayAttr = {

            id: {
                type: 'inputSetting',
                value: '',
                required: true,
                disabled: true,
                hideInSetting: true,
                attribute: {
                    title: 'id',
                    maxLength: 20,
                    titleWidth: 130
                }
            },
            name: {
                type: 'inputSetting',
                value: '',
                required: true,
                disabled: false,
                attribute: {
                    title: '名称',
                    maxLength: 20,
                    placeholder: '请输入规则名称，20字以内',
                    titleWidth: 130
                }
            },
            signUpIntegralNum: {
                type: 'numberSetting',
                value: 1,
                required: true,
                disabled: false,
                attribute: {
                    title: '报名可获积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            signInIntegralNum: {
                type: 'numberSetting',
                value: 1,
                required: true,
                disabled: false,
                attribute: {
                    title: '签到可获积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
        }

        this.syncAttributes(config);
    }

}
