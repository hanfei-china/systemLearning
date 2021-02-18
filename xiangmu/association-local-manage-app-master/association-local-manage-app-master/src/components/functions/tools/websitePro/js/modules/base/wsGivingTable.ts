import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';



export default class WsGivingTable extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '捐赠表格';
        super('WsGivingTable', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute() {
        let formDataGroup = new AttributeGroup('formDataGroup', '表单列表设置')
        let formDataSrc = new Attribute('列表数据', 'formDataSrc', {
            classId: '',
            formId: '',
            tagProp: '',
            titleProp: '',
            dataProps: [],
            linkProp: {},
        });
        formDataGroup.setAttributes({formDataSrc})
        let titleGroup = new AttributeGroup('titleGroup', '标题设置');

        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let showMore = new Attribute('显示更多', 'checkbox', true).addAttributes({
            content: '显示更多'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', '文章列表').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let moreContent = new Attribute('更多内容', 'text', ' +更多').addAttributes({
            placeholder: '请输入更多内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showMore.value === true;
        });

        let font = new Attribute('标题字体设置', 'font', {
            fontSize: '14px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'center',
        }).addAttributes({
            textAlign: {show: false}
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let moreFont = new Attribute('更多字体设置', 'font', {
            fontSize: '12px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'center',
        }).addAttributes({
            textAlign: {show: false}
        }).setShowMode(() => {
            return showMore.value === true;
        });

        let titleBackground = new Attribute('标题容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titleBorderRadius = new Attribute('标题容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titlePadding = new Attribute('标题容器内边距', 'padding', {
            top: 8,
            bottom: 8,
            left: 16,
            right: 16,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titleBorder = new Attribute('标题容器边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        titleGroup.setAttributes({
            showTitle, showMore, title, moreContent, font,
            moreFont, titleBackground, titlePadding, titleBorder, titleBorderRadius
        });

        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let layout = new Attribute('布局设置', 'layout', {
            width: 400,
            height: 300,
            left: 509,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position: {show: false},
            height: {show: false}
        });

        layoutGroup.setAttributes({layout});



        let styleGroup = new AttributeGroup('styleGroup', '样式设置');

        let background = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let padding = new Attribute('内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        });

        let border = new Attribute('边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        });

        let boxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });


        styleGroup.setAttributes({background, border, borderRadius, padding, boxShadow});

        let moreConfig = new Attribute('更多/标签链接设置', 'link', {
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
                width: '58px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let carryRouter = new Attribute('携带路由', 'checkbox', true).addAttributes({
            content: '携带路由'
        }).hiddenTitle();

        let routerType = new Attribute('路由类型', 'select','1').addAttributes({
            options: [
                {id: '1',label:'当前页面'},
                {id: '2',label:'自定义'},
            ],
            titleStyle: {
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value;
        });

        let pageHeader = new Attribute('页头选择','pageHeader2','').addAttributes({
            titleStyle: {
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value && routerType.value === '1';
        });

        let menuId = new Attribute('路由id', 'text', '').addAttributes({
            placeholder: '请输入自定义路由id',
            titleStyle: {
                width: '54px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value && routerType.value === '2';
        });

        otherGroup.setAttributes({customClasses,carryRouter,routerType,pageHeader,menuId});

        let dataSrc = new Attribute('数据源设置', 'articleListDataSrc', {
            dataSrc: 1, //数据来源，1：模块设置 2：页面参数
            classId: '',
            labelId: '',
            hot: false
        }).hiddenTitle();

        let dataSrcGroup = new AttributeGroup('dataSrcGroup', '数据源设置').setAttributes({dataSrc});


        let attributes = {
            formDataGroup,
            dataSrcGroup,
            linkGroup,
            titleGroup,
            layoutGroup,
            styleGroup,
            otherGroup
        };

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
                formDataGroup: {
                    formDataSrc: moduleConfig.attributes.formDataSrc,
                },
                dataSrcGroup: {
                    dataSrc: {
                        dataSrc: moduleConfig.attributes.dataSrc,
                        classId: moduleConfig.attributes.classId,
                        labelId: moduleConfig.attributes.labelId,
                    }
                },
                linkGroup: {
                    moreConfig: {
                        target: moduleConfig.attributes.moreConfig.target,
                        linkType: 2,
                        linkUrl: moduleConfig.attributes.moreConfig.linkUrl,
                        pagePath: moduleConfig.attributes.moreConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    },
                    itemClickConfig: {
                        target: moduleConfig.attributes.itemClickConfig.target,
                        linkType: 2,
                        linkUrl: moduleConfig.attributes.itemClickConfig.linkUrl,
                        pagePath: moduleConfig.attributes.itemClickConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    }
                },
                titleGroup: {
                    showTitle: moduleConfig.attributes.showTitle,
                    title: moduleConfig.attributes.titleConfig.title,
                    font: {
                        fontSize: moduleConfig.attributes.titleConfig.fontSize,
                        color: moduleConfig.attributes.titleConfig.color,
                        italic: moduleConfig.attributes.titleConfig.fontStyle,
                        bold: moduleConfig.attributes.titleConfig.fontWeight,
                        textDecoration: false,
                        fontFamily: moduleConfig.attributes.titleConfig.fontFamily,
                        textAlign: 'center',
                    },
                    showMore: moduleConfig.attributes.showMore,
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
