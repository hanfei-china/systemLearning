import {moveItem, deleteItem, addItem} from "../../../../../js/util/arrayUtil";

import Field from './field';

export default class FormBuilder {

    constructor(config) {
        this.id = null;
        this.formTitle = '表单';
        this.formDescribe = null;

        //是否显示填表须知
        this.isShowNotice = true;
        this.noticeTitle = '填表须知';
        //填表须知内容
        this.noticeContent = `填表须知内容,我同意以上填表须知,我同意以上填表须知,我同意以上填表须知,我同意以上填表须知,我同意以上填表须知我同意以上填表须知`;
        //是否需要同意填表须知
        this.isNeedAgreeNotice = false;
        this.agreeNoticeCheckboxText = '已阅读并同意填表须知';
        this.nextButtonText = '下一步';
        //未勾选'我同意'时的提示
        this.disagreeNoticeTip = '同意后才能填写';

        //字段数组
        this.fields = [];

        //提交按钮文字
        this.submitText = '提交';

        //是否可以多次填写
        this.isManyTimes = false;

        //是否可处理
        this.isNeedHandle = false;
        //不同意-显示文本
        this.rejectText = '不同意';
        //同意-显示文本
        this.resolveText = '同意';
        // console.log(config,'--------------------------')
        if (config) {

            config.id && (this.id = config.id);
            config.formTitle && (this.formTitle = config.formTitle);
            config.formDescribe && (this.formDescribe = config.formDescribe);

            config.isShowNotice !== undefined && config.isShowNotice !== null && (this.isShowNotice = config.isShowNotice);
            config.noticeTitle && (this.noticeTitle = config.noticeTitle);
            config.noticeContent && (this.noticeContent = config.noticeContent);
            config.isNeedAgreeNotice && (this.isNeedAgreeNotice = config.isNeedAgreeNotice);
            config.agreeNoticeCheckboxText && (this.agreeNoticeCheckboxText = config.agreeNoticeCheckboxText);
            config.nextButtonText && (this.nextButtonText = config.nextButtonText);
            config.disagreeNoticeTip && (this.disagreeNoticeTip = config.disagreeNoticeTip);

            if (config.fields) {
                if (typeof config.fields === 'string') {
                    config.fields = JSON.parse(config.fields);
                }
                for (let fieldConfig of config.fields) {
                    this.loadField(fieldConfig);
                }
            }

            config.submitText && (this.submitText = config.submitText);

            config.isManyTimes !== undefined && config.isManyTimes !== null && (this.isManyTimes = config.isManyTimes);

            config.isNeedHandle !== undefined && config.isNeedHandle !== null && (this.isNeedHandle = config.isNeedHandle);
            config.rejectText && (this.rejectText = config.rejectText);
            config.resolveText && (this.resolveText = config.resolveText);
        }

    }

    /**
     * 加载字段
     * @param config
     * @returns {Field}
     */
    loadField(config) {
        let field = new Field(config);
        this.fields.push(field);
        return field;
    }

    /**
     * 新增字段
     * @param options
     * @returns {Field}
     */
    addField(options) {
        let config = {};
        if(typeof options === 'number'){
            config = {type: options,isRequire: false};
        }else{
            config = options;
        }
        let field = new Field(config);
        addItem(field,this.fields);
        return field;
    }

    /**
     * 删除字段
     * @param index
     * @returns {*}
     */
    deleteField(index) {
        let field = this.fields[index];
        deleteItem(index, this.fields);
        return field;
    }

    /**
     * 移动字段
     * @param targetIndex
     * @param dropPosition
     * @param srcIndex
     */
    moveField(targetIndex, dropPosition, srcIndex) {
        moveItem(targetIndex, dropPosition, srcIndex, this.fields);
    }


    /**
     * 通用设置参数合法性校验
     * @returns {boolean}
     */
    commonSettingCheck() {
        if (this.isShowNotice) {
            if (!this.noticeTitle || this.noticeTitle === '') {
                throw new Error('请设置填表须知标题');
            }

            if (!this.noticeContent || this.noticeContent === '') {
                throw new Error('请设置填表须知内容');
            }

            if (this.isNeedAgreeNotice) {
                if (!this.agreeNoticeCheckboxText || this.agreeNoticeCheckboxText === '') {
                    throw new Error('请设置同意填表须知提示文字');
                }

                if (!this.disagreeNoticeTip || this.disagreeNoticeTip === '') {
                    throw new Error('请设置填表人未勾选同意填表须知提示文字');
                }
            }
        }

        if (!this.submitText || this.submitText === '') {
            throw new Error('请设置提交按钮显示文字');
        }

        if (this.isNeedHandle) {
            if (!this.rejectText || this.rejectText === '') {
                throw new Error('请设置[不同意]回执显示文字');
            }

            if (!this.resolveText || this.resolveText === '') {
                throw new Error('请设置[同意]回执显示文字');
            }
        }

        return true;
    }

}
