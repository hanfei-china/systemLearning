import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsButton extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '按钮';
        super('wsButton', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute() {

        let contentGroup = new AttributeGroup('contentGroup', '文本内容');

        let content = new Attribute('文本内容', 'text', '按钮').addAttributes({
            type: 'textarea',
            resize: 'none',
            rows: 4,
            placeholder: '请输入文本内容'
        }).hiddenTitle();

        contentGroup.setAttributes({content});

        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let layout = new Attribute('布局设置', 'layout', {
            width: 100,
            height: 48,
            left: 509,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position: {show: false},
        });

        layoutGroup.setAttributes({layout});

        let fontGroup = new AttributeGroup('fontGroup', '字体设置');

        let font = new Attribute('字体设置', 'font', {
            fontSize: '12px',
            color: '#FFFFFF',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'center',
        }).hiddenTitle();

        fontGroup.setAttributes({font});


        let styleGroup = new AttributeGroup('styleGroup', '样式设置');

        let backgroundColor = new Attribute('背景色', 'color', 'rgba(64, 158, 255, 1)').addAttributes({
            showAlpha: true,
            titleStyle: {
                width: '40px',
                paddingRight: '6px'
            }
        });
        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 4,
            rightTop: 4,
            leftBottom: 4,
            rightBottom: 4,
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


        styleGroup.setAttributes({backgroundColor, border, borderRadius});

        let linkConfig = new Attribute('链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 1, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).hiddenTitle();

        let linkGroup = new AttributeGroup('linkGroup', '链接设置').setAttributes({
            linkConfig
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

        let attributes = {contentGroup, linkGroup, layoutGroup, fontGroup, styleGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position: { left: number, top: number }) {
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }


    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        if (!version) {
            attributes = {
                contentGroup: {
                    content: moduleConfig.attributes.content
                },
                linkGroup: {
                    linkConfig: {
                        target: moduleConfig.attributes.linkConfig.target,
                        linkType: moduleConfig.attributes.linkConfig.linkType,
                        linkUrl: moduleConfig.attributes.linkConfig.linkUrl,
                        pagePath: moduleConfig.attributes.linkConfig.pagePath,
                        pageParamType: moduleConfig.attributes.linkConfig.pageParamType,
                        contentId: moduleConfig.attributes.linkConfig.contentId,
                        classId: moduleConfig.attributes.linkConfig.classId,
                        labelId: moduleConfig.attributes.linkConfig.labelId,
                    },
                },
                layoutGroup: {
                    layout: {
                        width: moduleConfig.attributes.width,
                        height: moduleConfig.attributes.height,
                        left: moduleConfig.attributes.left,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex
                    }
                },
                fontGroup: {
                    font: {
                        fontSize: moduleConfig.attributes.fontSize,
                        color: moduleConfig.attributes.color,
                        italic: false,
                        bold: false,
                        textDecoration: moduleConfig.attributes.textDecoration,
                        fontFamily: moduleConfig.attributes.fontFamily,
                        textAlign: 'center',
                    },
                },
                styleGroup: {
                    backgroundColor: moduleConfig.attributes.backgroundColor,
                    borderRadius: {
                        leftTop: moduleConfig.attributes.borderRadius,
                        rightTop: moduleConfig.attributes.borderRadius,
                        leftBottom: moduleConfig.attributes.borderRadius,
                        rightBottom: moduleConfig.attributes.borderRadius,
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
