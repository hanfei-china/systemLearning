/**
 * 字段类型
 */

const uuidTimestamp = require('uuid/v1');


import {moveItem, addItemWithPosition, addItem} from "../../../../../js/util/arrayUtil";

export const FIELD_TYPE = {

    SIMPLE_TEXT_INPUT: {
        code: 1,
        title: '单行文本',
        icon: '',
        isUsed: true
    },
    SCHOOL_CARD_ID: {
        code: 9,
        title: '校园卡ID',
        icon: '',
        isUsed: true
    },

    MULTI_TEXT_INPUT: {
        code: 2,
        title: '多行文本',
        icon: '',
        isUsed: true
    },

    DATE_TIME_INPUT: {
        code: 3,
        title: '日期时间',
        icon: '',
        isUsed: true
    },

    RADIO_INPUT: {
        code: 4,
        title: '单选',
        icon: '',
        isUsed: true
    },

    CHECKBOX_INPUT: {
        code: 5,
        title: '多选',
        icon: '',
        isUsed: true
    },

    IMAGE_UPLOAD: {
        code: 6,
        title: '图片上传',
        icon: '',
        isUsed: true
    },

    FILE_UPLOAD: {
        code: 7,
        title: '文件上传',
        icon: '',
        isUsed: false
    },

    IMAGE_TEXT_PREVIEW: {
        code: 8,
        title: '富文本展示',
        icon: '',
        isUsed: true
    },
    LINK_TEXT:{
        code:10,
        title:'关联字段',
        icon:'',
        isUsed:true
    }

};

/**
 * 获取正则校验字符串
 * @param matchType
 * @param matchString
 */
 export function getMatchString(matchType, matchString) {

    switch (matchType) {
        case 1:
            return '^(86){0,1}1[3-9]{1}\\d{9}$';
        case 2:
            return '^[1-9][0-9]*$';
        case 3:
            return '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$';
        case 4:
            return '^(([1-9]\\d*)(\\.\\d{1,2})?)$|^(0\\.0?([1-9]\\d?))$';
        case 5:
            return matchString || null;
        default:
            return null;
    }
}

/**
 * 单行文本输入
 */
class SimpleTextInput {

    constructor(config) {
        //是否开启正则校验
        this.isOpenMatch = false;
        //正则校验类型
        // 1：中国手机号，2：数字，首位不能为0，3：邮箱，4：金额，5：自定义
        this.matchType = 1;
        // 正则表达式
        this.matchString = '';
        // 最大输入长度
        this.maxLength = 100;
        //文本输入提示
        this.placeholder = '请输入';
        this.IDRule='';
        if (config) {
            config.isOpenMatch && (this.isOpenMatch = config.isOpenMatch);
            config.matchType && (this.matchType = config.matchType);
            config.matchString && (this.matchString = config.matchString);
            config.maxLength && (this.maxLength = config.maxLength);
            config.placeholder && (this.placeholder = config.placeholder);
            config.IDRule && (this.IDRule = config.IDRule);
        }
    }

}

/**
 * 多行文本输入
 */
class MultiTextInput {
    constructor(config) {
        //文本输入提示
        this.placeholder = '请输入';
        if (config) {
            //文本输入提示
            config.placeholder && (this.placeholder = config.placeholder);
        }
    }
}

/**
 * 日期时间选择
 */
class DateTimeInput {
    constructor(config) {
        this.type = 'datetime';
        this.placeholder = '请选择时间';
        if (config) {
            config.type && (this.type = config.type);
            config.placeholder && (this.placeholder = config.placeholder);
        }
    }
}

/**
 * 单选/复选项
 */
class ChooseItem {

    constructor(config) {
        this.code = 'item-' + uuidTimestamp(),
        this.type = 1;
        this.content = '';
        this.isDelete = false;

        if (config) {
            config.code && (this.code = config.code),
            config.type && (this.type = config.type);
            config.content && (this.content = config.content);
            config.isDelete && (this.isDelete = config.isDelete);
        }

    }

}
/**
 * 关联选项
 */
class ChooseItemLink {

    constructor(config) {
        this.code = 'item-' + uuidTimestamp(),
        this.type = 1;
        this.content = '';
        this.isDelete = false;
        // this.linkItem=[];
        this.linkAttribute={
            isLink:true,
            linkTo:''+Date.now()
        }

        if (config) {
            config.code && (this.code = config.code),
            config.type && (this.type = config.type);
            config.content && (this.content = config.content);
            config.isDelete && (this.isDelete = config.isDelete);
            // config.linkItem && (this.linkItem = config.linkItem);
            config.linkAttribute&&(this.linkAttribute=config.linkAttribute)
        }

    }

}

/**
 * 单选按钮
 */
class RadioInput {

    constructor(config) {
        this.list = [];
        if (config) {
            if (config.list) {
                for (let itemConfig of config.list) {
                    this.loadItem(itemConfig);
                }
            }
        } else {
            this.addItem();
        }
    }

    /**
     * 加载选项
     * @param config
     * @returns {ChooseItem}
     */
    loadItem(config) {
        let chooseItem = new ChooseItem(config);
        this.list.push(chooseItem);
        return chooseItem;
    }

    /**
     * 新增选项
     * @param targetIndex
     * @param dropPosition
     * @returns {ChooseItem}
     */
    addItemWithPosition(targetIndex, dropPosition) {
        let chooseItem = new ChooseItem();
        addItemWithPosition(targetIndex, dropPosition, this.list, chooseItem);
        return chooseItem;
    }

    addItem(){
        let chooseItem = new ChooseItem();
        addItem(chooseItem, this.list);
        return chooseItem;
    }

    /**
     * 删除选项
     * @param index
     * @returns {*}
     */
    deleteItem(index) {
        if (index < this.list.length) {
            let chooseItem = this.list[index];
            if (chooseItem) {
                chooseItem.isDelete = true;
                return chooseItem;
            }
        }
    }

    /**
     * 移动选项
     * @param targetIndex
     * @param dropPosition
     * @param srcIndex
     */
    moveItem(targetIndex, dropPosition, srcIndex) {
        moveItem(targetIndex, dropPosition, srcIndex, this.list);
    }

}

/**
 * 多选按钮
 */
class CheckBoxInput {
    constructor(config) {
        this.list = [];
        if (config) {
            if (config.list) {
                for (let itemConfig of config.list) {
                    this.loadItem(itemConfig);
                }
            }
        } else {
            this.addItem();
        }
    }

    /**
     * 加载选项
     * @param config
     * @returns {ChooseItem}
     */
    loadItem(config) {
        let chooseItem = new ChooseItem(config);
        this.list.push(chooseItem);
        return chooseItem;
    }

    /**
     * 新增选项
     * @param targetIndex
     * @param dropPosition
     * @returns {ChooseItem}
     */
    addItemWithPosition(targetIndex, dropPosition) {
        let chooseItem = new ChooseItem();
        addItemWithPosition(targetIndex, dropPosition, this.list, chooseItem);
        return chooseItem;
    }

    addItem(){
        let chooseItem = new ChooseItem();
        addItem(chooseItem, this.list);
        return chooseItem;
    }

    /**
     * 删除选项
     * @param index
     * @returns {*}
     */
    deleteItem(index) {
        if (index < this.list.length) {
            let chooseItem = this.list[index];
            if (chooseItem) {
                chooseItem.isDelete = true;
                return chooseItem;
            }
        }
    }

    /**
     * 移动选项
     * @param targetIndex
     * @param dropPosition
     * @param srcIndex
     */
    moveItem(targetIndex, dropPosition, srcIndex) {
        moveItem(targetIndex, dropPosition, srcIndex, this.list);
    }
}

/**
 * 图片上传
 */
class ImageUpload {
    constructor(config) {
        this.multiple = false;
        this.max = 9;
        if (config) {
            config.multiple && (this.multiple = config.multiple);
            config.max && (this.max = config.max);
        }
    }
}

/**
 * 文件上传
 */
class FileUpload {
    constructor(config) {
        this.multiple = false;
        this.max = 9;
        if (config) {
            config.multiple && (this.multiple = config.multiple);
            config.max && (this.max = config.max);
        }
    }
}

/**
 * 富文本展示
 */
class ImageTextPreview {
    constructor(config) {
        this.content = '富文本展示内容';

        if (config) {
            config.content && (this.content = config.content);
        }
    }
}


/**
 * 关联字段
 */
class LinkText {

    constructor(config) {
        this.list = [];
        if (config) {
            if (config.list) {
                for (let itemConfig of config.list) {
                    this.loadItem(itemConfig);
                }
            }
        } else {
            this.addItem();
        }
    }

    /**
     * 加载选项
     * @param config
     * @returns {ChooseItemLink}
     */
    loadItem(config) {
        let chooseItem = new ChooseItemLink(config);
        this.list.push(chooseItem);
        return chooseItem;
    }

    /**
     * 新增选项
     * @param targetIndex
     * @param dropPosition
     * @returns {ChooseItemLink}
     */
    addItemWithPosition(targetIndex, dropPosition) {
        let chooseItem = new ChooseItemLink();
        addItemWithPosition(targetIndex, dropPosition, this.list, chooseItem);
        return chooseItem;
    }

    addItem(){
        let chooseItem = new ChooseItemLink();
        addItem(chooseItem, this.list);
        return chooseItem;
    }

    /**
     * 删除选项
     * @param index
     * @returns {*}
     */
    deleteItem(index) {
        if (index < this.list.length) {
            let chooseItem = this.list[index];
            if (chooseItem) {
                chooseItem.isDelete = true;
                this.list.splice(index,1);
                return chooseItem;
            }
        }
    }

    /**
     * 移动选项
     * @param targetIndex
     * @param dropPosition
     * @param srcIndex
     */
    moveItem(targetIndex, dropPosition, srcIndex) {
        moveItem(targetIndex, dropPosition, srcIndex, this.list);
    }

}

/**
 * 构建一个fileType对象
 * @param fileType
 * @param config
 */
export function getFieldTypeConfig(fileType, config) {

    switch (fileType) {
        case FIELD_TYPE.SIMPLE_TEXT_INPUT.code:
            return new SimpleTextInput(config);
        case FIELD_TYPE.MULTI_TEXT_INPUT.code:
            return new MultiTextInput(config);
        case FIELD_TYPE.DATE_TIME_INPUT.code:
            return new DateTimeInput(config);
        case FIELD_TYPE.RADIO_INPUT.code:
            return new RadioInput(config);
        case FIELD_TYPE.CHECKBOX_INPUT.code:
            return new CheckBoxInput(config);
        case FIELD_TYPE.IMAGE_UPLOAD.code:
            return new ImageUpload(config);
        case FIELD_TYPE.FILE_UPLOAD.code:
            return new FileUpload(config);
        case FIELD_TYPE.IMAGE_TEXT_PREVIEW.code:
            return new ImageTextPreview(config);
        case FIELD_TYPE.SCHOOL_CARD_ID.code:
            return new SimpleTextInput(config);
        case FIELD_TYPE.LINK_TEXT.code:
            return new LinkText(config);
        default:
            throw new Error('不支持的字段类型：' + fileType);
    }
}

/**
 * 构建一个fileType对象
 * @param fileType
 */
export function getModuleName(fileType) {

    switch (fileType) {
        case FIELD_TYPE.SIMPLE_TEXT_INPUT.code:
            return 'FormNormalTextInput';
        case FIELD_TYPE.MULTI_TEXT_INPUT.code:
            return 'FormMultipleTextInput';
        case FIELD_TYPE.DATE_TIME_INPUT.code:
            return 'FormDatetimeInput';
        case FIELD_TYPE.RADIO_INPUT.code:
            return 'FormRadios';
        case FIELD_TYPE.CHECKBOX_INPUT.code:
            return 'FormCheckboxes';
        case FIELD_TYPE.IMAGE_UPLOAD.code:
            return 'FormImageUpload';
        case FIELD_TYPE.FILE_UPLOAD.code:
            return 'FormImageUpload';
        case FIELD_TYPE.IMAGE_TEXT_PREVIEW.code:
            return 'FormImageTextPreview';
        case FIELD_TYPE.LINK_TEXT.code:
            return 'linkText';
        default:
            throw new Error('不支持的字段类型：' + fileType);
    }
}

export const commonFields = [
    {
        type: 1,
        moduleName: 'formInput',
        icon: 'el-icon-user-solid',
        title: '姓名',
        isRequire: true,
        typeConfig:{
            isOpenMatch: false,
            placeholder: '请输入姓名'
        }
    },
    {
        type: 4,
        moduleName: 'formRadioGroup',
        icon: 'el-icon-male',
        title: '性别',
        isRequire: true,
        typeConfig:{
            list:[
                {code: 'man',content:'男',type:1,isDelete:false},
                {code: 'woman',content:'女',type:1,isDelete: false}
            ]
        }
    },
    {
        type: 1,
        moduleName: 'formInput',
        icon: 'el-icon-mobile-phone',
        title: '手机号',
        isRequire: true,
        typeConfig:{
            isOpenMatch: true,
            placeholder: '请输入中国大陆手机号',
            matchType: 1,
            matchString: getMatchString(1)
        }
    },
    {
        type: 1,
        moduleName: 'formInput',
        icon: 'el-icon-message',
        title: '邮箱',
        isRequire: true,
        typeConfig:{
            isOpenMatch: true,
            placeholder: '请输入电子邮箱地址',
            matchType: 2,
            matchString: getMatchString(3)
        }
    },
    {
        type: 1,
        moduleName: 'formInput',
        icon: 'el-icon-coin',
        title: '金额',
        isRequire: true,
        typeConfig:{
            isOpenMatch: true,
            placeholder: '请输入金额',
            matchType: 4,
            matchString: getMatchString(4)
        }
    },
    {
        type: 9,
        moduleName: 'formInput',
        icon: 'el-icon-bank-card',
        title: 'ID',
        isRequire: false,
        typeConfig:{
            isOpenMatch: false,
            placeholder: '请输入ID',
            IDRule:'{{08}}{{field-788c1443-a952-11ea-9fd1-051f8a4ab526}}{{field-788c1442-a952-11ea-9fd1-051f8a4ab526}}{{自增}}'
        }
    },
];
