import ActivityTemplate from '../base/activityTemplate';
import ButtonModule from "../module/buttonModule";

import {detailIcon,albumIcon,mapIcon,commentIcon,ticketIcon,usersIcon,guestIcon,linkIcon,template2Sample} from '../common/icons';
import Attribute from "../base/attribute";
import AttributeGroup from "../base/attributeGroup";

export default class ActivityTemplate2 extends ActivityTemplate{

    constructor() {
        super('activityTemplate2',template2Sample);

        this.initDefaultModules();
        this.initAttributes();
    }

    initDefaultModules(){

        this.setActivityModule([
            new ButtonModule('guests', null, guestIcon, '活动嘉宾','#F5BF11'),

            new ButtonModule('signUpUsers', null, usersIcon, '报名人员','#3E99F6'),

            new ButtonModule('activityDetail',null,detailIcon,'活动详情','#3E99F6'),

            new ButtonModule('activityAlbum', null, albumIcon, '活动掠影','#3E99F6'),

            new ButtonModule('addressDate', null, mapIcon, '地点时间','#8085EB'),

            new ButtonModule('activityComment', null, commentIcon, '留言交流','#F5BF11'),

            new ButtonModule('signUpTicket', null, ticketIcon, '我的票据','#F5BF11'),
        ]);

        this.setCustomModules([
            new ButtonModule('customFunction',null, linkIcon,'自定义功能','#FF7283', false),
        ]);

        return this;
    }

    initAttributes(){
        let showText = new Attribute('显示文字', 'checkbox', true).addAttributes({
            content: '显示文字'
        }).hiddenTitle();

        let maskBackgroundColor = new Attribute('蒙板颜色', 'color', 'rgba(0,0,0,.5)').addAttributes({
            showAlpha: true,
            titleStyle: {
                width: '60px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showText.value === true;
        });

        let textColor = new Attribute('文字颜色', 'color', '#ffffff').addAttributes({
            showAlpha: true,
            titleStyle: {
                width: '60px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showText.value === true;
        });

        let templateGroup = new AttributeGroup('templateGroup', '模版配置')
            .setAttributes({showText, textColor, maskBackgroundColor});



        this.setAttributes({templateGroup});
        return this;
    }
}
