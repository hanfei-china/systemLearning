const uuidTimestamp = require('uuid/v1');
import {typeIcons} from "./memberGroupTools";
import GroupCondition from "../../../../tools/mpDesign/attributes/memberQueryBuilder/js/groupCondtion";

export default class MemberGroupVirtualEntity {

    icon: string = typeIcons.folder; //图标

    localId: string; //本地id

    id: string; //分组id

    name: string; //分组名称

    isFolder: boolean; //是否为文件夹

    groupType: number | string; //分组类型 分组类型：0-静态分组；1-条件分组；2-枚举分组(2-2 单选枚举子级 2-3 多选枚举子级 2-6 地区枚举子级 2-8 枚举枚举子级)；3-标签分组(3c 标签子级); 4-分会分组(4c 分会子级 4t 分会类型)

    conditions: string | Object; //条件分组拼接的条件

    objectId: string;  //枚举字段的id

    parentId: string; //父级id

    unRealEntity: boolean = false; //是否不是真实的节点

    rootId: string; //枚举、标签、分会分组根id

    field: any; //条件绑定的字段

    fieldType: number; //字段类型

    parent: MemberGroupVirtualEntity = null; //父级

    children: Array<MemberGroupVirtualEntity> = []; //子级

    value: any; //真实的比较对象

    level: number = 0; //层级

    constructor(config: {
                    id?: string,
                    name: string,
                    isFolder?: boolean,
                    groupType: number | string,
                    conditions?: string | Object,
                    objectId?: string,
                    parentId?: string,
                    unRealEntity?: boolean,
                    value: any,
                    rootId?: string,
                    field?: any,
                    localId?: any
                },
                resources: Object | null,
                childGroups: Array<any>,
                level: number,
                virtualGroups?: Array<any>,
                virtualType?: string) {
        let id = config.id;
        this.id = id;
        this.localId = config.localId || uuidTimestamp();
        this.name = config.name;
        this.isFolder = config.isFolder;
        this.groupType = config.groupType;
        this.objectId = config.objectId;
        this.parentId = config.parentId;
        this.unRealEntity = config.unRealEntity;
        this.value = config.value;
        this.rootId = config.rootId;
        this.level = level;
        this.field = config.field;

        if (!config.isFolder) {
            this.setIcon(config.groupType);
            if (config.groupType === 1 && config.conditions) {
                this.conditions = config.conditions;
                this.translator(childGroups, resources);
            }

            if (['2-2', '2-3', '2-6', '2-8', '3c', '4c', -1].indexOf(config.groupType) > -1 && (!virtualGroups || virtualGroups.length <= 0)) {
                //末级虚拟分组
                this.virtualChildTranslator(resources, childGroups);

            } else if (virtualType && virtualGroups && virtualGroups.length > 0) {
                //虚拟节点，并且拥有虚拟节点
                if (virtualType === '2-6') {
                    this.areaTranslator(virtualGroups, resources, childGroups, config.rootId, level += 1, config.field);
                }

                if (virtualType === '2-8') {
                    this.enumTranslator(virtualGroups, resources, childGroups, config.rootId, level += 1, config.field);
                }

                if (virtualType === '4t') {
                    this.branchTranslator(virtualGroups, resources, childGroups, config.rootId, level += 1);
                }
            } else {
                if ([0, '0', 1, '1'].indexOf(config.groupType) > -1) {
                    this.translator(childGroups, resources);
                }


                //枚举分组
                if ([2, '2'].indexOf(config.groupType) > -1 && config.objectId && resources) {
                    let field = resources[config.objectId];
                    if (field) {
                        this.field = field;
                        let {topicType, parameter} = field;
                        //code 2,3,6,8 单选 多选 地区 枚举
                        if (topicType === 2) {
                            this.radioTranslator(parameter.options, resources, childGroups, id, level += 1, field);
                        }

                        if (topicType === 3) {
                            this.checkboxTranslator(parameter.options, resources, childGroups, id, level += 1, field);
                        }

                        if (topicType === 6) {
                            this.areaTranslator(parameter, resources, childGroups, id, level += 1, field);
                        }

                        if (topicType === 8) {
                            this.enumTranslator(parameter, resources, childGroups, id, level += 1, field);
                        }
                    }

                }

                //标签分组
                if ([3, '3'].indexOf(config.groupType) > -1 && config.objectId && resources) {
                    let labelTypes = resources['labels'];
                    let parameter = [];
                    for (let labelType of labelTypes) {
                        let {id, labels} = labelType;
                        if (id === config.objectId) {
                            parameter = labels;
                            break;
                        }
                    }
                    this.labelTranslator(parameter, resources, childGroups, id, level += 1);

                }

                if ([4, '4'].indexOf(config.groupType) > -1 && resources) {
                    let parameter = resources['branch'];
                    this.branchTypeTranslator(parameter, resources, childGroups, id, level += 1);

                }
            }


        } else {
            this.translator(childGroups, resources);
        }

    }

    setIcon(groupType) {
        this.icon = typeIcons[groupType];
    }

    setParent(parent: MemberGroupVirtualEntity) {
        this.parent = parent;
        return this;
    }

    setChildren(children: Array<MemberGroupVirtualEntity>) {
        if (children && children.length > 0) {
            this.children = children;
        }

        return this;
    }

    translator(allNodes: Array<any>, resources: Object | null) {
        let parents = allNodes.filter(node => {
            return node.parentId === this.id;
        });

        let children = allNodes.filter(node => {
            return node.parentId !== this.id;
        });

        let resultParents = [];
        for (let node of parents) {
            resultParents.push(new MemberGroupVirtualEntity(node, resources, children, 0).setParent(this));
        }

        this.setChildren(resultParents);
    }

    enumTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId: string, level: number, field: any) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '2-8';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {enumName, subLayer} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    name: enumName,
                    value: enumName,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId,
                    field
                }, resources, children, level, subLayer, virtualType).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    areaTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number, field: any) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '2-6';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {name, children: subLayer} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    name: name,
                    value: name,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId,
                    field
                }, resources, children, level, subLayer, virtualType).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    radioTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number, field: any) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '2-2';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {key, title} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    id:key,
                    name: title,
                    value: key,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId,
                    field
                }, resources, children, level).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    checkboxTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number, field: any) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '2-3';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {key, title} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    id:key,
                    name: title,
                    value: key,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId,
                    field
                }, resources, children, level).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    labelTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '3c';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {id, title} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    id,
                    name: title,
                    value: id,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId
                }, resources, children, level).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    branchTypeTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '4t';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {id, name, branchList:subLayer} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    id,
                    name: name,
                    value: id,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId
                }, resources, children, level, subLayer, virtualType).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    branchTranslator(virtualGroups: Array<any>, resources, children: Array<any>, rootId, level: number) {
        if (virtualGroups && virtualGroups.length > 0) {
            let virtualType = '4c';
            let resultChildren = [];
            for (let node of virtualGroups) {
                let {id, name} = node;
                resultChildren.push(new MemberGroupVirtualEntity({
                    id,
                    name: name,
                    value: id,
                    groupType: virtualType,
                    isFolder: false,
                    parentId: this.id,
                    unRealEntity: true,
                    rootId
                }, resources, children, level).setParent(this));

            }

            this.setChildren(resultChildren);
        }
    }

    /**
     * 虚拟末级节点子级构建
     * @param resources
     * @param allNodes
     */
    virtualChildTranslator(resources, allNodes: Array<any>) {
        let parents = allNodes.filter(node => {
            return node.parentId == this.rootId;
        });

        let children = allNodes.filter(node => {
            return node.parentId !== this.rootId;
        });

        let resultParents = [];
        for (let node of parents) {
            resultParents.push(new MemberGroupVirtualEntity(node, resources, children, 0).setParent(this));
        }

        this.setChildren(resultParents);
    }

    getCondition(condtions: Array<any>) {
        let condition = '';
        if (!this.isFolder) {
            if (this.groupType === 0) {
                condition = `t4.categoryId = '${this.id}'`
            } else if (this.groupType === 1) {
                condition = new GroupCondition(this.conditions).getCondition();
            } else if (this.groupType === '2-2') {
                //单选项
                if (this.field) {
                    condition = `t1.${this.field.code} = '${this.value}'`;
                }
            } else if (this.groupType === '2-3') {
                //多选项
                if (this.field) {
                    condition = `json_contains(t1.${this.field.code},json_array('${this.value}'))`
                }
            } else if (this.groupType === '2-6' || this.groupType === '2-8') {
                //地区和枚举
                if (this.field) {
                    condition = `json_extract(t1.${this.field.code},'$[${this.level-1}]') = '${this.value}'`;
                }
            } else if (this.groupType === 2) {
                condition = `t1.${this.field.code} is not null`;
            } else if (this.groupType === '3c') {
                //地区和枚举
                condition = `json_contains(json_extract(t1.label,'$[*].labelId'),json_array('${this.value}'))`;
            } else if (this.groupType === 3) {
                condition = `t1.label is not null`;
            } else if (this.groupType === '4t') {
                let children = this.children;
                let length = children.length;
                if(length > 0){
                    condition = 't3.branchId in (';
                    children.forEach((child,index)=>{
                        if(index === length-1){
                            condition += `'${child.id}'`;
                        }else{
                            condition += `'${child.id}',`;
                        }
                    });
                    condition += ') and t3.status = 1';
                }
            }  else if (this.groupType === '4c') {
                condition = `t3.branchId = '${this.value}' and t3.status = 1`
            } else if (this.groupType === 4) {
                condition = `t3.status = 1`
            }
        }

        if (condition && this.parent && !this.parent.isFolder) {
            condition = ' and ' + condition;
            this.parent.getCondition(condtions);
        }

        if (condtions) {
            condtions.push(condition);
        }

        return condition;
    }

    getFinishCondition() {
        let conditions = [];

        this.getCondition(conditions);
        let _conditions = '';
        for (let condition of conditions) {
            _conditions += condition;
        }

        return _conditions;
    }

}
