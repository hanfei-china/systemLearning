import MemberGroupVirtualEntity from "./memberGroupVirtualEntity";
import MemberGroupEntity from "./memberGroupEntity";

export function treeFormingVirtualGroup(allNodes: Array<any>, resources: any) {

    let parents = allNodes.filter(node => {
        return !node.parentId;
    });

    let children = allNodes.filter(node => {
        return node.parentId;
    });

    let resultParents = [];
    for(let node of parents){
        resultParents.push(new MemberGroupVirtualEntity(node,resources,children,0));
    }

    return resultParents;
}

/**
 * 树化节点
 * @param allNodes
 * @param filterNodeId
 * @param isFolder 是否为文件夹
 * @param groupType 分组类型 分组类型：0-静态分组；1-条件分组；2-枚举分组；3-标签分组; 4-分会分组
 * @param onlyStatic 是否只有静态分组可选
 */
export function treeFormingGroup(allNodes: Array<any>, filterNodeId:string, isFolder: boolean, groupType: string | number,onlyStatic:boolean) {
    let parents = [];
    let children = [];
    if(onlyStatic){
        allNodes = allNodes.filter(node=>{
            let {groupType: nodeGroupType,isFolder: nodeIsFolder} = node;
            return nodeIsFolder || nodeGroupType === 0;
        });

        parents = allNodes.filter(node => {
            let {parentId,isFolder: nodeIsFolder} = node;

            node.disabled = !!nodeIsFolder;
            return !parentId;
        });

        children = allNodes.filter(node => {
            let {parentId,isFolder: nodeIsFolder} = node;

            node.disabled = !!nodeIsFolder;
            return parentId;
        });

    }else{
        parents = allNodes.filter(node => {
            let {parentId,id,isFolder: nodeIsFolder} = node;
            node.disabled = false;
            if(isFolder){
                node.disabled = nodeIsFolder !== true;
            }else{
                //静态分组
                if(groupType === 0){
                    node.disabled = nodeIsFolder !== true;
                }
            }
            if(filterNodeId){
                return !parentId && id !== filterNodeId;
            }
            return !parentId;
        });

        children = allNodes.filter(node => {
            let {parentId,id,isFolder: nodeIsFolder} = node;
            node.disabled = false;
            if(isFolder){
                node.disabled = nodeIsFolder !== true;
            }else{
                //静态分组
                if(groupType === 0){
                    node.disabled = nodeIsFolder !== true;
                }
            }
            if(filterNodeId){
                return parentId && id !== filterNodeId;
            }
            return parentId;
        });
    }



    let resultParents = [];
    for(let node of parents){
        resultParents.push(new MemberGroupEntity(node,children));
    }

    return resultParents;
}

export const groupTypes = [
    {
        id: -1,
        title: '文件夹',
        icon: 'el-icon-folder',
    },
    {
        id: 0,
        title: '静态分组',
        icon: 'el-icon-video-pause',
    },
    {
        id: 1,
        title: '条件分组',
        icon: 'el-icon-s-operation',
    },
    {
        id: 2,
        title: '枚举分组',
        icon: 'el-icon-s-promotion',
    },
    {
        id: 3,
        title: '标签分组',
        icon: 'el-icon-price-tag',
    },
    {
        id: 4,
        title: '分会分组',
        icon: 'el-icon-office-building',
    },
];

export const groupTypesForBranch = [
    {
        id: -1,
        title: '文件夹',
        icon: 'el-icon-folder',
    },
    {
        id: 0,
        title: '静态分组',
        icon: 'el-icon-video-pause',
    },
    {
        id: 1,
        title: '条件分组',
        icon: 'el-icon-s-operation',
    },
    {
        id: 2,
        title: '枚举分组',
        icon: 'el-icon-s-promotion',
    },
    {
        id: 3,
        title: '标签分组',
        icon: 'el-icon-price-tag',
    },
];

export const typeIcons = {
    folder: 'el-icon-folder',
    0: 'el-icon-video-pause',
    1: 'el-icon-s-operation',
    2: 'el-icon-s-promotion',
    '2-2': 'el-icon-s-promotion',
    '2-3': 'el-icon-s-promotion',
    '2-6': 'el-icon-s-promotion',
    '2-8': 'el-icon-s-promotion',
    3: 'el-icon-price-tag',
    '3c': 'el-icon-price-tag',
    4: 'el-icon-office-building',
    '4t': 'el-icon-office-building',
    '4c': 'el-icon-office-building',
};
