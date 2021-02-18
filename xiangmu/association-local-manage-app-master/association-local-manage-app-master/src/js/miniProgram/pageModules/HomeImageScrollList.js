import Module from '../Module';
import Attribute from "../Attribute";
import {ROW_BANNER} from '../../config/defaultImages';

/**
 * 图片滚动排列
 */
export default class HomeImageScrollList extends Module{

    constructor(config){
        super('homeImageScrollList');

        let title, titleColor, titleIcon, titleIconPosition, funcType, listStyle,
            contentClass, queryMode, dataMaxCount, defaultImg, isLoadByBranchId;

        title = new Attribute('textAttr','图片列表-滚动')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，10字以内',
                maxLength: 10,
            });

        titleColor = new Attribute('colorAttr', '#3FCD79')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            });

        titleIcon = new Attribute('imageAttr', '')
            .addAttributes({
                title: '标题图标',
                width: 30,
                height: 30,
                maxSize: 25 * 1024,
                imageStore: null,
                showClear: true,
                isContain: true
            });

        titleIconPosition = new Attribute('selectAttr', 'left')
            .addAttributes({
                title: '标题图标位置',
                items: [
                    {value:'left', title: '标题左侧'},
                    {value:'right', title: '标题右侧'}
                ],
            }).openRequired(() => {
                return true;
            });


        funcType = new Attribute('funcTypeAttr', 0)
            .addAttributes({
                title: '模块支持功能选择',
                supportFuncType: [0],
            }).openRequired(() => {
                return true;
            });

        listStyle =  new Attribute('selectAttr', 0)
            .addAttributes({
                title: '列表样式',
                items: [
                    {value: 0, title: '大图列表'},
                    {value: 1, title: '小图列表'}
                ],
            }).setShowMode(() => {
                return funcType.value === 0;
            });

        contentClass = new Attribute('contentClassAttr','', false)
            .addAttributes({
                title:'内容分类选择',
                showClear: true
            }).setShowMode(()=>{
                return funcType.value === 0;
            }).openRequired(() => {
                if(funcType.value === 0 && (!contentClass.value || contentClass.value === '')){
                    throw new Error('请选择内容分类');
                }
                return true;
            });

        queryMode = new Attribute('selectAttr',0)
            .addAttributes({
                title: '内容查询模式选择',
                items: [
                    {value: 0, title: '按最新发布查询'},
                    {value: 1, title: '按最新置顶查询'}
                ],
            }).setShowMode(()=>{
                return funcType.value === 0;
            });

        dataMaxCount = new Attribute('numberAttr', 4)
            .addAttributes({
                title: '内容最大查询数量',
                min: 2,
                max: 10
            }).setShowMode(()=>{
                return funcType.value === 0;
            });

        defaultImg = new Attribute('imageAttr', ROW_BANNER)
            .addAttributes({
                title: '轮播图默认图',
                width: 280,
                height: 131,
                maxSize: 500*1024,
                imageStore: null,
            }).openRequired(() => {
                if(!defaultImg.value || defaultImg.value === ''){
                    throw new Error('请上传按钮图标');
                }else{
                    return true;
                }
            });

        isLoadByBranchId = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '是否根据分会加载数据',
                content: '根据分会加载数据'
            }).openRequired(() => {
                return true;
            });

        let attributes = {title, titleColor, titleIcon, titleIconPosition, funcType, listStyle,
            contentClass, queryMode, dataMaxCount, defaultImg, isLoadByBranchId};

        this.setAttributes(attributes);
        this.syncAttributes(config);


    }

}
