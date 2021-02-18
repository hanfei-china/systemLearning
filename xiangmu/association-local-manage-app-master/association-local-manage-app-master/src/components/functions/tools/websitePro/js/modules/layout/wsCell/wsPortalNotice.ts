import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem} from '../../../util/arrayUtil';

export default class WsPortalNotice extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '图文列表';
        super('wsPortalNotice', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {

        let showIcon = new Attribute('显示图标', 'checkbox', false).addAttributes({
            content: '显示图标'
        }).hiddenTitle();

        let iconHeight = new Attribute('图标高度', 'number', 18).addAttributes({
            titleStyle:{
                paddingRight: '10px',
                width: '65px',
                textAlign: 'right'
            }
        });

        let iconMarginRight = new Attribute('图标右边距', 'number', 4).addAttributes({
            titleStyle:{
                paddingRight: '10px',
                width: '65px',
                textAlign: 'right'
            }
        });

        let icon = new Attribute('上传图标','image','').addAttributes({
            titleStyle:{
                paddingRight: '10px',
                width: '65px',
                textAlign: 'right'
            }
        });

        let iconGroup = new AttributeGroup('iconGroup', '图标设置').setAttributes({
            showIcon, iconHeight, iconMarginRight,icon,
        });


        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', '图文列表').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let font = new Attribute('标题字体设置', 'font', {
            fontSize: '14px',
            color: '#5F6061',
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

        let titlePadding = new Attribute('标题容器内边距', 'padding', {
            top: 8,
            bottom: 8,
            left: 18,
            right: 18,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBorderRadius = new Attribute('标题容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBorder = new Attribute('标题容器边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: '#f0f0f0',
                borderWidth: 1,
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
        }).setShowMode(() => {
            return showTitle.value === true;
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
            return showTitle.value === true;
        });

        let titleGroup = new AttributeGroup('titleGroup', '标题设置').setAttributes({
            showTitle, title, font, titlePadding, titleBorderRadius, titleBorder, titleBackground
        });


        let mainPadding = new Attribute('内容容器内边距', 'padding', {
            top: 8,
            bottom: 8,
            left: 18,
            right: 18,
        });

        let mainBorderRadius = new Attribute('内容容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let mainBorder = new Attribute('内容容器边框', 'border', {
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
        });

        let mainBackground = new Attribute('内容容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let mainGroup = new AttributeGroup('mainGroup', '内容设置')
            .setAttributes({mainPadding,mainBorderRadius,mainBorder,mainBackground});


        let pageable = new Attribute('开启分页', 'checkbox', true).addAttributes({
            content: '开启分页'
        }).hiddenTitle();

        let pageablePadding = new Attribute('分页容器内边距', 'padding', {
            top: 8,
            bottom: 8,
            left: 18,
            right: 18,
        }).setShowMode(() => {
            return pageable.value === true;
        });

        let pageableBorderRadius = new Attribute('分页容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return pageable.value === true;
        });

        let pageableBorder = new Attribute('分页容器边框', 'border', {
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
        }).setShowMode(() => {
            return pageable.value === true;
        });

        let pageableBackground = new Attribute('分页容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        }).setShowMode(() => {
            return pageable.value === true;
        });

        let pageableGroup = new AttributeGroup('pageableGroup', '分页设置')
            .setAttributes({pageable,pageablePadding,pageableBorderRadius,pageableBorder,pageableBackground});

        let background = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '#FFFFFF',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 4,
            rightTop: 4,
            leftBottom: 2,
            rightBottom: 2,
        });

        let border = new Attribute('边框', 'border', {
            top: {
                borderColor: '#ebeef5',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: '#ebeef5',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            left: {
                borderColor: '#ebeef5',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            right: {
                borderColor: '#ebeef5',
                borderWidth: 1,
                borderStyle: 'solid'
            },
        });

        let boxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });

        let containerGroup = new AttributeGroup('containerGroup', '容器设置').setAttributes({
            background,borderRadius,border,boxShadow
        });


        let funcType = new Attribute('单元格功能', 'select', 'portalCellContentList').addAttributes({
            options: [
                {id: 'portalCellContentList', label: '内容列表'},
                {id: 'portalCellNoticeList', label: '消息通知'},
            ],
            titleStyle: {
                paddingRight: '10px',
                textAlign: 'right',
                width: '78px'
            }
        });

        let contentClass = new Attribute('内容分类', 'contentClass', '').addAttributes({
            titleStyle: {
                paddingRight: '10px',
                textAlign: 'right',
                width: '78px'
            }
        }).setShowMode(() => {
            return funcType.value === 'portalCellContentList';
        });


        let pageSize = new Attribute('每页查询数量', 'number', 10).addAttributes({
            titleStyle: {
                paddingRight: '10px',
                textAlign: 'right',
            }
        });


        let funcGroup = new AttributeGroup('funcGroup', '功能设置')
            .setAttributes({funcType, contentClass, pageSize});

        let attributes = {
            iconGroup,
            titleGroup,
            mainGroup,
            pageableGroup,
            containerGroup,
            funcGroup
        };

        this.setAttributes(attributes);
    }

    setPosition() {
        return this;
    }

    syncModules(modules ?: Array<any>) {
        if (modules) {
            for (let module of modules) {
                this.loadModule(module);
            }
        }
        return this;
    }

    loadModule(module: { id: any, title: any, [id: string]: any }) {
        addItem(moduleBuilder(module.name, module), this.modules);
    }

    formatModuleConfig(moduleConfig: any) {
        let attributes = moduleConfig.attributes;

        this.syncAttributes(attributes);
        this.syncModules(moduleConfig.modules);
    }
}
