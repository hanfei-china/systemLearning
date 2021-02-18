import Module from '../base/module';

import AttributeGroup from '../base/attributeGroup';

import Attribute from '../base/attribute';

import {lineIcon} from "../common/icons";

export default class FallFlowModule extends Module{

    constructor(name: string, id: string, icon: string, title: string,
                isActivityModule :boolean = true) {
        super('fallFlowModule',name,id,icon,title,isActivityModule);

        this.initAttribute(lineIcon,title);
    }

    initAttribute(defaultIcon:string, defaultTitle:string){

        let hidden = new Attribute('隐藏模块', 'checkbox', false).addAttributes({
            content: '隐藏模块'
        }).hiddenTitle();

        let moduleGroup = new AttributeGroup('moduleGroup', '模块设置')
            .setAttributes({hidden});

        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', defaultTitle).addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleGroup = new AttributeGroup('titleGroup', '标题设置')
            .setAttributes({showTitle, title});

        let showIcon = new Attribute('显示图标', 'checkbox', true).addAttributes({
            content: '显示图标'
        }).hiddenTitle();

        let icon = new Attribute('上传图标','image',defaultIcon)
            .setShowMode(() => {
                return showIcon.value === true;
            }).addAttributes({
                placeholder: '建议使用20*20或等比例的图片作为图标'
            });

        let iconGroup = new AttributeGroup('iconGroup', '图标设置')
            .setAttributes({showIcon, icon});

        let showDivingLine = new Attribute('显示分割线','checkbox', true).addAttributes({
            content: '显示分割线'
        }).hiddenTitle();

        let divingLineStyle = new Attribute('分割线样式', 'unifiedBorder', {
            borderColor: '#f3f3f3',
            borderWidth: 1,
            borderStyle: 'solid'
        }).setShowMode(()=>{
            return showDivingLine.value === true;
        });

        let divingLineGroup = new AttributeGroup('divingLineGroup','分割线设置').setAttributes({showDivingLine, divingLineStyle});

        this.setAttributes({moduleGroup, titleGroup, iconGroup, divingLineGroup});
    }
}
