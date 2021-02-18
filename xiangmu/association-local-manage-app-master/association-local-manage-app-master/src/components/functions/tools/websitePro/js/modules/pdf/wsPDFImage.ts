import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsPDFImage extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '图片';
        super('wsPDFImage',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let srcGroup = new AttributeGroup('srcGroup','上传图片');

        let src = new Attribute('上传图片','image','').hiddenTitle();

        srcGroup.setAttributes({src});

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 100,
            height: 100,
            left: 809,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        layoutGroup.setAttributes({layout});

        let styleGroup = new AttributeGroup('styleGroup','样式设置');

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let border = new Attribute('边框', 'border', {
            top:{
                borderColor: '#409EFF',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: '#409EFF',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left:{
                borderColor: '#409EFF',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right:{
                borderColor: '#409EFF',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            showAlpha: false
        });


        styleGroup.setAttributes({border, borderRadius});


        let attributes = {srcGroup,layoutGroup, styleGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let attributes = moduleConfig.attributes;

        this.syncAttributes(attributes);
    }
}
