import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsPDFField extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '字段';
        super('wsPDFField',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let field = new Attribute('绑定字段','certificateField',{
            fieldId: '',
            fieldType: '',
            dateFormat: 'yyyy-MM-dd',
            label: ''
        }).addAttributes({
            titleStyle: {
                width: '52px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let fieldGroup = new AttributeGroup('fieldGroup','字段设置').setAttributes({field});

        let layout = new Attribute('布局设置','layout',{
            width: 100,
            height: 48,
            left: 309,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置').setAttributes({layout});

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

        let fontGroup = new AttributeGroup('fontGroup','字体设置').setAttributes({font});


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

        let styleGroup = new AttributeGroup('styleGroup','样式设置').setAttributes({backgroundColor, border, borderRadius});

        let attributes = {fieldGroup,layoutGroup, fontGroup, styleGroup};

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
