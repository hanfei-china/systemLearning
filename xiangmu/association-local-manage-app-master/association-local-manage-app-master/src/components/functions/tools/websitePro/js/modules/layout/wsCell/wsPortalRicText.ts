import Module from '../../../base/module';

import AttributeGroup from '../../../base/attributeGroup';

import Attribute from '../../../base/attribute';
import {moduleBuilder} from "../../moduleBuilder";

import {addItem} from '../../../util/arrayUtil';

export default class WsPortalRichText extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '富文本';
        super('wsPortalRichText', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {

        let content = new Attribute('富文本内容','richText','');

        let contentGroup = new AttributeGroup('contentGroup', '内容设置')
            .setAttributes({content});

        let padding = new Attribute('容器内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        });


        let containerGroup = new AttributeGroup('containerGroup', '容器设置')
            .setAttributes({padding});

        let attributes = {
            contentGroup,
            containerGroup
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
