import Module from '../Module';
import Attribute from "../Attribute";

export default class AlumniClubsTrends extends Module{

    constructor(config){
        super('alumniClubsTrends');

        let title,isLoadByBranchId;

        title = new Attribute('textAttr','动态')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题',
                maxLength: 10,
            });

        isLoadByBranchId = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '是否根据分会加载数据',
                content: '根据分会加载数据'
            }).openRequired(() => {
                return true;
            });

        let attributes = {title, isLoadByBranchId};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }

}
