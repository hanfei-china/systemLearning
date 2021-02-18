import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem} from '../../../util/arrayUtil';

export default class WsPortalButton extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '按钮';
        super('wsPortalButton', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {
        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', '按钮').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titlePadding = new Attribute('标题容器内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let font = new Attribute('标题字体设置', 'font', {
            fontSize: '14px',
            color: '#409EFF',
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
            .setAttributes({showTitle, title, titlePadding, font});

        let showIcon = new Attribute('显示图标', 'checkbox', true).addAttributes({
            content: '显示图标'
        }).hiddenTitle();

        let icon = new Attribute('上传图标','image','')
            .setShowMode(() => {
                return showIcon.value === true;
            }).addAttributes({
                titleStyle:{
                    paddingRight: '10px',
                    textAlign: 'right'
                }
            });

        let iconPadding = new Attribute('图标容器内边距', 'padding', {
            top: 7,
            bottom: 0,
            left: 0,
            right: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let iconGroup = new AttributeGroup('iconGroup', '图标设置')
            .setAttributes({showIcon, icon, iconPadding});

        let background = new Attribute('背景', 'background', {
            backgroundImage: '',
            backgroundColor: '#FFFFFF',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let padding = new Attribute('容器内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let border = new Attribute('边框', 'border', {
            top: {
                borderColor: '#ebeef5',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: '#ebeef5',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: '#ebeef5',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: '#ebeef5',
                borderWidth: 0,
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
            background,padding,borderRadius,border,boxShadow
        });

        let funcType = new Attribute('按钮功能', 'select', 'menu').addAttributes({
            options: [
                {id: 'link', label: '外部链接'},
                {id: 'menu', label: '系统菜单'},
            ],
            titleStyle: {
                paddingRight: '6px',
                textAlign: 'right',
            }
        });

        let linkAddress = new Attribute('链接地址', 'text', '').addAttributes({
            placeholder: '请输入链接地址，需包含https://或http://',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return funcType.value === 'link';
        });

        let menuId = new Attribute('系统菜单', 'menu', '').addAttributes({
            titleStyle: {
                paddingRight: '6px',
                textAlign: 'right',
            }
        }).setShowMode(()=>{
            return funcType.value === 'menu';
        });

        let linkTarget = new Attribute('打开方式', 'select', '_self').addAttributes({
            options: [
                {id: '_self', label: '当前窗口'},
                {id: '_blank', label: '新窗口'},
            ],
            titleStyle: {
                paddingRight: '6px',
                textAlign: 'right',
            }
        });

        let funcGroup = new AttributeGroup('funcGroup', '功能设置').setAttributes({
            funcType, linkAddress, menuId, linkTarget
        });


        this.setAttributes({titleGroup,iconGroup,containerGroup,funcGroup})
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
