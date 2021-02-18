
import {RulesItemType} from './ruleItem';

import BaseRule from './baseRule';

export default class InviteAlumniRule extends BaseRule {

    constructor(config) {
        super(RulesItemType.INVITE_ALUMNI.value);

        this.attributes = {
            title: {
                type: 'inputSetting',
                value: RulesItemType.INVITE_ALUMNI.name,
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
            inviterIntegralNum: {
                type: 'numberSetting',
                value: 1,
                required: true,
                disabled: false,
                attribute: {
                    title: '邀请人可获得积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            inviteeIntegralNum: {
                type: 'numberSetting',
                value: 1,
                required: true,
                disabled: false,
                attribute: {
                    title: '被邀请人可获得积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            availableTimes: {
                type: 'numberSetting',
                value: 100,
                required: true,
                disabled: false,
                attribute: {
                    title: '邀请前几次有效',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            availableHours: {
                type: 'numberSetting',
                value: 48,
                required: true,
                disabled: false,
                attribute: {
                    title: '被邀请人几小时内认证有效',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            
            
            
        };

        this.syncAttributes(config);
    }

}
