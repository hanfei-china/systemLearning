import {RulesItemType} from './ruleItem';
import BaseRule from './baseRule';

export default class DailyCheckRule extends BaseRule {

    constructor(config) {
        super(RulesItemType.DAILY_CHECK.value);

        this.attributes = {
            title: {
                type: 'inputSetting',
                value: RulesItemType.DAILY_CHECK.name,
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
                    title: '签到可获积分值',
                    max: Infinity,
                    min: 1,
                    titleWidth: 130
                }
            },
            openContinuousCheckInAward: {
                type: 'checkboxSetting',
                value: false,
                required: true,
                disabled: false,
                attribute: {
                    title: '连续签到奖励',
                    titleWidth: 130,
                    content: '开启连续签到奖励'
                }
            },
        };


        this.syncAttributes(config);
    }

}
