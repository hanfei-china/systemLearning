import Module from '../Module';
import Attribute from "../Attribute";

export default class AlumniClubsActivities extends Module{

    constructor(config){
        super('alumniClubsActivities');

        let title, dataMaxCount, listStyle, isLoadByBranchId;

        title = new Attribute('textAttr','精彩活动等你参与')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题',
                maxLength: 15,
            });

        dataMaxCount = new Attribute('numberAttr', 6)
            .addAttributes({
                title: '内容最大查询数量',
                min: 2,
                max: 10
            });

        listStyle = new Attribute('selectAttr','actListStyle1')
            .addAttributes({
                title: '列表样式',
                items: [
                    {value: 'actListStyle1', title: '列表样式1'},
                    {value: 'actListStyle2', title: '列表样式2'},
                    {value: 'actListStyle3', title: '列表样式3'}
                ],
            });

        isLoadByBranchId = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '是否根据分会加载数据',
                content: '根据分会加载数据'
            }).openRequired(() => {
                return true;
            });

        let attributes = {title, dataMaxCount,listStyle,isLoadByBranchId};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
