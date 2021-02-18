import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem,deleteItem} from '../../../util/arrayUtil';

export default class WsCellTitleContainer extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '容器';
        super('wsCellTitleContainer', id, title, '1.0');
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
            backgroundColor: '#FFFFFF',
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

        let mainBackground = new Attribute('内容容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '#FFFFFF',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let mainGroup = new AttributeGroup('mainGroup', '内容设置')
            .setAttributes({mainBackground});

        let containerType = new Attribute('容器类型', 'select', 'normal').addAttributes({
            options: [
                {id: 'normal', label: '普通容器'},
                {id: 'tab', label: '页签容器'},
            ],
            titleStyle: {
                paddingRight: '6px',
                textAlign: 'right',
            }
        }).setShowMode(()=>{
            return false;
        });

        let advancedGroup = new AttributeGroup('advancedGroup', '高级功能').setAttributes({
            containerType
        }).setShowMode(()=>{
            return false;
        });


        let attributes = {
            iconGroup,
            titleGroup,
            mainGroup,
            advancedGroup
        };

        this.setAttributes(attributes);
    }

    tabContainer(){
        this.attributes.advancedGroup.attributes.containerType.value = 'tab';
        return this;
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

    addModule(module){
        addItem(module,this.modules);
    }

    deleteModule(index){
        deleteItem(index,this.modules);
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
