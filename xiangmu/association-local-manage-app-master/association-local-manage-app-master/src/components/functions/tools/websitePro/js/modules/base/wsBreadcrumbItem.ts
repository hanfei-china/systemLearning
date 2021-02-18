import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export default class WsBreadcrumbItem extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '面包屑子项';
        super('wsBreadcrumbItem',id,title,'1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){
        let otherGroup = new AttributeGroup('otherGroup','其他设置');

        let customClasses = new Attribute('class','text','').addAttributes({
            placeholder: '自定义class',
            titleStyle:{
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let linkConfig = new Attribute('链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 1, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).hiddenTitle();

        let linkGroup = new AttributeGroup('linkGroup','链接设置').setAttributes({
            linkConfig
        });


        otherGroup.setAttributes({customClasses});

        let attributes = {linkGroup,otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(){
        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        this.syncAttributes(moduleConfig.attributes);
    }

}
