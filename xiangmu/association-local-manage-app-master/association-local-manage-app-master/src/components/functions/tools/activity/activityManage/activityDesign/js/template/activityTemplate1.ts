import ActivityTemplate from '../base/activityTemplate';
import FallFlowModule from "../module/fallFlowModule";

import {detailIcon,albumIcon,commentIcon,usersIcon,guestIcon,template1Sample} from '../common/icons';

export default class ActivityTemplate1 extends ActivityTemplate{

    constructor() {
        super('activityTemplate1',template1Sample);

        this.initDefaultModules();
        this.initAttributes();
    }

    initDefaultModules(){

        this.setActivityModule([
            new FallFlowModule('guests', null, guestIcon, '活动嘉宾'),

            new FallFlowModule('signUpUsers', null, usersIcon, '报名人员'),

            new FallFlowModule('activityDetail',null,detailIcon,'活动详情'),

            new FallFlowModule('activityAlbum', null, albumIcon, '活动掠影'),

            new FallFlowModule('activityComment', null, commentIcon, '留言交流'),
        ]);

        return this;
    }

    initAttributes(){
        return this;
    }
}
