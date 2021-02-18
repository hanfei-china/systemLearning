import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsWheelPlanting extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '轮播图';
        super('wsWheelPlanting', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute() {
        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let layout = new Attribute('布局设置', 'layout', {
            width: 400,
            height: 400,
            left: 0,
            top: 0,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position: {show: false},
            width: {show: false},
            left: {show: false}
        });

        layoutGroup.setAttributes({layout});

        let viewGroup = new AttributeGroup('viewGroup', '显示设置');

        let page = new Attribute('分页设置', 'page', {
            pageable: true,
            pageSize: 10
        }).addAttributes({
            hiddenPageable: true
        }).hiddenTitle();

        let autoplay = new Attribute('自动播放', 'checkbox', true).addAttributes({
            content: '自动播放'
        }).hiddenTitle();

        let navigable = new Attribute('启用导航', 'checkbox', true).addAttributes({
            content: '启用导航'
        }).hiddenTitle();

        let pageable = new Attribute('启用分页', 'checkbox', true).addAttributes({
            content: '启用分页'
        }).hiddenTitle();

        let showContent = new Attribute('显示轮播项内容', 'checkbox', true).addAttributes({
            content: '显示轮播项内容'
        }).hiddenTitle();

        let itemBackgroundColor = new Attribute('轮播项背景色', 'color', 'rgba(0, 164, 255, .6)').addAttributes({
            titleStyle: {
                paddingRight: '6px'
            }
        });

        viewGroup.setAttributes({page, autoplay, navigable, pageable, showContent, itemBackgroundColor});

        let moreConfig = new Attribute('标签链接设置', 'link', {
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

        let linkGroup = new AttributeGroup('linkGroup', '链接设置').setAttributes({
            moreConfig, itemClickConfig
        });


        let otherGroup = new AttributeGroup('otherGroup', '其他设置');

        let customClasses = new Attribute('class', 'text', '').addAttributes({
            placeholder: '自定义class',
            titleStyle: {
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
        }).hiddenTitle();

        let dataSrcGroup = new AttributeGroup('dataSrcGroup', '数据源设置').setAttributes({dataSrc});


        let attributes = {dataSrcGroup, linkGroup, viewGroup, layoutGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position: { top: number }) {
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;

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
                    moreConfig: {
                        target: moduleConfig.attributes.moreConfig.target,
                        linkType: moduleConfig.attributes.moreConfig.linkType,
                        linkUrl: moduleConfig.attributes.moreConfig.linkUrl,
                        pagePath: moduleConfig.attributes.moreConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    },
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
                viewGroup:{
                    page:{
                        pageable: true,
                        pageSize: moduleConfig.attributes.pageSize
                    },
                    autoplay: moduleConfig.attributes.autoplay,
                    navigable: moduleConfig.attributes.navigable,
                    pageable: moduleConfig.attributes.pageable,
                    showContent: moduleConfig.attributes.showContent
                },
                layoutGroup: {
                    layout: {
                        width: moduleConfig.attributes.width,
                        height: moduleConfig.attributes.height,
                        left: 0,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex
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
