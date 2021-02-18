/**
 * 表单字段
 */
import {FIELD_TYPE, getFieldTypeConfig} from './fieldType';

const uuidTimestamp = require('uuid/v1');

export default class Field {

    constructor(config) {
        this.id = 'field-'+uuidTimestamp();
        if (config) {
            //字段的标识
            this.code = config.code;

            this.moduleName = config.moduleName;

            //字段的类型
            this.type = config.type;

            //是否必填
            this.isRequire = config.isRequire || false;

            //字段类型的配置
            this.typeConfig = getFieldTypeConfig(config.type, config.typeConfig);

            //字段的标题
            this.title = config.title || this.initTitle();

            //字段描述
            this.describe = config.describe || '字段描述';
            
            //关联字段的标识
            this.belongAttribute=config.belongAttribute?JSON.parse(JSON.stringify(config.belongAttribute)):[];
        } else {
            throw new Error('config is' + config);
        }

    }

    initTitle() {
        switch (this.type) {
            case FIELD_TYPE.SIMPLE_TEXT_INPUT.code:
                return '单行文本';
            case FIELD_TYPE.MULTI_TEXT_INPUT.code:
                return '多行文本';
            case FIELD_TYPE.DATE_TIME_INPUT.code:
                return '时间日期';
            case FIELD_TYPE.RADIO_INPUT.code:
                return '单选';
            case FIELD_TYPE.CHECKBOX_INPUT.code:
                return '多选';
            case FIELD_TYPE.IMAGE_UPLOAD.code:
                return '图片上传';
            case FIELD_TYPE.FILE_UPLOAD.code:
                return '文件上传';
            case FIELD_TYPE.IMAGE_TEXT_PREVIEW.code:
                return '富文本';
            case FIELD_TYPE.LINK_TEXT.code:
                return '关联字段';
            default:
                throw new Error(`不支持的字段类型：${this.type}`);
        }
    }
}
