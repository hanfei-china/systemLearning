import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';



export default class WsMap extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '分会地图';
        super('WsMap', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute() {
        let mapDataGroup = new AttributeGroup('mapDataGroup', '地图参数设置')
        let mapData = new Attribute('地图参数', 'mapData', {
            apiKey: ''
        });
        mapDataGroup.setAttributes({mapData})

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

        let attributes = {
            mapDataGroup,
            layoutGroup
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
                mapDataGroup: {
                    mapData: {
                        apiKey: ''
                    }
                }
            }

        } else {
            attributes = moduleConfig.attributes;
        }
        console.log(attributes)

        this.syncAttributes(attributes);
    }

}
