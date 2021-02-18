import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsGreatEvents extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '时间线';
        super('wsGreatEvents',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){
        let viewGroup = new AttributeGroup('viewGroup','显示设置');

        let page = new Attribute('分页设置','page',{
            pageable: true,
            pageSize: 10
        }).hiddenTitle().addAttributes({
            hiddenPageable: true
        });

        viewGroup.setAttributes({page});

        let styleGroup = new AttributeGroup('styleGroup','样式设置');

        let background = new Attribute('背景设置','background',{
            backgroundImage:'http://www.tsinghua.org.cn/publish/alumni/index0/images/timelinebg.jpg',
            backgroundColor:'',
            backgroundPositionX:'center',
            backgroundPositionY:'center',
            backgroundSize:'auto',
            backgroundRepeatX: false,
            backgroundRepeatY: false,
        });

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let border = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        });

        let boxShadow = new Attribute('阴影', 'boxShadow',{
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });

        styleGroup.setAttributes({background, border, borderRadius, boxShadow});

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 400,
            height: 550,
            left: 0,
            top: 0,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
            left:{show:false},
            height: {show:false},
            width: {show: false}
        });

        layoutGroup.setAttributes({layout});


        let itemClickConfig = new Attribute('单个图文链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 2, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).addAttributes({
            hiddenParam: true,
            hiddenLinkType: true
        });

        let linkGroup = new AttributeGroup('linkGroup','链接设置').setAttributes({
            itemClickConfig
        });


        let otherGroup = new AttributeGroup('otherGroup','其他设置');

        let customClasses = new Attribute('class','text','').addAttributes({
            placeholder: '自定义class',
            titleStyle:{
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        otherGroup.setAttributes({customClasses});

        let dataSrc = new Attribute('数据源设置', 'articleListDataSrc', {
            dataSrc: 1, //数据来源，1：模块设置 2：页面参数
            classId: '',
            labelId: '',
        }).hiddenTitle().addAttributes({
            srcHidden: true
        });

        let dataSrcGroup =  new AttributeGroup('dataSrcGroup','数据源设置').setAttributes({dataSrc});

        let attributes = {dataSrcGroup, linkGroup, viewGroup, layoutGroup, styleGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = 0;

        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        if (!version) {
            attributes = {
                dataSrcGroup: {
                    dataSrc: {
                        dataSrc: 1,
                        classId: moduleConfig.attributes.classId,
                        labelId: moduleConfig.attributes.labelId,
                    }
                },
                linkGroup: {
                    itemClickConfig: {
                        target: moduleConfig.attributes.itemClickConfig.target,
                        linkType: moduleConfig.attributes.itemClickConfig.linkType,
                        linkUrl: moduleConfig.attributes.itemClickConfig.linkUrl,
                        pagePath: moduleConfig.attributes.itemClickConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    }
                },
                viewGroup: {
                    page: {
                        pageable: false,
                        pageSize: moduleConfig.attributes.pageSize
                    }
                },
                layoutGroup: {
                    layout: {
                        width: 400,
                        height: 550,
                        left: 0,
                        top: 0,
                        zIndex: moduleConfig.attributes.zIndex
                    }
                },
                styleGroup:{
                    background:{
                        backgroundImage: moduleConfig.attributes.backgroundImage,
                        backgroundColor: moduleConfig.attributes.backgroundColor,
                        backgroundPositionX: moduleConfig.attributes.backgroundPositionX,
                        backgroundPositionY: moduleConfig.attributes.backgroundPositionY,
                        backgroundSize: moduleConfig.attributes.backgroundSize,
                        backgroundRepeatX: moduleConfig.attributes.backgroundRepeatX,
                        backgroundRepeatY: moduleConfig.attributes.backgroundRepeatY,
                    }
                },
                otherGroup: {
                    customClasses: moduleConfig.attributes.customClasses
                }
            }

        } else {
            attributes = moduleConfig.attributes;
        }

        this.syncAttributes(attributes);
    }
}
