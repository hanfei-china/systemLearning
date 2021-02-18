import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsRichText extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '图文展示';
        super('wsRichText',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let showTitle = new Attribute('','checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let titleFont = new Attribute('标题字体设置','font',{
            fontSize: '24px',
            color: '#333333',
            italic: false,
            bold: true,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        }).setShowMode(()=>{
            return showTitle.value === true;
        });

        let titlePadding =  new Attribute('标题内边距', 'padding', {
            top: 10,
            bottom: 12,
            left: 0,
            right: 0,
        }).setShowMode(()=>{
            return showTitle.value === true;
        });

        let titleGroup = new AttributeGroup('titleGroup','标题设置').setAttributes({showTitle, titleFont, titlePadding});


        let showTime = new Attribute('显示时间','checkbox', true).addAttributes({
            content: '显示时间'
        }).hiddenTitle();

        let timeFont = new Attribute('时间字体设置','font',{
            fontSize: '12px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        }).setShowMode(()=>{
            return showTime.value === true;
        });

        let timePadding =  new Attribute('标题内边距', 'padding', {
            top: 0,
            bottom: 15,
            left: 0,
            right: 0,
        }).setShowMode(()=>{
            return showTime.value === true;
        });

        let timeGroup = new AttributeGroup('timeGroup','时间设置').setAttributes({showTime, timeFont, timePadding});


        let showDivingLine = new Attribute('显示分割线','checkbox', true).addAttributes({
            content: '显示分割线'
        }).hiddenTitle();

        let divingLineStyle = new Attribute('分割线样式', 'unifiedBorder', {
            borderColor: '#cccccc',
            borderWidth: 1,
            borderStyle: 'solid'
        }).setShowMode(()=>{
            return showDivingLine.value === true;
        });

        let divingLinePadding =  new Attribute('分割线内边距', 'padding', {
            top: 0,
            bottom: 10,
            left: 0,
            right: 0,
        }).setShowMode(()=>{
            return showDivingLine.value === true;
        });

        let divingLineGroup = new AttributeGroup('divingLineGroup','分割线设置').setAttributes({showDivingLine, divingLineStyle, divingLinePadding});

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 400,
            height: 500,
            left: 509,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        layoutGroup.setAttributes({layout});


        let styleGroup = new AttributeGroup('styleGroup','样式设置');

        let background = new Attribute('背景设置','background',{
            backgroundImage:'',
            backgroundColor:'',
            backgroundPositionX:'center',
            backgroundPositionY:'center',
            backgroundSize:'auto',
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


        styleGroup.setAttributes({background, border, borderRadius, padding, boxShadow});


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

        let dataSrc = new Attribute('数据源设置', 'articleDataSrc', {
            dataSrc: 1, //数据来源，1：模块设置 2：页面参数
            contentId: '',
        }).hiddenTitle();

        let dataSrcGroup =  new AttributeGroup('dataSrcGroup','数据源设置').setAttributes({dataSrc});


        let attributes = {dataSrcGroup, titleGroup, timeGroup, divingLineGroup, layoutGroup, styleGroup, otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    setHeight(height: number){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.height = height;

        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        if (!version) {
            attributes = {
                dataSrcGroup: {
                    dataSrc: {
                        dataSrc: moduleConfig.attributes.dataSrc,
                        contentId: moduleConfig.attributes.contentId,
                    }
                },
                titleGroup: {
                    showTitle: moduleConfig.attributes.showTitle,
                    titleFont: {
                        fontSize: moduleConfig.attributes.titleConfig.fontSize,
                        color: moduleConfig.attributes.titleConfig.color,
                        italic: moduleConfig.attributes.titleConfig.fontStyle,
                        bold: moduleConfig.attributes.titleConfig.fontWeight,
                        textDecoration: false,
                        fontFamily: moduleConfig.attributes.titleConfig.fontFamily,
                        textAlign: 'center',
                    },
                    titlePaddingBottom: moduleConfig.attributes.titleConfig.paddingBottom
                },
                timeGroup:{
                    showTime: moduleConfig.attributes.showTime,
                    timeFont: {
                        fontSize: moduleConfig.attributes.timeConfig.fontSize,
                        color: moduleConfig.attributes.timeConfig.color,
                        italic: moduleConfig.attributes.timeConfig.fontStyle,
                        bold: moduleConfig.attributes.timeConfig.fontWeight,
                        textDecoration: false,
                        fontFamily: moduleConfig.attributes.timeConfig.fontFamily,
                        textAlign: 'left',
                    },
                    timePaddingBottom: moduleConfig.attributes.timeConfig.paddingBottom
                },
                divingLineGroup:{
                    showDivingLine: moduleConfig.attributes.showDivingLine,
                    divingLineStyle:{
                        borderColor: moduleConfig.attributes.divingLineConfig.color,
                        borderWidth: moduleConfig.attributes.divingLineConfig.width,
                        borderStyle: moduleConfig.attributes.divingLineConfig.style
                    }
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
