import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem,deleteItem} from '../../../util/arrayUtil';

export default class WsCellTabPane extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '页签项';
        super('wsCellTabPane', id, title, '1.0');
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

        let title = new Attribute('标题内容', 'text', '图文列表').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        });

        // let font = new Attribute('标题字体设置', 'font', {
        //     fontSize: '14px',
        //     color: '#5F6061',
        //     italic: false,
        //     bold: false,
        //     textDecoration: false,
        //     fontFamily: '微软雅黑',
        //     textAlign: 'center',
        // }).addAttributes({
        //     textAlign: {show: false}
        // });


        let titleGroup = new AttributeGroup('titleGroup', '标题设置').setAttributes({
            title
        });


        let attributes = {
            iconGroup,
            titleGroup,
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
