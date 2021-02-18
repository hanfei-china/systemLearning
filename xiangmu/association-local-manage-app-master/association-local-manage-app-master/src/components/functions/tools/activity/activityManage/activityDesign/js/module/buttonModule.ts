import Module from '../base/module';

import AttributeGroup from '../base/attributeGroup';

import Attribute from '../base/attribute';

export default class ButtonModule extends Module{

    constructor(name: string, id: string, icon: string, title: string,
                iconBackgroundColor:string, isActivityModule :boolean = true) {
        super('buttonModule',name,id,icon,title,isActivityModule);

        this.initAttribute(icon,title,iconBackgroundColor);
    }

    initAttribute(defaultIcon:string,defaultTitle:string, defaultIconBackgroundColor:string){

        let hidden = new Attribute('隐藏模块', 'checkbox', false).addAttributes({
            content: '隐藏模块'
        }).hiddenTitle();

        let moduleGroup = new AttributeGroup('moduleGroup', '模块设置')
            .setAttributes({hidden});


        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', defaultTitle).addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
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

        let titleGroup = new AttributeGroup('titleGroup', '标题设置')
            .setAttributes({showTitle, title, font});

        let showIcon = new Attribute('显示图标', 'checkbox', true).addAttributes({
            content: '显示图标'
        }).hiddenTitle();

        let icon = new Attribute('上传图标','image',defaultIcon)
            .addAttributes({
                placeholder: '建议使用34*30或等比例的图片作为图标'
            })
            .setShowMode(() => {
                return showIcon.value === true;
            });

        let iconBackgroundColor = new Attribute('图标背景色', 'color', defaultIconBackgroundColor).addAttributes({
            showAlpha: true,
            titleStyle: {
                width: '70px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showIcon.value === true;
        });

        let iconBorderRadius = new Attribute('图标圆角', 'radius', {
            leftTop: 23,
            rightTop: 23,
            leftBottom: 23,
            rightBottom: 23,
        }).setShowMode(() => {
                return showIcon.value === true;
            });

        let iconBorder = new Attribute('图标边框', 'border', {
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
        }).setShowMode(() => {
                return showIcon.value === true;
            });

        let iconGroup = new AttributeGroup('iconGroup', '图标设置')
            .setAttributes({showIcon, icon, iconBackgroundColor, iconBorderRadius, iconBorder});

        let containerBackgroundColor = new Attribute('容器背景色', 'color', 'rgba(255, 255, 255, 1)').addAttributes({
            showAlpha: true,
            titleStyle: {
                width: '70px',
                paddingRight: '6px'
            }
        });

        let containerBorderRadius = new Attribute('容器圆角', 'radius', {
            leftTop: 4,
            rightTop: 4,
            leftBottom: 4,
            rightBottom: 4,
        });

        let containerBorder = new Attribute('容器边框', 'border', {
            top:{
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
        });

        let containerBoxShadow = new Attribute('容器阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });

        let containerGroup = new AttributeGroup('containerGroup', '容器设置')
            .setAttributes({containerBackgroundColor, containerBorderRadius, containerBorder, containerBoxShadow});

        let funcType = new Attribute('功能类型', 'mpFuncType', null).addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            },
            clearable: false,
            supportFuncType: [0, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        });

        let appId = new Attribute('textAttr','text','')
            .addAttributes({
                title: '小程序AppID',
                placeholder: '请输入小程序AppID'
            }).setShowMode(()=>{
                return funcType.value === 34;
            });

        let link = new Attribute('链接地址', 'text', '').addAttributes({
            placeholder: '请输入链接地址，链接需关联在小程序的业务域名中',
            type: 'textarea',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return funcType.value === 4;
        });

        let contentClass = new Attribute('图文分类', 'mpContentClass', '').addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return funcType.value ===  0;
        });

        let counselClass = new Attribute('咨询分类', 'mpCounselClass', '').addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return funcType.value === 25;
        });

        let content = new Attribute('图文选择', 'mpContent', '').addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return funcType.value === 2;
        });

        let memberQueryBuilders = new Attribute('通讯录页签','mpMemberQueryBuilder', {tabItems:[]})
            .addAttributes({
                titleStyle: {
                    width: '65px',
                    paddingRight: '6px'
                },
            })
            .setShowMode(() => {
                return funcType.value === 8;
            });

        let onlineForm = new Attribute('表单选择', 'mpOnlineForm', '').addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return funcType.value === 17 || funcType.value === 18;
        });

        let informationExchangeType = new Attribute('信息交换', 'mpCommonGroup', []).addAttributes({
            titleStyle: {
                 width: '65px',
                paddingRight: '6px'
            },
            maxLevel: 1,
            groupType: '4',
            typeName: '分类',
        }).setShowMode(()=>{
            return funcType.value === 7;
        });

        let pagePath = new Attribute('小程序页面','mpPageChoose', '')
            .addAttributes({
                titleStyle: {
                    width: '65px',
                    paddingRight: '6px'
                }
            }).setShowMode(()=>{
                return funcType.value === 26;
            });

        let functionGroup = new AttributeGroup('functionGroup', '功能设置')
            .setAttributes({funcType, appId, link, contentClass,
                counselClass, content, memberQueryBuilders, onlineForm, informationExchangeType, pagePath});

        let privilege = new Attribute('权限设置','mpPrivilege', {
            open: false,
            onlyForMember: false,
            memberType:{
                memberRange: 'all',
                memberTypes: [],
                blacklist: []
            }
        }).addAttributes({
            title: '按钮权限设置'
        }).hiddenTitle();

        let privilegeGroup = new AttributeGroup('privilegeGroup', '权限控制')
            .setAttributes({privilege});

        let attributes;

        if(this.name === 'customFunction'){
            attributes = {moduleGroup, functionGroup, privilegeGroup,titleGroup, iconGroup, containerGroup};
        }else{
            attributes = {moduleGroup, titleGroup, iconGroup, containerGroup};
        }

        this.setAttributes(attributes);
    }
}
