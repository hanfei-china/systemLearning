import {typeIcons} from "./memberGroupTools";

export default class MemberGroupEntity {

    icon: string = typeIcons.folder; //图标

    id: string; //分组id

    name: string; //分组名称

    isFolder: boolean; //是否为文件夹

    groupType: number | string; //分组类型 分组类型：0-静态分组；1-条件分组；2-枚举分组；3-标签分组; 4-分会分组

    parentId: string; //父级id

    children: Array<MemberGroupEntity> = []; //子级

    disabled: boolean = false; //节点是否禁用


    /**
     * 构造函数
     * @param config
     * @param childGroups
     * @param filterNodeId 过滤id，该id的分组将不会加载出来
     * @param isFolder 是否为文件夹
     * @param groupType 分组类型 分组类型：0-静态分组；1-条件分组；2-枚举分组；3-标签分组; 4-分会分组
     */
    constructor(config: {
                    id?: string,
                    name: string,
                    isFolder?: boolean,
                    groupType: number | string,
                    parentId: string,
                    disabled: boolean
                },
                childGroups: Array<any>,) {
        this.id = config.id;
        this.name = config.name;
        this.isFolder = config.isFolder;
        this.groupType = config.groupType;
        this.parentId = config.parentId;
        this.disabled = config.disabled;
        if (!config.isFolder) {
            this.setIcon(config.groupType);
        }

        this.translator(childGroups);
    }

    setIcon(groupType){
        this.icon = typeIcons[groupType];
    }


    setChildren(children: Array<MemberGroupEntity>) {
        if (children && children.length > 0) {
            this.children = children;
        }

        return this;
    }


    translator(allNodes: Array<any>){
        let parents = allNodes.filter(node => {
            return node.parentId === this.id;
        });

        let children = allNodes.filter(node => {
            return node.parentId !== this.id;
        });

        let resultParents = [];
        for (let node of parents) {
            resultParents.push(new MemberGroupEntity(node, children));
        }

        this.setChildren(resultParents);
    }

}
