import Module from '../Module';
import Attribute from "../Attribute";
import {ROW_BANNER} from '../../config/defaultImages';

/**
 * 首页轮播图
 */
export default class HomeBanner extends Module{

    constructor(config){
        super('homeBanner');

        let title, funcType, listStyle, contentClass, queryMode, dataMaxCount, defaultImg, isLoadByBranchId, height;

        title = new Attribute('textAttr','轮播图')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题',
                maxLength: 10,
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

        height = new Attribute('numberAttr',166).addAttributes({
            title: '容器高度',
            max: Infinity
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


        let attributes = {title, funcType, listStyle, contentClass, queryMode, dataMaxCount, defaultImg, isLoadByBranchId, height};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
