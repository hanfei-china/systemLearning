import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsPDFText extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '文本';
        super('wsPDFText',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let contentGroup = new AttributeGroup('contentGroup','文本内容');

        let content = new Attribute('文本内容','text','文本').addAttributes({
            type: 'text',
            resize: 'none',
            rows: 4,
            placeholder: '请输入文本内容'
        }).hiddenTitle();

        contentGroup.setAttributes({content});

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 100,
            height: 48,
            left: 309,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        layoutGroup.setAttributes({layout});

        let fontGroup = new AttributeGroup('fontGroup','字体设置');

        let font = new Attribute('字体设置','font',{
            fontSize: '12px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: 'Microsoft YaHei',
            textAlign: 'left',
        }).addAttributes({
            fonts: [
                {name: 'Microsoft YaHei', title: '微软雅黑'},
                {name: 'Arial Serif', title: 'Arial Serif'},
            ]
        }).hiddenTitle();

        fontGroup.setAttributes({font});


        let styleGroup = new AttributeGroup('styleGroup','样式设置');

        let backgroundColor = new Attribute('背景色','color','').addAttributes({
            showAlpha: false,
            titleStyle:{
                width: '40px',
                paddingRight: '6px'
            }
        });
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

        styleGroup.setAttributes({backgroundColor, border, borderRadius});

        let attributes = {contentGroup,layoutGroup, fontGroup, styleGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let  attributes = moduleConfig.attributes;
        this.syncAttributes(attributes);
    }
}
